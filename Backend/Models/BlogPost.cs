using System;
using Microsoft.AspNetCore.Identity;

namespace CHPortfolio.Backend.Models;

public record BlogPost(Guid Id, string Title, string Content, string Slug, string UserId)
{
    private string _slug = Slug;
    public string Slug
    {
        get => _slug;
        init
        {
            if (string.IsNullOrWhiteSpace(value) || value.Contains(' '))
            {
                throw new ArgumentException("Slug cannot be empty or contain spaces.", nameof(Slug));
            }
            _slug = value;
        }
    }

    // Navigation property for One-to-many
    public IdentityUser? Author { get; init; }
}
