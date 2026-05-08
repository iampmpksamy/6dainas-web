# Deployment Guide

## Prerequisites

- Docker 24+ and Docker Compose v2
- A reverse proxy (Caddy recommended) terminating TLS
- `ANALYTICS_URL` pointing to your self-hosted analytics service (e.g. `https://telemetry.6dainas.cloud`)

## Environment Variables

Copy `.env.example` to `.env.local` in the repo root and fill in the values:

```
ADMIN_PASSWORD=         # bcrypt-safe password for /admin/login
ADMIN_SECRET=           # ≥32-char random string for JWT signing
ANALYTICS_URL=https://telemetry.6dainas.cloud
ANALYTICS_KEY=          # X-API-Key for analytics service
```

Generate a strong secret:

```bash
openssl rand -hex 32
```

## Docker — Production

```bash
# Build
sudo docker build -f apps/web/Dockerfile -t 6dainas-web:latest .

# Run via Compose (set WEB_IMAGE env var first)
WEB_IMAGE=6dainas-web:latest sudo docker compose -f infra/docker/docker-compose.prod.yml up -d
```

The container binds only to an internal network (`6dainas-web`). Your reverse proxy must forward traffic to the container name `6dainas-web` on port 3000.

## Caddy Example

```
6dainas.cloud {
    reverse_proxy 6dainas-web:3000
}
```

## Docker — Development

```bash
sudo docker compose -f infra/docker/docker-compose.yml up --build
```

Runs on `http://localhost:3000` with hot-reload **not** enabled (standalone build). For active development, run Next.js directly:

```bash
npm run dev
```

## CI/CD (GitHub Actions)

Push to `main` triggers `.github/workflows/docker-publish.yml`, which:

1. Builds the image from the monorepo root context
2. Pushes to GitHub Container Registry (`ghcr.io/iampmpksamy/6dainas-web`)

Set these repository secrets in GitHub → Settings → Secrets:

| Secret | Value |
|---|---|
| `GHCR_TOKEN` | GitHub PAT with `write:packages` scope |

## Health Check

The container exposes a health check at `http://localhost:3000` (looks for an HTML `<` character). Compose will mark the container `healthy` after `start_period`.
