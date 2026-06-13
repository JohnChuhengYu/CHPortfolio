using CHPortfolio.Backend.Data;
using CHPortfolio.Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;



var builder = WebApplication.CreateBuilder(args);

// --- 1. 配置 CORS (跨域请求) ---
var frontendUrls = builder.Configuration.GetSection("FrontendUrls").Get<string[]>() ?? new[] { "http://localhost:5173" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(frontendUrls)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // 允许前端携带认证凭据 (Cookie/Token)
    });
});

// --- 2. 配置 Controllers (用于 UploadController) ---
builder.Services.AddControllers();

// --- 3. 配置 OpenAPI ---
builder.Services.AddOpenApi();

// --- 4. 配置 EF Core & PostgreSQL ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- 5. 配置认证与 Identity API ---
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = IdentityConstants.BearerScheme;
        options.DefaultChallengeScheme = IdentityConstants.BearerScheme;
    })
    .AddCookie(IdentityConstants.ApplicationScheme)
    .AddBearerToken(IdentityConstants.BearerScheme);

builder.Services.Configure<Microsoft.AspNetCore.Authentication.BearerToken.BearerTokenOptions>(IdentityConstants.BearerScheme, options =>
{
    options.BearerTokenExpiration = TimeSpan.FromDays(30);
});

builder.Services.AddIdentityCore<IdentityUser>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddApiEndpoints();

var app = builder.Build();

// --- 配置 HTTP 请求管道 ---
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// --- 6. 配置静态文件服务 ---
// 显式配置 PhysicalFileProvider 确保就算 wwwroot 初始不存在也能正确映射 /uploads 目录
var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
// --- 6.5 Analytics: POST /api/track called by frontend once per page navigation ---
// De-duplication is done on the client side via sessionStorage (one hit per path per session).


// --- 7. 映射 Controllers ---
app.MapControllers();

// --- 8. 映射 Identity API ---
app.MapIdentityApi<IdentityUser>();

// --- 9. 映射 GridItem 的 Minimal API (CRUD 适配) ---
var gridItemsApi = app.MapGroup("/api/grid-items");

// GET /api/grid-items 返回所有格子数据，按 UpdatedAt 降序排列
gridItemsApi.MapGet("/", async (string? type, AppDbContext db) =>
{
    var query = db.GridItems.AsQueryable();
    
    if (!string.IsNullOrEmpty(type))
    {
        query = query.Where(g => g.Type == type);
    }

    return await query
        .OrderByDescending(g => g.UpdatedAt)
        .ToListAsync();
});

// GET /api/grid-items/{id} 返回单个格子数据
gridItemsApi.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var item = await db.GridItems.FindAsync(id);
    return item is not null ? Results.Ok(item) : Results.NotFound();
});

// PUT /api/grid-items/{id} 适配前端的“原地编辑”
gridItemsApi.MapPut("/{id:guid}", async (Guid id, UpdateGridItemDto dto, AppDbContext db) =>
{
    var item = await db.GridItems.FindAsync(id);
    if (item == null) return Results.NotFound();

    bool isUpdated = false;

    // 只更新前端传递的有值的字段
    if (dto.Title != null) { item.Title = dto.Title; isUpdated = true; }
    if (dto.SubTitle != null) { item.SubTitle = dto.SubTitle; isUpdated = true; }
    if (dto.Content != null) { item.Content = dto.Content; isUpdated = true; }
    if (dto.ProblemDescription != null) { item.ProblemDescription = dto.ProblemDescription; isUpdated = true; }
    if (dto.SolutionDescription != null) { item.SolutionDescription = dto.SolutionDescription; isUpdated = true; }
    if (dto.Tags != null) { item.Tags = dto.Tags; isUpdated = true; }
    if (dto.GithubUrl != null) { item.GithubUrl = dto.GithubUrl; isUpdated = true; }
    if (dto.ImageUrl != null) { item.ImageUrl = dto.ImageUrl; isUpdated = true; }
    if (dto.GalleryImages != null) { item.GalleryImages = dto.GalleryImages; isUpdated = true; }
    if (dto.Color != null) { item.Color = dto.Color; isUpdated = true; }
    if (dto.GridSpanX.HasValue) { item.GridSpanX = dto.GridSpanX.Value; isUpdated = true; }
    if (dto.GridSpanY.HasValue) { item.GridSpanY = dto.GridSpanY.Value; isUpdated = true; }

    if (isUpdated)
    {
        item.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    return Results.Ok(item);
}).RequireAuthorization(); // 必须登录才可以修改

// DELETE /api/grid-items/{id} 删除 GridItem
gridItemsApi.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var item = await db.GridItems.FindAsync(id);
    if (item == null) return Results.NotFound();

    db.GridItems.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization(); // 必须登录才可以删除

// (辅助开发) POST /api/grid-items : 创建新的 GridItem
gridItemsApi.MapPost("/", async (GridItem item, AppDbContext db) =>
{
    item.CreatedAt = DateTime.UtcNow;
    item.UpdatedAt = DateTime.UtcNow;
    db.GridItems.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/api/grid-items/{item.Id}", item);
}).RequireAuthorization(); // 必须登录才可以创建

// --- 9.2 映射 Admin Stats 接口 ---
app.MapGet("/api/admin/stats", async (AppDbContext db, System.Security.Claims.ClaimsPrincipal user) =>
{
    var email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                ?? user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                ?? user.Identity?.Name;
                
    var isAdmin = email == "admin@chportfolio.dev" || email == "ych0911y@gmail.com";
    if (!isAdmin) return Results.Forbid();

    var projectCount = await db.GridItems.CountAsync(g => g.Type == "Project");
    var dailyCount = await db.GridItems.CountAsync(g => g.Type == "Daily");
    var devlogCount = await db.GridItems.CountAsync(g => g.Type == "DevLog");
    var commentCount = await db.Comments.CountAsync();
    
    // Analytics
    var totalViews = await db.VisitorLogs.CountAsync();
    var uniqueVisitors = await db.VisitorLogs
        .Select(v => v.UserEmail != null && v.UserEmail != "" ? v.UserEmail : v.IpAddress)
        .Distinct()
        .CountAsync();
    var registeredUsers = await db.Users.CountAsync();

    return Results.Ok(new {
        projects = projectCount,
        daily = dailyCount,
        devlogs = devlogCount,
        comments = commentCount,
        totalViews = totalViews,
        uniqueVisitors = uniqueVisitors,
        registeredUsers = registeredUsers
    });
}).RequireAuthorization();

// --- 9.2b POST /api/track — frontend sends one ping per page navigation ---
app.MapPost("/api/track", async (AppDbContext db, HttpContext context, TrackRequest? body) =>
{
    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
    var userAgent = context.Request.Headers["User-Agent"].ToString();
    var path = body?.Path ?? "/";
    
    string? userEmail = context.User?.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                       ?? context.User?.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                       ?? context.User?.Identity?.Name;

    db.VisitorLogs.Add(new VisitorLog {
        IpAddress = ip,
        UserEmail = userEmail,
        UserAgent = userAgent,
        Path = path,
        Timestamp = DateTime.UtcNow
    });
    await db.SaveChangesAsync();
    return Results.Ok();
});

// --- 9.2c DELETE /api/admin/clear-logs — clear all visitor logs ---
app.MapDelete("/api/admin/clear-logs", async (AppDbContext db, System.Security.Claims.ClaimsPrincipal user) =>
{
    var email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                ?? user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                ?? user.Identity?.Name;
                
    var isAdmin = email == "admin@chportfolio.dev" || email == "ych0911y@gmail.com";
    if (!isAdmin) return Results.Forbid();

    db.VisitorLogs.RemoveRange(db.VisitorLogs);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "All visitor logs cleared." });
}).RequireAuthorization();

// --- 9.3 映射 Admin Users 列表 ---
app.MapGet("/api/admin/users", async (AppDbContext db, System.Security.Claims.ClaimsPrincipal user) =>
{
    var email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                ?? user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                ?? user.Identity?.Name;
                
    var isAdmin = email == "admin@chportfolio.dev" || email == "ych0911y@gmail.com";
    if (!isAdmin) return Results.Forbid();

    var users = await db.Users
        .OrderByDescending(u => u.Id) // Simplified ordering
        .Select(u => new {
            u.Id,
            u.UserName,
            Email = u.Email,
            CommentCount = db.Comments.Count(c => c.UserId == u.Id),
            LastAction = db.Comments.Where(c => c.UserId == u.Id).OrderByDescending(c => c.CreatedAt).Select(c => c.CreatedAt).FirstOrDefault()
        })
        .ToListAsync();

    return Results.Ok(users);
}).RequireAuthorization();

// --- 9.4 映射 Analytics Trend 接口 ---
app.MapGet("/api/admin/analytics/views-trend", async (AppDbContext db, System.Security.Claims.ClaimsPrincipal user) =>
{
    var email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                ?? user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                ?? user.Identity?.Name;
                
    var isAdmin = email == "admin@chportfolio.dev" || email == "ych0911y@gmail.com";
    if (!isAdmin) return Results.Forbid();

    var endDate = DateTime.UtcNow.Date;
    var startDate = endDate.AddDays(-13); // Last 14 days including today

    var views = await db.VisitorLogs
        .Where(v => v.Timestamp >= startDate)
        .GroupBy(v => v.Timestamp.Date)
        .Select(g => new {
            Date = g.Key,
            TotalViews = g.Count(),
            UniqueVisitors = g.Select(v => v.IpAddress).Distinct().Count()
        })
        .ToListAsync();

    // Ensure all days are represented, even with 0 views
    var trend = Enumerable.Range(0, 14)
        .Select(offset => startDate.AddDays(offset))
        .Select(date => {
            var dayData = views.FirstOrDefault(v => v.Date == date);
            return new {
                Date = date.ToString("MM/dd"),
                TotalViews = dayData?.TotalViews ?? 0,
                UniqueVisitors = dayData?.UniqueVisitors ?? 0
            };
        })
        .ToList();

    return Results.Ok(trend);
}).RequireAuthorization();

app.MapGet("/api/admin/analytics/visitor-leaderboard", async (AppDbContext db, System.Security.Claims.ClaimsPrincipal user) =>
{
    var email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                ?? user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                ?? user.Identity?.Name;
                
    var isAdmin = email == "admin@chportfolio.dev" || email == "ych0911y@gmail.com";
    if (!isAdmin) return Results.Forbid();

    // Grouping logic that ensures Identifier is never null/empty for display
    var leaderboard = await db.VisitorLogs
        .GroupBy(v => new { v.IpAddress, v.UserEmail })
        .Select(g => new {
            Identifier = (g.Key.UserEmail != null && g.Key.UserEmail != "") ? g.Key.UserEmail : (g.Key.IpAddress != "" ? g.Key.IpAddress : "Unknown"),
            IsAuthenticated = g.Key.UserEmail != null && g.Key.UserEmail != "",
            TotalViews = g.Count(),
            // Prefer real page paths over technical pings if they exist
            LastPath = g.Where(v => !v.Path.StartsWith("/manage") && !v.Path.StartsWith("/login"))
                        .OrderByDescending(v => v.Timestamp)
                        .Select(v => v.Path)
                        .FirstOrDefault() ?? g.OrderByDescending(v => v.Timestamp).Select(v => v.Path).FirstOrDefault(),
            LastActive = g.Max(v => v.Timestamp)
        })
        .GroupBy(v => v.Identifier)
        .Select(g => new {
            Identifier = g.Key,
            IsAuthenticated = g.Max(v => v.IsAuthenticated ? 1 : 0) == 1,
            TotalViews = g.Sum(v => v.TotalViews),
            LastPath = g.OrderByDescending(v => v.LastActive).Select(v => v.LastPath).FirstOrDefault(),
            LastActive = g.Max(v => v.LastActive)
        })
        .OrderByDescending(v => v.TotalViews)
        .Take(15)
        .ToListAsync();

    return Results.Ok(leaderboard);
}).RequireAuthorization();

// --- 9.5 映射 Comments 的 Minimal API ---
var commentsApi = app.MapGroup("/api/comments");

// GET /api/comments (Admin access to all comments)
commentsApi.MapGet("/", async (AppDbContext db, System.Security.Claims.ClaimsPrincipal user) =>
{
    var email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                ?? user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                ?? user.Identity?.Name;
                
    var isAdmin = email == "admin@chportfolio.dev" || email == "ych0911y@gmail.com";
    if (!isAdmin) return Results.Forbid();

    var comments = await db.Comments
        .Include(c => c.User)
        .OrderByDescending(c => c.CreatedAt)
        .Select(c => new
        {
            c.Id,
            c.GridItemId,
            c.UserId,
            UserName = c.User != null ? c.User.UserName : "Unknown",
            c.Content,
            c.CreatedAt,
            ItemTitle = db.GridItems.Where(g => g.Id == c.GridItemId).Select(g => g.Title).FirstOrDefault(),
            ItemType = db.GridItems.Where(g => g.Id == c.GridItemId).Select(g => g.Type).FirstOrDefault()
        })
        .ToListAsync();

    return Results.Ok(comments);
}).RequireAuthorization();

// GET /api/comments/grid-item/{gridItemId}
commentsApi.MapGet("/grid-item/{gridItemId:guid}", async (Guid gridItemId, AppDbContext db) =>
{
    var comments = await db.Comments
        .Include(c => c.User)
        .Where(c => c.GridItemId == gridItemId)
        .OrderByDescending(c => c.CreatedAt)
        .Select(c => new
        {
            c.Id,
            c.GridItemId,
            c.UserId,
            UserName = c.User!.UserName, // Extract username safely
            c.Content,
            c.CreatedAt,
            ItemType = db.GridItems.Where(g => g.Id == c.GridItemId).Select(g => g.Type).FirstOrDefault()
        })
        .ToListAsync();

    return Results.Ok(comments);
});

// POST /api/comments
commentsApi.MapPost("/", async (CreateCommentDto dto, AppDbContext db, System.Security.Claims.ClaimsPrincipal user) =>
{
    var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

    var comment = new Comment
    {
        GridItemId = dto.GridItemId,
        UserId = userId,
        Content = dto.Content,
        CreatedAt = DateTime.UtcNow
    };

    db.Comments.Add(comment);
    await db.SaveChangesAsync();

    // Fetch user to return the exact newly created record format
    var createdUser = await db.Users.FindAsync(userId);

    return Results.Created($"/api/comments/{comment.Id}", new
    {
        comment.Id,
        comment.GridItemId,
        comment.UserId,
        UserName = createdUser?.UserName ?? "Unknown",
        comment.Content,
        comment.CreatedAt
    });
}).RequireAuthorization();

// DELETE /api/comments/{id}
commentsApi.MapDelete("/{id:guid}", async (Guid id, AppDbContext db, System.Security.Claims.ClaimsPrincipal user) =>
{
    var userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

    var comment = await db.Comments.FindAsync(id);
    if (comment == null) return Results.NotFound();

    var email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                ?? user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value 
                ?? user.Identity?.Name;
                
    var isAdmin = email == "admin@chportfolio.dev" || email == "ych0911y@gmail.com";

    if (comment.UserId != userId && !isAdmin)
    {
        return Results.Forbid();
    }

    db.Comments.Remove(comment);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

// --- 10. 初始化默认管理员账号 (Seeding) & 自动迁移 ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // 在容器环境下自动执行 EF Migrations
    await db.Database.MigrateAsync();

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var adminEmail = "admin@chportfolio.dev";
    
    // 如果数据库里还没有这个账号，就在启动时自动创建
    if (await userManager.FindByEmailAsync(adminEmail) == null)
    {
        var adminUser = new IdentityUser { 
            UserName = adminEmail, 
            Email = adminEmail,
            EmailConfirmed = true 
        };
        // 默认密码：需包含大小写、数字和特殊字符
        await userManager.CreateAsync(adminUser, "Admin123!"); 
    }
}

app.Run();

// 用于接收原地编辑数据的局部 DTO
public class UpdateGridItemDto
{
    public string? Title { get; set; }
    public string? SubTitle { get; set; }
    public string? Content { get; set; }
    public string? ProblemDescription { get; set; }
    public string? SolutionDescription { get; set; }
    public string[]? Tags { get; set; }
    public string? GithubUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string[]? GalleryImages { get; set; }
    public string? Color { get; set; }
    public int? GridSpanX { get; set; }
    public int? GridSpanY { get; set; }
}

public class CreateCommentDto
{
    public Guid GridItemId { get; set; }
    public string Content { get; set; } = string.Empty;
}

record TrackRequest(string Path);

