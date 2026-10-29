# CHPortfolio Frontend

<p align="center">
  <strong>High-Performance Neo-Brutalism Web Client</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.0_Beta-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS v4" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.3-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" />
</p>

---

## 🎨 Design Philosophy: Neo-Brutalism

The user interface is engineered from the ground up to embody modern **Neo-Brutalism**:
- **Tactile Hard Shadows**: Solid, offset hard shadows (`shadow-[4px_4px_0px_0px_#000]` / `dark:shadow-[4px_4px_0px_0px_#333]`) that provide physical depth without artificial blurs.
- **Bold Solid Borders**: `3px` / `4px` borders delivering crisp high-contrast outlines across light and dark modes.
- **Physical Press Feedback**: Micro-interactions with cubic-bezier spring physics — buttons physically press into their offset shadows on active click.
- **Vibrant Neo Palette**: 18+ curated high-saturation accent colors (Yellow, Cyan, Purple, Lime, Sky, Pink, Amber, Rose, Indigo, Emerald, Fuchsia, Violet).
- **Prose & Code Typography**: JetBrains Mono for code blocks and terminal elements, Space Grotesk for bold headings, and customized `.brutal-prose` with syntax highlighting via `highlight.js` and `rehype-highlight`.

---

## 🌙 Dark Mode & Theme Transition Engine

The theme engine implements the modern **View Transitions API** combined with circular clip-path expansion:
1. When toggling themes, a `document.startViewTransition()` screenshot capture is initiated.
2. The active click coordinates are tracked to expand a circular mask from the button outward.
3. Custom CSS `@property` handles smooth scrollbar track interpolation.
4. All UI primitives automatically switch border colors (`border-black` → `dark:border-gray-700`) and shadow tones to preserve structural contrast on dark backgrounds.
5. If the browser lacks View Transition support, it gracefully falls back to instant DOM class switching.

---

## 🧭 Page & Route Directory

### Public Pages
| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Hero section, animated text reveals, About Me cards, education credentials, philosophy |
| `/projects` | `ProjectsPage` | Filterable project showcase grid, category tags, empty vault fallback card |
| `/project/:id` | `ProjectDetail` | Full project case study, problem/solution breakdown, image gallery, comments |
| `/daily` | `DailyTimelinePage` | Micro-blogging timeline, mood badges, date stamps, empty state |
| `/daily/:id` | `DailyDetailPage` | Focused view of single daily note with interactive discussion thread |
| `/devlog` | `DevLogListPage` | Technical engineering changelog, terminal-inspired tags and layout |
| `/devlog/:id` | `DevLogDetailPage` | In-depth engineering devlog with Markdown rendering and syntax-highlighted code |
| `/components` | `PublicComponentsPage` | Live interactive design system showcase demonstrating all primitives |
| `/login` | `AdminLogin` | Responsive OAuth modal with centered scaling, Google login, and theme toggle |

### Admin Pages (Protected under `/admin`)
| Path | Component | Description |
| :--- | :--- | :--- |
| `/admin` | `AdminDashboard` | Analytics overview, 14-day views trend SVG chart, engagement heatmap, active leaderboard |
| `/admin/projects` | `AdminProjectsPage` | Project creation form with validation, tag manager, and existing project management |
| `/admin/daily` | `AdminDailyPage` | Daily micro-post publisher with mood picker and inline deletion |
| `/admin/devlog` | `AdminDevLogPage` | Dual-pane split-screen Markdown editor with live preview side-by-side |
| `/admin/components` | `AdminComponentsPage` | Admin-facing test harness for experimental and standard UI primitives |
| `/admin/comments` | `AdminCommentsPage` | Global comment moderation panel with direct navigation to originating posts |

---

## 🧱 Component Primitives (`src/components/ui/`)

| Component | Features |
| :--- | :--- |
| `BrutalButton` | Variants: `primary`, `secondary`, `danger`, `black`, `ghost`. Physical press motion, disabled states, dark mode shadow overrides. |
| `BrutalCard` | 16 color variants, configurable padding, hoverable tilt animations, responsive border widths. |
| `BrutalBadge` | Solid color pills with tactile borders, pill or rectangular modes, dynamic color assignment. |
| `BrutalInput` | High-contrast inputs with label support, focus shadow expansion (`6px 6px`), dark mode placeholder styling. |
| `BrutalAlert` | 4 status types (`info`, `success`, `warning`, `error`), dismiss button, dark border protection. |
| `BrutalSwitch` | Neo-Brutalist toggle pill with sliding circle knob, disabled state, customizable active tint. |
| `BrutalProgress` | Chunky segmented progress bar with internal/external percentage indicator. |
| `BrutalAccordion` | Collapsible panels with rotating Chevron icons, single or multi-expand modes. |
| `BrutalConfirmModal` | Fixed `z-50` backdrop-blur modal dialog with dual confirmation triggers. |
| `MotionEffects` | `DrawUnderline`, `PopDot`, `SlapTag`, `TerminalType`, `BlockReveal` Framer Motion primitives. |

---

## 📡 Data Fetching & Network Architecture

- **HTTP Client**: Axios instance configured in [`src/api/apiClient.ts`](file:///Users/yuchuheng/OneDrive%20-%20Westlake%20Boys%20High%20School/数据传输/CHPortfolio/Frontend/src/api/apiClient.ts).
- **Authentication Interceptor**: Automatically attaches `Bearer <token>` from `localStorage` on authenticated requests.
- **Server State**: Managed via **TanStack React Query v5** (`@tanstack/react-query`) with automatic query key invalidation on mutations (`useMutation`).
- **Visitor Tracking**: Lightweight non-blocking navigation pings sent to `/api/track`, deduplicated via `sessionStorage` to avoid artificial inflated view counts.

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the `Frontend/` directory (see [`.env.example`](file:///Users/yuchuheng/OneDrive%20-%20Westlake%20Boys%20High%20School/数据传输/CHPortfolio/Frontend/.env.example)):

```bash
# Google OAuth 2.0 Web Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Backend API Base URL (defaults to http://localhost:5298 if omitted)
VITE_API_URL=http://localhost:5298
```

---

## 🚀 Development & Build Scripts

The project uses **pnpm** as its recommended package manager.

```bash
# Install dependencies
pnpm install

# Start Vite development server (HMR enabled)
pnpm run dev

# Run TypeScript typecheck and build production bundle
pnpm run build

# Preview production build locally
pnpm run preview

# Run ESLint linting
pnpm run lint
```

---

## 📜 License & Documentation

- **License**: [All Rights Reserved (Personal Portfolio & Showcase)](file:///Users/yuchuheng/OneDrive%20-%20Westlake%20Boys%20High%20School/数据传输/CHPortfolio/LICENSE).
- **Root Repository & Documentation Hub**: [CHPortfolio](file:///Users/yuchuheng/OneDrive%20-%20Westlake%20Boys%20High%20School/数据传输/CHPortfolio/README.md)
- **Deployment Guide**: [Production Deployment (Docker & Nginx)](file:///Users/yuchuheng/OneDrive%20-%20Westlake%20Boys%20High%20School/数据传输/CHPortfolio/DEPLOYMENT.md)
- **Contributing Guidelines**: [CONTRIBUTING.md](file:///Users/yuchuheng/OneDrive%20-%20Westlake%20Boys%20High%20School/数据传输/CHPortfolio/CONTRIBUTING.md)
