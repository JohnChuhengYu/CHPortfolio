<p align="center">
  <strong>CH<span>.</span> Portfolio</strong>
</p>

<p align="center">
  A full-stack developer portfolio built with <b>React 19</b> and <b>.NET 10</b>, featuring a <b>Neo-Brutalism</b> design system with dark mode support.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

---

## ✨ Overview

**CHPortfolio** is a personal developer portfolio and content management system. It serves as both a public-facing portfolio website and a private admin dashboard for managing content, tracking visitor analytics, and moderating user comments.

The entire application follows a **Neo-Brutalism** design language — bold borders, hard shadows, vibrant colours, and punchy typography — with full **dark mode** support including animated circular-reveal theme transitions via the View Transitions API.

---

## 🎨 Design System

The frontend implements a custom **Neo-Brutalism Design System** built on Tailwind CSS v4's `@theme` directive:

- **Typography**: Space Grotesk (headings) + JetBrains Mono (code/mono)
- **Hard Shadows**: `4px 4px 0px 0px #000` signature brutal shadows
- **Interactive Physics**: "Button Press" bounce animations with cubic-bezier easing
- **Colour Palette**: 18+ curated theme colours (yellow, purple, cyan, pink, lime, sky, etc.) with full dark mode variants
- **Custom Scrollbar**: Styled scrollbar with smooth animated transitions during theme toggle
- **Motion Effects**: `DrawUnderline`, `PopDot`, `SlapTag`, `TerminalType`, `BlockReveal` — custom Framer Motion components for hero animations
- **View Transitions**: Circular clip-path reveal animation for dark ↔ light mode switching

---

## 🚀 Features

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero section with animated intro, About Me cards, education & philosophy |
| **Projects** | `/projects` | Grid view of all projects with tags and colour-coded cards |
| **Project Detail** | `/project/:id` | Detailed view with Markdown content, problem/solution sections, image gallery, and comments |
| **Daily** | `/daily` | Timeline of daily life shares and personal updates |
| **Daily Detail** | `/daily/:id` | Full article view for individual daily posts |
| **DevLog** | `/devlog` | Developer blog / changelog list |
| **DevLog Detail** | `/devlog/:id` | Individual devlog post with Markdown rendering and syntax highlighting |
| **Components** | `/components` | Public design system showcase (live component preview) |
| **Login** | `/login` | Google OAuth login with animated transition overlay |

### Admin Dashboard (`/admin`)

The admin panel is protected behind authentication and provides a full CMS experience:

- **Dashboard** — Overview stats (projects, dailies, devlogs, comments, total views, unique visitors)
- **Views Trend** — SVG line chart showing total hits vs unique visitors over the last 14 days
- **Engagement Heatmap** — GitHub-style contribution heatmap for traffic visualisation
- **Visitor Leaderboard** — Top 15 most active visitors with authenticated/anonymous indicators
- **User Directory** — List of registered users with comment counts and last activity
- **Content Management** — CRUD operations for Projects, Daily posts, DevLogs
- **Comments Moderation** — View and delete user comments across all content
- **Component Manager** — Admin component management interface

### Authentication & Authorisation

- **Google OAuth 2.0** — Supports both JWT ID Token validation and Access Token → UserInfo endpoint fallback
- **ASP.NET Identity** with **Bearer Token** authentication (30-day token expiration)
- **Auto-registration** — New Google users are automatically created in the system
- **Admin Role** — Hardcoded admin emails with elevated permissions (manage content, view analytics, moderate comments)
- **God Mode Toggle** — Admin users can enable inline editing across public pages

### Analytics

- **Page View Tracking** — Frontend sends one ping per unique path per session (de-duplicated via `sessionStorage`)
- **Visitor Logs** — Stores IP address, user agent, authenticated email, path, and timestamp
- **Trend Analysis** — 14-day views trend with gap-filled date series
- **Leaderboard** — Aggregated visitor stats grouped by identity

---

## 🏗 Architecture

```
CHPortfolio/
├── Backend/                    # ASP.NET Core 10 Web API
│   ├── Controllers/
│   │   ├── AuthController.cs   # Google OAuth login endpoint
│   │   └── UploadController.cs # Image upload (single + multiple)
│   ├── Data/
│   │   └── AppDbContext.cs     # EF Core DbContext (IdentityDbContext)
│   ├── Models/
│   │   ├── GridItem.cs         # Unified content model (Project/Daily/DevLog)
│   │   ├── Comment.cs          # User comments linked to GridItems
│   │   ├── VisitorLog.cs       # Analytics tracking entries
│   │   ├── BlogPost.cs         # Blog post model
│   │   ├── Project.cs          # Project model
│   │   └── Skill.cs            # Skill tags (many-to-many with Projects)
│   ├── Migrations/             # EF Core database migrations
│   ├── Program.cs              # Application entry + Minimal API endpoints
│   ├── Dockerfile              # Multi-stage Docker build
│   └── appsettings.json        # Base configuration
│
├── Frontend/                   # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiClient.ts    # Axios instance with Bearer token interceptor
│   │   │   └── gridItems.ts    # Typed API functions for GridItem CRUD
│   │   ├── components/
│   │   │   ├── RootLayout.tsx   # Public layout (navbar, footer, user widget)
│   │   │   ├── AdminLayout.tsx  # Admin sidebar layout
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── comments/       # Comment section component
│   │   │   └── ui/             # Design system primitives
│   │   │       ├── BrutalButton.tsx
│   │   │       ├── BrutalCard.tsx
│   │   │       ├── BrutalBadge.tsx
│   │   │       ├── BrutalInput.tsx
│   │   │       ├── BrutalAlert.tsx
│   │   │       ├── BrutalSwitch.tsx
│   │   │       ├── BrutalProgress.tsx
│   │   │       ├── BrutalConfirmModal.tsx
│   │   │       ├── BrutalAccordion.tsx
│   │   │       ├── MotionEffects.tsx   # Framer Motion animation primitives
│   │   │       └── ScrollReveal.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx     # Auth context (login/logout/admin mode)
│   │   │   └── useTheme.tsx    # Dark mode with View Transitions API
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   ├── DailyTimelinePage.tsx
│   │   │   ├── DailyDetailPage.tsx
│   │   │   ├── DevLogListPage.tsx
│   │   │   ├── DevLogDetailPage.tsx
│   │   │   ├── PublicComponentsPage.tsx
│   │   │   └── admin/          # Protected admin pages
│   │   │       ├── AdminLogin.tsx
│   │   │       ├── AdminProjectsPage.tsx
│   │   │       ├── AdminDailyPage.tsx
│   │   │       ├── AdminDevLogPage.tsx
│   │   │       ├── AdminComponentsPage.tsx
│   │   │       └── AdminCommentsPage.tsx
│   │   ├── App.tsx             # Router + AdminDashboard + Analytics charts
│   │   ├── index.css           # Neo-Brutalism design tokens & utilities
│   │   └── main.tsx            # React entry point
│   ├── index.html              # HTML shell with font preloading & dark mode script
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml          # PostgreSQL + pgAdmin + Backend API
├── .env                        # Environment secrets (git-ignored)
├── .gitignore
└── README.md
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI library |
| Vite | 8 (beta) | Build tool & dev server |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | v4 | Utility-first styling with `@theme` |
| Framer Motion | 12 | Animations & page transitions |
| TanStack React Query | 5 | Server state management & caching |
| React Router | 7 | Client-side routing |
| Axios | 1.13 | HTTP client |
| Lucide React | Icons | Icon library |
| Radix UI | 1.4 | Headless UI primitives |
| react-markdown + rehype-highlight | — | Markdown rendering with syntax highlighting |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| ASP.NET Core | 10.0 | Web API framework |
| Entity Framework Core | 10.0 | ORM & database migrations |
| Npgsql | 10.0 | PostgreSQL provider for EF Core |
| ASP.NET Identity | 10.0 | User management & authentication |
| Google.Apis.Auth | 1.73 | Google OAuth token validation |
| OpenAPI | — | API documentation |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Docker & Docker Compose | Container orchestration |
| PostgreSQL 17 | Relational database |
| pgAdmin 4 | Database management UI |

---

## ⚡ API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/google-login` | — | Google OAuth login (returns Bearer token) |
| `POST` | `/register` | — | ASP.NET Identity registration |
| `POST` | `/login` | — | ASP.NET Identity login |

### Grid Items (Content)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/grid-items?type=` | — | List all items (optional type filter: `Project`, `Daily`, `DevLog`) |
| `GET` | `/api/grid-items/:id` | — | Get single item by ID |
| `POST` | `/api/grid-items` | ✅ | Create new item |
| `PUT` | `/api/grid-items/:id` | ✅ | Partial update (only non-null fields) |
| `DELETE` | `/api/grid-items/:id` | ✅ | Delete item |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/comments` | ✅ Admin | List all comments (admin only) |
| `GET` | `/api/comments/grid-item/:id` | — | Get comments for a specific item |
| `POST` | `/api/comments` | ✅ | Create comment |
| `DELETE` | `/api/comments/:id` | ✅ | Delete comment (owner or admin) |

### Admin & Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/stats` | ✅ Admin | Dashboard statistics |
| `GET` | `/api/admin/users` | ✅ Admin | Registered user list |
| `GET` | `/api/admin/analytics/views-trend` | ✅ Admin | 14-day views trend |
| `GET` | `/api/admin/analytics/visitor-leaderboard` | ✅ Admin | Top 15 visitor leaderboard |
| `DELETE` | `/api/admin/clear-logs` | ✅ Admin | Clear all visitor logs |
| `POST` | `/api/track` | — | Track page view |

### File Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/upload` | ✅ | Upload single image (jpeg, png, gif, webp) |
| `POST` | `/api/upload/multiple` | ✅ | Upload multiple images |

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- Node.js 20+ (for local frontend development)
- .NET 10 SDK (for local backend development)

### Quick Start with Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JohnChuhengYu/CHPortfolio.git
   cd CHPortfolio
   ```

2. **Create a `.env` file** in the project root with your Google OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application:**

   | Service | URL | Credentials |
   |---------|-----|-------------|
   | Backend API | `http://localhost:5298` | — |
   | pgAdmin | `http://localhost:5050` | `admin@chportfolio.dev` / `admin` |
   | PostgreSQL | `localhost:5432` | `postgres` / `postgres` |

5. **Start the frontend** (run separately):
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`.

### Local Development (Without Docker)

#### Backend
```bash
cd Backend

# Update appsettings.Development.json with your local PostgreSQL connection string
# and Google OAuth credentials (see appsettings.Development.json.example)

dotnet run
```

#### Frontend
```bash
cd Frontend
npm install
npm run dev
```

---

## 🗄 Database

The application uses **PostgreSQL 17** with **EF Core** code-first migrations. Migrations run automatically on startup via `db.Database.MigrateAsync()`.

### Core Tables
| Table | Description |
|-------|-------------|
| `GridItems` | Unified content store (Type: `Project` / `Daily` / `DevLog`) with Markdown content, tags, gallery images, and colour metadata |
| `Comments` | User comments linked to GridItems via foreign key |
| `VisitorLogs` | Page view analytics (IP, user agent, path, email, timestamp) |
| `AspNetUsers` | ASP.NET Identity user accounts |
| `Projects` | Project entities with many-to-many Skill relationships |
| `BlogPosts` | Blog posts with unique slug indexing |
| `Skills` | Skill tags with unique name constraint |

### Default Admin Account
On first startup, the system seeds a default admin account:
- **Email**: `admin@chportfolio.dev`
- **Password**: `Admin123!`

---

## 🌙 Dark Mode

The theme system uses the **View Transitions API** for a smooth circular clip-path reveal animation:

1. User clicks the theme toggle button
2. A `document.startViewTransition()` callback synchronously updates React state and DOM class
3. A `circle()` clip-path animation expands/contracts from the click point
4. Custom CSS `@property` declarations animate the scrollbar colours independently

Falls back gracefully to instant toggle on browsers without View Transitions support.

---

## 📝 Environment Variables

| Variable | Description | Used By |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | `docker-compose.yml` → Backend |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret | `docker-compose.yml` → Backend |

> **Note**: The `.env` file is git-ignored. Copy from the template and fill in your own values. A reference template is available at `Backend/appsettings.Development.json.example`.

---

## 📜 License

This project is for personal portfolio use.

---

<p align="center">
  Built with ❤️ using React 19 + .NET 10 · Monash MIT
</p>
