using System;

namespace CHPortfolio.Backend.Models
{
    public class VisitorLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string IpAddress { get; set; } = string.Empty;
        public string? UserEmail { get; set; }
        public string UserAgent { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
