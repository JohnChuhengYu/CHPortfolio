using System;
using System.ComponentModel.DataAnnotations;

namespace CHPortfolio.Backend.Models;

public class GridItem
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(20)]
    public string Type { get; set; } = string.Empty; // Project, Daily, DevLog

    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    public string? Content { get; set; } // Markdown

    [MaxLength(500)]
    public string? SubTitle { get; set; }

    public string[]? Tags { get; set; }
    public string? GithubUrl { get; set; }

    public string? ProblemDescription { get; set; } // Markdown
    public string? SolutionDescription { get; set; } // Markdown

    [MaxLength(1000)]
    public string? ImageUrl { get; set; }

    public string[]? GalleryImages { get; set; }

    public int GridSpanX { get; set; } = 1;
    public int GridSpanY { get; set; } = 1;

    [MaxLength(50)]
    public string Color { get; set; } = "white"; // "white", "yellow", "purple", "cyan"...

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
