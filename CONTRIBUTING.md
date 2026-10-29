# Contributing to CHPortfolio

Thank you for your interest in **CHPortfolio**!

> 💡 **Project Context**: This repository is John Chuheng Yu's **personal developer portfolio and content management system**. It is published publicly on GitHub for portfolio showcase, code review, and educational inspection. While it is not an open-source library or multi-user framework, feedback, bug reports, and discussion on modern web engineering practices are warmly welcomed!

This document outlines the recommended workflow and conventions to help you navigate and explore the codebase quickly.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Setup](#-development-setup)
- [Coding Standards & Guidelines](#-coding-standards--guidelines)
  - [Frontend (React 19 + TypeScript + Tailwind v4)](#frontend-react-19--typescript--tailwind-v4)
  - [Backend (ASP.NET Core 10 + C# 13)](#backend-aspnet-core-10--c-13)
- [Git Commit Guidelines](#-git-commit-guidelines)
- [Pull Request Checklist](#-pull-request-checklist)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful and constructive in all issues, discussions, and code reviews.

---

## 💡 How Can I Contribute?

### Reporting Bugs

Before submitting a new issue, please search existing issues to see if the problem has already been reported.

When filing a bug report, please include:
1. **A clear, descriptive title**.
2. **Steps to reproduce the behavior**.
3. **Expected vs. actual behavior**.
4. **Screenshots or console logs**, if applicable.
5. **Environment details** (OS, browser version, Node.js version, .NET SDK version).

### Suggesting Features

Feature ideas are always welcome! When opening a feature request, please explain:
- The problem you are trying to solve or the value this feature provides.
- Any potential alternatives or existing workarounds considered.
- Mockups, code snippets, or reference examples if available.

### Submitting Pull Requests

1. **Fork the repository** on GitHub.
2. **Create a topic branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
3. Make your changes with focused, logical commits.
4. Test thoroughly in both **Light Mode** and **Dark Mode**.
5. Ensure both frontend and backend build cleanly without errors.
6. Push to your fork and submit a **Pull Request** targeting `main`.

---

## 🛠 Development Setup

### Prerequisites
- **Git**
- **Node.js** 20.x or higher
- **pnpm** (recommended) or npm
- **.NET 10 SDK** (for local backend development)
- **Docker Desktop** (optional, but recommended for running PostgreSQL)

### 1. Clone & Configure

```bash
git clone https://github.com/JohnChuhengYu/CHPortfolio.git
cd CHPortfolio
```

Copy the environment templates:
```bash
# Root environment (for Docker Compose)
cp .env.example .env

# Frontend environment
cp Frontend/.env.example Frontend/.env.local

# Backend environment (if running without Docker)
cp Backend/appsettings.Development.json.example Backend/appsettings.Development.json
```

### 2. Running with Docker Compose (Fastest)

```bash
# Start PostgreSQL, pgAdmin, and Backend API
docker-compose up -d --build

# In a separate terminal, run the frontend dev server
cd Frontend
pnpm install
pnpm run dev
```

Frontend runs on `http://localhost:5173`.  
Backend API runs on `http://localhost:5298`.

### 3. Local Development (Without Docker)

#### Backend (.NET 10)
```bash
cd Backend
dotnet restore
dotnet run
```

#### Frontend (React 19)
```bash
cd Frontend
pnpm install
pnpm run dev
```

---

## 📐 Coding Standards & Guidelines

### Frontend (React 19 + TypeScript + Tailwind v4)

- **Strict Type Safety**: Avoid using `any`. Write strong interfaces and types for API responses, props, and state.
- **Neo-Brutalism Design Tokens**: Always use predefined theme tokens:
  - Backgrounds: `bg-brutal-white`, `bg-brutal-bg`
  - Text: `text-brutal-black`, `text-brutal-muted`
  - Borders: `border-2 border-brutal-border`
  - Shadows: `shadow-[4px_4px_0px_0px_var(--theme-border)]`
- **Dark Mode Compatibility**: Test every component in both light and dark themes. Ensure high contrast and avoid hardcoded black text on dark surfaces.
- **Micro-interactions**: Use `framer-motion` for physics-based springs, staggered entrances, and tactile feedback. Keep animations purposeful and performant.
- **Strict Visual Constraint**: Portfolio visuals strictly feature hardware workstations, code, servers, and scenery photography — **no human character drawings or avatars**.

### Backend (ASP.NET Core 10 + C# 13)

- **Minimal APIs**: Prefer lightweight Minimal API endpoints for RESTful operations.
- **Asynchronous Everywhere**: Use `async`/`await` across all database and network calls (`ToListAsync()`, `SaveChangesAsync()`).
- **Authorization & Security**:
  - Always validate authorization headers and roles for admin routes.
  - Never commit production secrets, database credentials, or API keys.
- **Entity Framework Core**: Keep database migrations clean and deterministic. Add descriptive migration names:
  ```bash
  dotnet ef migrations add AddFeatureDescription
  ```

---

## 🏷 Git Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>
```

### Common Types:
- `feat`: A new feature or capability
- `fix`: A bug fix
- `docs`: Documentation updates (README, markdown files)
- `style`: Formatting, missing semicolons, visual tweaks (no code logic changes)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance optimizations
- `test`: Adding or correcting tests
- `chore`: Build scripts, dependencies, configuration updates

### Examples:
```bash
feat(home): add 3D workstation tilt card to engineering section
fix(theme): prevent black text in dark mode project detail editor
docs(readme): add MIT license badge and deployment guide links
```

---

## ✅ Pull Request Checklist

Before opening your pull request, please make sure you have:
- [ ] Tested your changes locally.
- [ ] Verified both **Light Mode** and **Dark Mode** render correctly with high contrast.
- [ ] Run `pnpm run build` in `Frontend/` and verified zero TypeScript/compilation errors.
- [ ] Run `dotnet build` in `Backend/` and verified zero compiler errors or warnings.
- [ ] Ensured no secrets, `.env` files, or personal tokens are staged.
- [ ] Linked any related GitHub issues in your PR description.

Thank you for helping make **CHPortfolio** even better! 🚀

