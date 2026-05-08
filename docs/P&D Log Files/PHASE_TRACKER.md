# 6DAiNAS Web — Phase & Sprint Tracker

> **Project:** 6DAiNAS branding site + centralized telemetry service  
> **Last updated:** 2026-05-08  
> **Tracking format:** Phase → Sprint → Issues

---

## Phase 1 — Bootstrap

**Goal:** Get a working Next.js branding site with admin analytics dashboard running locally.

### Sprint.01 — Initial Site + Admin Dashboard

**Date:** 2026-05-08 · **Commit:** `a4bb3d5`

| # | Type | File | Item | Status |
|---|------|------|------|--------|
| 1 | FEATURE | `apps/web/src/app/page.tsx` | Public landing page — hero, feature grid, product pitch | ✅ |
| 2 | FEATURE | `apps/web/src/app/admin/page.tsx` | Admin analytics dashboard — stats cards + recent registrations table | ✅ |
| 3 | FEATURE | `apps/web/src/app/admin/layout.tsx` | Basic Auth middleware guard for `/admin` | ✅ |
| 4 | FEATURE | `apps/web/src/components/HeroSection.tsx` | Hero component | ✅ |
| 5 | FEATURE | `apps/web/src/components/FeatureGrid.tsx` | Feature grid component | ✅ |
| 6 | FEATURE | `apps/web/src/components/StatsCard.tsx` | Stats card component for dashboard | ✅ |
| 7 | CONFIG | `apps/web/next.config.mjs` | Enable `output: 'standalone'` for Docker | ✅ |
| 8 | CONFIG | `apps/web/package.json` | Next.js 14, Tailwind CSS, TypeScript dependencies | ✅ |

### Sprint.02 — Analytics URL Fix

**Date:** 2026-05-08 · **Commit:** `48a42de`

| # | Type | File | Issue | Fix | Status |
|---|------|------|-------|-----|--------|
| 1 | BUG | `.env.local`, `.env.example` | `ANALYTICS_URL=http://localhost:8080` — dashboard fetches fail in production | Changed to `https://telemetry.6dainas.cloud` | ✅ |

---

## Phase 2 — Containerisation

**Goal:** Docker-based production deployment. Monorepo structure for future expansion.

### Sprint.03 — Docker Containerisation

**Date:** 2026-05-08 · **Commit:** `5dfe8f1`

| # | Type | File | Item | Status |
|---|------|------|------|--------|
| 1 | FEATURE | `apps/web/Dockerfile` | 3-stage multi-stage build (deps → builder → runner) | ✅ |
| 2 | DESIGN | `apps/web/Dockerfile` | Stage 1 + 2 use `node:20` (Debian/glibc) to match lockfile's gnu SWC binary | ✅ |
| 3 | DESIGN | `apps/web/Dockerfile` | Stage 3 uses `node:20-alpine` — safe for standalone output (no native addons) | ✅ |
| 4 | FEATURE | `apps/web/Dockerfile` | Non-root user `nextjs:1001` in runner stage | ✅ |
| 5 | FEATURE | `apps/web/Dockerfile` | HEALTHCHECK via `wget` every 15s | ✅ |

**Key constraint documented:** SWC binary is glibc-linked on host → deps/builder must use Debian, not Alpine. Alpine-only build would produce: `Error: Could not load the "sharp" module` / `GLIBC_2.28 not found`.

### Sprint.04 — Monorepo Restructure

**Date:** 2026-05-08 · **Commit:** `dd51152`

| # | Type | File | Item | Status |
|---|------|------|------|--------|
| 1 | REFACTOR | `/` (repo root) | Created `apps/`, `infra/docker/`, `services/`, `Installer/` layout | ✅ |
| 2 | CONFIG | `package.json` | Root npm workspace: `"workspaces": ["apps/web"]` | ✅ |
| 3 | CONFIG | `infra/docker/docker-compose.yml` | Build context `../../`, dockerfile `apps/web/Dockerfile` | ✅ |
| 4 | CONFIG | `infra/docker/docker-compose.prod.yml` | env_file `../../.env.local`, port `3000:3000` | ✅ |
| 5 | CLEANUP | `apps/web/package-lock.json` | Removed stale inner lockfile — root lockfile manages all workspace deps | ✅ |

---

## Phase 3 — Telemetry Service

**Goal:** Build a centralized analytics micro-service to capture registration events from all 6DAiNAS products.

### Sprint.05 — Go Telemetry Service

**Date:** 2026-05-08 · **Commit:** `8058c60`

| # | Type | File | Item | Status |
|---|------|------|------|--------|
| 1 | FEATURE | `services/telemetry/model/registration.go` | Registration event struct — NodeID, Hostname, Version, IP, Source, CreatedAt | ✅ |
| 2 | FEATURE | `services/telemetry/service/db.go` | SQLite storage layer — Open, CreateRegistration, ListRegistrations, Stats | ✅ |
| 3 | FEATURE | `services/telemetry/route/router.go` | HTTP handlers — POST /os/register, POST /web/register, GET /stats, GET /health | ✅ |
| 4 | FEATURE | `services/telemetry/main.go` | Entry point — loads PORT + DATA_DIR envs, initialises DB, starts server | ✅ |
| 5 | DESIGN | — | Pure Go SQLite (`modernc.org/sqlite`) — no CGO, statically linkable | ✅ |

**API surface:**

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /api/v1/os/register` | None | 6DAiNAS-OS install registration |
| `POST /api/v1/web/register` | None | 6DAiNAS-Web visitor registration |
| `GET /api/v1/stats` | Bearer | Aggregate stats for admin dashboard |
| `GET /health` | None | Liveness probe |

### Sprint.06 — One-Shot Installer

**Date:** 2026-05-08 · **Commit:** `c007c69`

| # | Type | File | Item | Status |
|---|------|------|------|--------|
| 1 | FEATURE | `Installer/install.sh` | Prerequisites check (Go ≥ 1.22, systemd, root) | ✅ |
| 2 | FEATURE | `Installer/install.sh` | Build binary to `/usr/local/bin/6dainas-telemetry` | ✅ |
| 3 | FEATURE | `Installer/install.sh` | Create `/var/lib/6dainas-telemetry/` data directory | ✅ |
| 4 | FEATURE | `Installer/install.sh` | Install + enable + start `6dainas-telemetry.service` | ✅ |
| 5 | FEATURE | `Installer/install.sh` | Print service status on completion | ✅ |

---

## Phase 4 — Production Deployment

**Goal:** Live production site at `6dainas.cloud` and `telemetry.6dainas.cloud`.

### Sprint.07 — Production Deployment

**Date:** 2026-05-08 · **Commit:** `1cee7ce`

| # | Type | File | Item | Status |
|---|------|------|------|--------|
| 1 | DEPLOY | VPS | Cloned repo, ran `Installer/install.sh` | ✅ |
| 2 | DEPLOY | VPS | `docker compose -f infra/docker/docker-compose.prod.yml up -d --build` | ✅ |
| 3 | DEPLOY | VPS | WordPress site replaced by Next.js at `6dainas.cloud` | ✅ |
| 4 | DEPLOY | VPS | Go telemetry service running as systemd unit | ✅ |

### Sprint.08 — Caddy Config + Port Fix

**Date:** 2026-05-08 · **Commits:** `f46f578`, `3be8cd0`

| # | Type | File | Issue / Item | Status |
|---|------|------|-------------|--------|
| 1 | BUG | `infra/docker/docker-compose.prod.yml` | Missing port mapping `3000:3000` — site unreachable despite container running | ✅ Fixed |
| 2 | FEATURE | `infra/caddy/Caddyfile` | Caddy reverse-proxy for `6dainas.cloud` + `www.6dainas.cloud` → port 3000 | ✅ |
| 3 | FEATURE | `infra/caddy/Caddyfile` | Caddy reverse-proxy for `telemetry.6dainas.cloud` → port 8080 | ✅ |
| 4 | REFACTOR | `infra/caddy/Caddyfile` | Moved `telemetry.6dainas.cloud` block from 6DAiNAS-OS repo to here (correct location) | ✅ |

### Sprint.09 — .gitignore Cleanup

**Date:** 2026-05-08 · **Commit:** `5fd3fa1`

| # | Type | File | Item | Status |
|---|------|------|------|--------|
| 1 | CLEANUP | `.gitignore` | Added `reference/` — local WordPress screenshots, not for VCS | ✅ |

---

## Phase 5 — Roadmap (Planned)

**Goal:** Feature-complete branding site with documentation, changelogs, download links, and expanded telemetry.

| # | Priority | Item | Notes |
|---|----------|------|-------|
| 1 | HIGH | Download page — links to latest 6DAiNAS-OS release from GitHub | Integrate with GitHub releases API |
| 2 | HIGH | Docs/changelog section | Mirror or link to 6DAiNAS-OS release notes |
| 3 | MEDIUM | E-commerce event tracking | Add `POST /api/v1/ecommerce/event` to telemetry service |
| 4 | MEDIUM | GitHub Actions CI/CD | Auto-build and push Docker image to GHCR on push to main |
| 5 | MEDIUM | Telemetry auth hardening | Replace static Bearer token with JWT for `/api/v1/stats` |
| 6 | LOW | Dark/light mode toggle | Tailwind CSS dark mode support |
| 7 | LOW | Localization | i18n for primary markets |

---
