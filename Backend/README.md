# CHPortfolio Backend

<p align="center">
  <strong>High-Performance REST API & Content Management Engine</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt=".NET 10" />
  <img src="https://img.shields.io/badge/C%23-13.0-239120?style=flat-square&logo=csharp&logoColor=white" alt="C#" />
  <img src="https://img.shields.io/badge/EF_Core-10.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt="EF Core" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 🌟 Overview

The backend service is built with **ASP.NET Core 10** using a hybrid architecture of high-speed **Minimal APIs** for content and analytics, paired with **Controllers** for specialized file uploads and Google OAuth authentication.

It powers dynamic portfolio content, visitor telemetry, comment moderation, and inline editing workflows with **PostgreSQL 17** via **Entity Framework Core 10**.

---

## 🔐 Authentication & Security

### 1. Dual-Path Google OAuth 2.0 (`/api/auth/google-login`)
The backend accepts either a Google ID Token or an Access Token:
- **Primary Path**: Validates the Google JWT `idToken` cryptographically using `GoogleJsonWebSignature.ValidateAsync()`.
- **Fallback Path**: If an access token is provided, it issues an HTTP request to `https://www.googleapis.com/oauth2/v3/userinfo` to securely extract user details.
- Automatically creates or updates the corresponding `IdentityUser` in PostgreSQL.

### 2. ASP.NET Identity Bearer Token
- Uses `Microsoft.AspNetCore.Authentication.BearerToken` with a **30-day token expiration**.
- Tokens are returned directly in JSON payloads for cross-origin SPA consumption without third-party cookie restrictions.

### 3. Role-Based Access Control (RBAC)
- Admin privileges are verified against authorized administrator credentials (default: `admin@chportfolio.dev`, `ych0911y@gmail.com`).
- Admin endpoints require both authentication and authorization checks, returning `403 Forbidden` for regular authenticated users.

---

## 🗄 Database & Domain Models

### `GridItem` (Polymorphic Content Store)
Unifies portfolio projects, daily notes, and developer logs into a queryable structure:
- `Id`: GUID primary key
- `Type`: `"Project"`, `"Daily"`, or `"DevLog"`
- `Title` / `SubTitle`: Heading and punchline/mood
- `Content`: Full Markdown article body
- `ProblemDescription` / `SolutionDescription`: Case study breakdowns
- `Tags`: String array representing categories and tech stacks
- `ImageUrl` / `GalleryImages`: Primary thumbnail and screenshot carousels
- `Color`: Neo-Brutalism theme accent color
- `GridSpanX` / `GridSpanY`: Dynamic layout coordinates

### `Comment`
- `GridItemId`: Foreign key linking to target `GridItem`
- `UserId`: Author's ASP.NET Identity user ID
- `Content`: Sanitized comment text
- `CreatedAt`: UTC timestamp

### `VisitorLog` (Analytics Engine)
- `IpAddress`: Client remote IP
- `UserEmail`: Email if authenticated, otherwise null
- `UserAgent`: Browser and device footprint
- `Path`: Visited URL route
- `Timestamp`: UTC timestamp for gap-filled 14-day trend analysis

---

## ⚡ API Endpoint Reference

### 1. Authentication
| Method | Route | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/google-login` | Public | Exchanges Google OAuth token for API Bearer Token |
| `POST` | `/login` | Public | ASP.NET Identity password login |
| `POST` | `/register` | Public | ASP.NET Identity user registration |

### 2. Grid Items (Content Management)
| Method | Route | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/grid-items?type={type}` | Public | Lists all items ordered by `UpdatedAt` descending |
| `GET` | `/api/grid-items/{id}` | Public | Returns single item details |
| `POST` | `/api/grid-items` | User | Creates new item |
| `PUT` | `/api/grid-items/{id}` | User | Partial update (non-null fields only) |
| `DELETE` | `/api/grid-items/{id}` | User | Deletes item |

### 3. Comments
| Method | Route | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/comments` | Admin | Lists all comments across the entire system |
| `GET` | `/api/comments/grid-item/{id}` | Public | Retrieves all comments for a specific item |
| `POST` | `/api/comments` | User | Submits new comment under current user |
| `DELETE` | `/api/comments/{id}` | User/Admin | Deletes comment (author or admin) |

### 4. Admin & Analytics
| Method | Route | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/admin/stats` | Admin | Content counts, total views, and unique visitors |
| `GET` | `/api/admin/users` | Admin | Registered user directory with comment frequency |
| `GET` | `/api/admin/analytics/views-trend` | Admin | 14-day date-gap-filled views trend series |
| `GET` | `/api/admin/analytics/visitor-leaderboard` | Admin | Top 15 active visitors with auth status & last path |
| `DELETE` | `/api/admin/clear-logs` | Admin | Clears all telemetry records |
| `POST` | `/api/track` | Public | Logs non-blocking page navigation ping |

### 5. Media Upload
| Method | Route | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/upload` | User | Uploads single image (jpeg, png, gif, webp) |
| `POST` | `/api/upload/multiple` | User | Uploads up to 10 images concurrently |

Uploaded media is saved to `wwwroot/uploads/` and served publicly via `/uploads/{filename}`.

---

## 🚀 Getting Started

### Option A: Docker Compose (Recommended)
From the project root:
```bash
docker-compose up -d --build
```
This launches:
- **Backend API**: `http://localhost:5298`
- **PostgreSQL 17**: `localhost:5432` (`postgres` / `postgres`)
- **pgAdmin 4**: `http://localhost:5050` (`admin@chportfolio.dev` / `admin`)

### Option B: Local CLI Development
Prerequisites: [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) and running PostgreSQL instance.

```bash
cd Backend

# Copy example settings
cp appsettings.Development.json.example appsettings.Development.json

# Run migrations and launch server
dotnet run
```

---

## 🛠 Database Migrations

Entity Framework Core migrations run **automatically on application startup** via:
```csharp
await db.Database.MigrateAsync();
```

To add new migrations manually during development:
```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

### Automatic Seeding
On first startup, the database automatically seeds a default administrator:
- **Email**: `admin@chportfolio.dev`
- **Password**: `Admin123!`
