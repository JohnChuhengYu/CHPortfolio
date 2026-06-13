using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CHPortfolio.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // 只有登录后可以上传图片
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("未上传任何文件。");
        }

        // 验证文件类型（仅限图片）
        var allowedContentTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowedContentTypes.Contains(file.ContentType))
        {
            return BadRequest("仅支持图片文件格式 (jpeg, png, gif, webp)。");
        }

        // 使用 GUID 重命名文件防止冲突
        var extension = Path.GetExtension(file.FileName);
        var newFileName = $"{Guid.NewGuid()}{extension}";
        
        // 确保上传目录存在
        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var filePath = Path.Combine(uploadsFolder, newFileName);

        // 保存文件
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // 返回相对路径，前端直接通过 BaseURL 拼接
        var relativeUrl = $"/uploads/{newFileName}";

        return Ok(new { url = relativeUrl });
    }

    [HttpPost("multiple")]
    public async Task<IActionResult> UploadMultipleImages(List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
        {
            return BadRequest("未上传任何文件。");
        }

        var uploadedUrls = new List<string>();
        var allowedContentTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        foreach (var file in files)
        {
            if (file.Length == 0) continue;
            if (!allowedContentTypes.Contains(file.ContentType)) continue; // 跳过不支持的格式

            var extension = Path.GetExtension(file.FileName);
            var newFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, newFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            uploadedUrls.Add($"/uploads/{newFileName}");
        }

        if (uploadedUrls.Count == 0)
        {
             return BadRequest("没有有效支持的图片文件。");
        }

        return Ok(new { urls = uploadedUrls });
    }
}
