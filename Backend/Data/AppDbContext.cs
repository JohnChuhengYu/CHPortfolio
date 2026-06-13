using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CHPortfolio.Backend.Models;

namespace CHPortfolio.Backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<GridItem> GridItems => Set<GridItem>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<VisitorLog> VisitorLogs => Set<VisitorLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. IdentityUser 与 BlogPost 是一对多关系 (One-to-many)
        modelBuilder.Entity<IdentityUser>(entity =>
        {
            entity.HasMany<BlogPost>()
                  .WithOne(e => e.Author)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // 2. Project 与 Skill 是多对多关系 (Many-to-many)
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasMany(e => e.Skills)
                  .WithMany(e => e.Projects)
                  // Optional: configure the join table name
                  .UsingEntity(j => j.ToTable("ProjectSkills"));
        });

        // 3. Additional configs for BlogPost
        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(150);
            entity.HasIndex(e => e.Slug).IsUnique(); // Ensure slugs are unique!
        });

        // 4. Additional configs for Skill
        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Name).IsUnique(); // Ensure skill names are unique!
        });
    }
}
