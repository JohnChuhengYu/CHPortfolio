# Production Deployment Guide

This guide describes how to deploy **CHPortfolio** to a production environment (such as an Ubuntu VPS on DigitalOcean, Hetzner, AWS EC2, or Linode) using **Docker**, **Nginx / Caddy**, and **Let's Encrypt SSL**.

---

## 🏗 Production Architecture

```
Internet (HTTPS :443)
       │
       ▼
┌──────────────────────────────────────────────┐
│  Reverse Proxy (Nginx / Caddy + SSL Cert)    │
└──────┬────────────────────────────────┬──────┘
       │                                │
       ▼                                ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│ Frontend Static Assets    │    │ Backend REST API (Docker) │
│ (Built via Vite -> dist/) │    │ ASP.NET Core 10 (:5298)   │
└───────────────────────────┘    └──────────────┬────────────┘
                                                │
                                                ▼
                                 ┌───────────────────────────┐
                                 │ PostgreSQL 17 (Docker)    │
                                 │ Container (:5432)         │
                                 └───────────────────────────┘
```

---

## 📋 Prerequisites

1. A Linux server (Ubuntu 22.04 LTS or 24.04 LTS recommended).
2. A domain name pointed to your server's public IP address (e.g. `chportfolio.dev`, `api.chportfolio.dev`).
3. Installed software on the VPS:
   - **Docker** & **Docker Compose** (v2+)
   - **Git**
   - **Node.js 20+** & **pnpm** (if building frontend on the host)

---

## 🚀 Step 1: Server Setup & Hardening

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install essential utilities
sudo apt install -y curl git ufw fail2ban

# Configure UFW Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

---

## 📦 Step 2: Clone & Configure

```bash
git clone https://github.com/JohnChuhengYu/CHPortfolio.git /var/www/chportfolio
cd /var/www/chportfolio
```

### Configure Root Environment (`.env`)
Create the production environment file:
```bash
cp .env.example .env
nano .env
```

Ensure production secrets are set:
```env
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
POSTGRES_USER=chportfolio_admin
POSTGRES_PASSWORD=your_strong_random_database_password
POSTGRES_DB=chportfolio_prod
```

---

## 🗄 Step 3: Run Database & Backend via Docker

Start PostgreSQL and the Backend API containers:
```bash
docker compose up -d --build
```

Verify containers are healthy and running:
```bash
docker compose ps
docker compose logs -f api
```

The database migrations will run automatically on application startup.

---

## ⚡ Step 4: Build Frontend for Production

```bash
cd /var/www/chportfolio/Frontend

# Configure production frontend env
nano .env.local
```

Add your production API URL:
```env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_API_URL=https://yourdomain.com
```

Build the static production bundle:
```bash
pnpm install
pnpm run build
```

This generates optimized production assets in `/var/www/chportfolio/Frontend/dist/`.

---

## 🌐 Step 5: Reverse Proxy & SSL (Option A: Nginx)

Install Nginx and Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create Nginx site configuration:
```bash
sudo nano /etc/nginx/sites-available/chportfolio
```

```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    # Frontend SPA
    location / {
        root /var/www/chportfolio/Frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:5298/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded Static Media
    location /uploads/ {
        proxy_pass http://127.0.0.1:5298/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 25M;
    }

    # ASP.NET Identity Auth Endpoints
    location ~ ^/(login|register) {
        proxy_pass http://127.0.0.1:5298;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and obtain SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/chportfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtain free Let's Encrypt certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🌐 Step 5 (Alternative): Caddy Server

If you prefer **Caddy** (which handles automatic SSL without Certbot):

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

`/etc/caddy/Caddyfile`:
```caddy
yourdomain.com {
    # Reverse proxy backend API
    handle /api/* {
        reverse_proxy localhost:5298
    }

    # Reverse proxy image uploads
    handle /uploads/* {
        reverse_proxy localhost:5298
    }

    # Serve static frontend SPA
    handle {
        root * /var/www/chportfolio/Frontend/dist
        try_files {path} /index.html
        file_server
    }
}
```

Restart Caddy:
```bash
sudo systemctl restart caddy
```

---

## 💾 Step 6: Automated Database Backups

Create a backup script:
```bash
sudo mkdir -p /var/backups/chportfolio
sudo nano /usr/local/bin/backup-chportfolio.sh
```

```bash
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/chportfolio"

docker exec chportfolio-db pg_dump -U postgres chportfolio > "$BACKUP_DIR/db_$DATE.sql"
gzip "$BACKUP_DIR/db_$DATE.sql"

# Keep last 14 days of backups
find $BACKUP_DIR -type f -name "db_*.sql.gz" -mtime +14 -delete
```

Make it executable and add to crontab:
```bash
sudo chmod +x /usr/local/bin/backup-chportfolio.sh
(crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/backup-chportfolio.sh") | crontab -
```

---

## 🔄 Updating in Production

When deploying updates:

```bash
cd /var/www/chportfolio

# 1. Pull latest changes
git pull origin main

# 2. Rebuild & restart backend containers
docker compose up -d --build

# 3. Rebuild frontend
cd Frontend
pnpm install
pnpm run build

# 4. Reload web server
sudo systemctl reload nginx
```

