using System;
using System.Collections.Generic;

namespace CHPortfolio.Backend.Models;

public record Skill(Guid Id, string Name)
{
    // Many-to-many relationship with Project
    public ICollection<Project> Projects { get; init; } = [];
}
