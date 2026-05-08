# 6DAiNAS Web — Master Development Log

> **Project:** 6DAiNAS branding site + centralized telemetry service  
> **Repository:** `iampmpksamy/6dainas-web` (private)  
> **Stack:** Next.js 14 (App Router) · Tailwind CSS · Go telemetry service · Caddy · Docker  
> **Domain:** `6dainas.cloud` / `telemetry.6dainas.cloud`  
> **Last updated:** 2026-05-08

---

## Sprint.01 — Initial Branding Site + Admin Dashboard (v0.1.0)

**Date:** 2026-05-08  
**Commit:** `a4bb3d5`  
**Phase:** Phase 1 — Bootstrap  

### What Was Built

Created the first version of the 6DAiNAS public-facing branding site and a private analytics admin dashboard.

**Frontend (`apps/web/`):**
- Next.js 14 with App Router; TypeScript + Tailwind CSS
- Home page: hero section with 6DAiNAS-OS product pitch, feature grid
- Admin dashboard route (`/admin`): protected by HTTP Basic Auth via middleware
- Dashboard displays: total installs, installs by source (OS / Web / other), recent registration table
- Analytics API client fetches from `ANALYTICS_URL` environment variable (initially hardcoded to localhost)

**Key Files Created:**
- `apps/web/src/app/page.tsx` — public landing page
- `apps/web/src/app/admin/page.tsx` — analytics dashboard
- `apps/web/src/app/admin/layout.tsx` — basic auth middleware guard
- `apps/web/src/components/` — HeroSection, FeatureGrid, StatsCard
- `apps/web/next.config.mjs` — standalone output enabled
- `apps/web/package.json` — Next.js 14, Tailwind, TypeScript

---

## Sprint.02 — Analytics URL Fix (v0.1.1)

**Date:** 2026-05-08  
**Commit:** `48a42de`  
**Phase:** Phase 1 — Bootstrap  

### What Was Fixed

| # | Bug | Fix |
|---|-----|-----|
| 1 | `ANALYTICS_URL` pointed to `http://localhost:8080` — admin dashboard fetches fail in production | Changed to `https://telemetry.6dainas.cloud` in `.env.local` and documented in `apps/web/.env.example` |

---

## Sprint.03 — Docker Containerisation (v0.2.0)

**Date:** 2026-05-08  
**Commit:** `5dfe8f1`  
**Phase:** Phase 2 — Containerisation  

### What Was Built

Multi-stage Docker build for the Next.js web app, designed for production deployment with minimal image size.

**Architecture:**
- Stage 1 (`deps` — `node:20` Debian): `npm ci` — installs glibc-linked SWC binary from lockfile
- Stage 2 (`builder` — `node:20` Debian): copies deps + source, runs `npm run build` with `output: 'standalone'`
- Stage 3 (`runner` — `node:20-alpine`): copies standalone output only, runs as unprivileged `nextjs:1001` user

**Why Debian for build stages:** `package-lock.json` generated on glibc host locks the `@next/swc-linux-x64-gnu` binary. Alpine/musl would fail at runtime since the GNU binary requires `ld-linux-x86-64.so.2`. Alpine is safe for the runtime-only stage because the standalone output has no native addons.

**Key Files Created:**
- `apps/web/Dockerfile` — 3-stage build

**Healthcheck:** `wget -qO- http://localhost:3000` every 15s, 5s timeout, 20s start period.

---

## Sprint.04 — Monorepo Restructure (v0.3.0)

**Date:** 2026-05-08  
**Commit:** `dd51152`  
**Phase:** Phase 2 — Containerisation  

### What Was Restructured

Migrated to Maalig-style monorepo layout to support multiple apps/services under one repo.

**Before:**
```
/
├── src/
├── package.json
├── Dockerfile
└── ...
```

**After:**
```
/
├── apps/
│   └── web/          ← Next.js app (was repo root)
├── infra/
│   └── docker/
│       ├── docker-compose.yml
│       └── docker-compose.prod.yml
├── services/
│   └── telemetry/    ← Go analytics service (added Sprint.06)
├── Installer/
├── docs/
└── package.json      ← npm workspace root
```

**Key Files Created/Updated:**
- Root `package.json` — npm workspaces with `"workspaces": ["apps/web"]`
- `infra/docker/docker-compose.yml` — build context `../../`, dockerfile `apps/web/Dockerfile`
- `infra/docker/docker-compose.prod.yml` — env_file `../../.env.local`, port `3000:3000`
- Removed stale `apps/web/package-lock.json` (root lockfile now manages all workspace deps)

**Docker build command (from repo root):**
```bash
docker compose -f infra/docker/docker-compose.yml build
```

---

## Sprint.05 — Telemetry Go Service (v0.4.0)

**Date:** 2026-05-08  
**Commit:** `8058c60`  
**Phase:** Phase 3 — Telemetry  

### What Was Built

Centralized analytics/telemetry micro-service in Go, serving as the backend for `telemetry.6dainas.cloud`. Designed to receive registration events from all 6DAiNAS products (OS, Web, future e-commerce).

**Architecture:**
- Language: Go 1.22, minimal dependencies
- Storage: SQLite via `modernc.org/sqlite` (pure Go, no CGO)
- HTTP: Go stdlib `net/http` + gorilla/mux (or echo — minimal)
- Port: configurable via `PORT` env (default 8080)
- DB path: `$DATA_DIR/analytics.db` (default `/var/lib/6dainas-telemetry/`)

**API Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/os/register` | None | 6DAiNAS-OS new install registration |
| `POST` | `/api/v1/web/register` | None | 6DAiNAS-Web visitor registration |
| `GET` | `/api/v1/stats` | Bearer token | Aggregate stats (total, by source, recent) |
| `GET` | `/health` | None | Health check endpoint |

**Registration Payload:**
```json
{
  "node_id":    "uuid-or-stable-hash",
  "hostname":   "my-nas",
  "version":    "1.2.0",
  "ip":         "1.2.3.4",
  "source":     "os"
}
```

**Key Files Created:**
- `services/telemetry/main.go` — entry point
- `services/telemetry/model/registration.go` — event struct
- `services/telemetry/service/db.go` — SQLite layer (Open, CreateRegistration, ListRegistrations, Stats)
- `services/telemetry/route/router.go` — HTTP handlers + middleware

---

## Sprint.06 — One-Shot Installer (v0.4.1)

**Date:** 2026-05-08  
**Commit:** `c007c69`  
**Phase:** Phase 3 — Telemetry  

### What Was Built

`Installer/install.sh` — a single-command deployment script for the telemetry service.

**What it does:**
1. Checks prerequisites (Go ≥ 1.22, systemd, root access)
2. Builds the telemetry binary: `go build -o /usr/local/bin/6dainas-telemetry`
3. Creates data directory: `/var/lib/6dainas-telemetry/`
4. Installs systemd service file: `6dainas-telemetry.service`
5. `systemctl daemon-reload && systemctl enable --now 6dainas-telemetry`
6. Prints the service status

---

## Sprint.07 — Production Deployment (v1.0.0)

**Date:** 2026-05-08  
**Commit:** `1cee7ce`  
**Phase:** Phase 4 — Production  

### What Was Deployed

Full production deployment replacing the previous WordPress site at `6dainas.cloud`.

**Stack deployed:**
- Next.js app running in Docker on port 3000
- Go telemetry service running as systemd unit on port 8080
- Caddy as reverse proxy for both domains (TLS via Let's Encrypt)

**Deployment steps performed:**
1. Cloned repo on VPS
2. Ran `Installer/install.sh` for telemetry service
3. Copied `.env.local` with production values
4. `docker compose -f infra/docker/docker-compose.prod.yml up -d --build`
5. Installed Caddy config (added below in Sprint.08)

---

## Sprint.08 — Caddy Config + Port Fix (v1.0.1)

**Date:** 2026-05-08  
**Commits:** `f46f578`, `3be8cd0`  
**Phase:** Phase 4 — Production  

### What Was Fixed / Added

| # | Item | Details |
|---|------|---------|
| 1 | `infra/caddy/Caddyfile` created | Reverse proxy blocks for `6dainas.cloud`, `www.6dainas.cloud`, `telemetry.6dainas.cloud` |
| 2 | Docker prod port binding fixed | `docker-compose.prod.yml` was missing port mapping `3000:3000` — site unreachable | 
| 3 | `telemetry.6dainas.cloud` Caddy block moved | Was incorrectly in `6DAiNAS-OS` Caddy config; moved here as it belongs to the web infrastructure |

**Caddyfile structure:**
```caddyfile
6dainas.cloud, www.6dainas.cloud {
    reverse_proxy localhost:3000
}

telemetry.6dainas.cloud {
    reverse_proxy localhost:8080
}
```

---

## Sprint.09 — .gitignore Cleanup (v1.0.2)

**Date:** 2026-05-08  
**Commit:** `5fd3fa1`  
**Phase:** Phase 4 — Production  

### What Was Fixed

Added `reference/` to `.gitignore` — the directory contains local WordPress design reference screenshots that should not be committed to the repository.

---
