using System;
using System.Collections.Generic;

namespace CHPortfolio.Backend.Models;

public record Project(Guid Id, string Title, string Description, string Url)
{
    private string _url = Url;
    public string Url
    {
        get => _url;
        init
        {
            if (string.IsNullOrWhiteSpace(value) || !Uri.IsWellFormedUriString(value, UriKind.Absolute))
            {
                throw new ArgumentException("Invalid Project URL format.", nameof(Url));
            }
            _url = value;
        }
    }

    // Many-to-many relationship with Skill
    public ICollection<Skill> Skills { get; init; } = [];
}
