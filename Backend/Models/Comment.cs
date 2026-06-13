using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CHPortfolio.Backend.Models;

public class Comment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid GridItemId { get; set; }
    public GridItem? GridItem { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;
    public IdentityUser? User { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
