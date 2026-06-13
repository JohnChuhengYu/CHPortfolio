# CHPortfolio

CHPortfolio is a comprehensive full-stack web application designed as a personal portfolio. It features a modern, responsive frontend built with React and a robust backend powered by ASP.NET Core and PostgreSQL.

## Features

- **Modern Frontend Interface**: Built with React 19, Vite, and styled using Tailwind CSS v4 and Framer Motion for smooth animations.
- **Robust Backend API**: Developed using ASP.NET Core (net10.0) with Entity Framework Core for data management.
- **Database**: Uses PostgreSQL for reliable and scalable data storage.
- **Authentication**: Integrated Google OAuth for secure user authentication.
- **Dockerized Environment**: Fully containerized using Docker Compose for seamless local development and deployment.

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- Framer Motion
- React Query & React Router

### Backend
- ASP.NET Core 10.0
- Entity Framework Core
- PostgreSQL
- Google.Apis.Auth

### Infrastructure
- Docker & Docker Compose
- pgAdmin (for database management)

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.
- Node.js (if running the frontend locally outside of Docker).
- .NET 10 SDK (if running the backend locally outside of Docker).

### Running with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/JohnChuhengYu/CHPortfolio.git
   cd CHPortfolio
   ```

2. Start the services using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

3. Access the services:
   - **Frontend**: Check your Vite configuration for the port (typically `http://localhost:5173`).
   - **Backend API**: `http://localhost:5298`
   - **pgAdmin**: `http://localhost:5050` (Login with `admin@chportfolio.dev` / `admin`)
   - **PostgreSQL**: `localhost:5432` (User: `postgres`, Password: `postgres`)

### Running Locally without Docker

#### Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Update the `appsettings.Development.json` with your local PostgreSQL connection string.
3. Run the backend:
   ```bash
   dotnet run
   ```

#### Frontend
1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/Backend`: Contains the ASP.NET Core API application.
- `/Frontend`: Contains the React/Vite frontend application.
- `docker-compose.yml`: Docker configuration for the database, pgAdmin, and API services.
