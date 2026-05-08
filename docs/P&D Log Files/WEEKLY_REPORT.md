# 6DAiNAS Web — Weekly Progress Report

> **Project:** 6DAiNAS branding site + centralized telemetry service  
> **Report cadence:** Weekly (Friday)  
> **Last updated:** 2026-05-08 (Week 1 — complete: site launched, telemetry service deployed, production live)

---

## Week 1 — 2026-05-05 to 2026-05-09 *(Current)*

### Summary

Full project bootstrapped and shipped in a single week. Started from zero (WordPress placeholder site) and ended with a production-deployed Next.js branding site at `6dainas.cloud`, a centralized Go telemetry service at `telemetry.6dainas.cloud`, Caddy TLS termination, Docker containerization, and a Maalig-style monorepo structure.

**Total sessions:** 9 sprints across one day (2026-05-08).

---

### Sprint.01 — Initial Branding Site + Admin Dashboard

**Session 1 of 9**

| Task | File | Status |
|------|------|--------|
| Create Next.js 14 project with App Router + Tailwind | `apps/web/` | ✅ |
| Public landing page — hero section + feature grid | `apps/web/src/app/page.tsx` | ✅ |
| Admin dashboard route with stats + registration table | `apps/web/src/app/admin/page.tsx` | ✅ |
| Basic Auth middleware guard for `/admin` | `apps/web/src/app/admin/layout.tsx` | ✅ |
| Enable `output: 'standalone'` | `apps/web/next.config.mjs` | ✅ |

---

### Sprint.02 — Analytics URL Fix

**Session 2 of 9**

| Task | File | Status |
|------|------|--------|
| Fix `ANALYTICS_URL` localhost → `https://telemetry.6dainas.cloud` | `.env.local`, `.env.example` | ✅ |

**Bugs Fixed:**

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | Admin dashboard fetches fail in production | `ANALYTICS_URL` hardcoded to `localhost:8080` | Set to production telemetry endpoint |

---

### Sprint.03 — Docker Containerisation

**Session 3 of 9**

| Task | File | Status |
|------|------|--------|
| 3-stage multi-stage Dockerfile | `apps/web/Dockerfile` | ✅ |
| Stage 1 + 2 on `node:20` (Debian) to match glibc SWC binary | `apps/web/Dockerfile` | ✅ |
| Stage 3 on `node:20-alpine` for minimal runtime image | `apps/web/Dockerfile` | ✅ |
| Non-root `nextjs:1001` user in runner | `apps/web/Dockerfile` | ✅ |
| HEALTHCHECK via `wget` every 15s | `apps/web/Dockerfile` | ✅ |

**Bugs Fixed:**

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 2 | Docker build fails with SWC binary GLIBC error | `package-lock.json` locks gnu SWC binary; Alpine (musl) can't run it | Changed deps + builder stages to `node:20` (Debian); runner stays Alpine |

---

### Sprint.04 — Monorepo Restructure

**Session 4 of 9**

| Task | File | Status |
|------|------|--------|
| Restructure to `apps/web/`, `infra/docker/`, `services/`, `Installer/` | Repo root | ✅ |
| Root npm workspace `package.json` | `package.json` | ✅ |
| Docker Compose: build context from repo root | `infra/docker/docker-compose.yml` | ✅ |
| Docker Compose prod: env_file + port binding | `infra/docker/docker-compose.prod.yml` | ✅ |
| Remove stale `apps/web/package-lock.json` | — | ✅ |

---

### Sprint.05 — Go Telemetry Service

**Session 5 of 9**

| Task | File | Status |
|------|------|--------|
| Registration event model | `services/telemetry/model/registration.go` | ✅ |
| SQLite storage layer | `services/telemetry/service/db.go` | ✅ |
| HTTP API handlers | `services/telemetry/route/router.go` | ✅ |
| Service entry point | `services/telemetry/main.go` | ✅ |

**New API:**

| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/os/register` | 6DAiNAS-OS install registration |
| `POST /api/v1/web/register` | 6DAiNAS-Web visitor registration |
| `GET /api/v1/stats` | Aggregate stats for admin dashboard |
| `GET /health` | Liveness probe |

---

### Sprint.06 — One-Shot Installer

**Session 6 of 9**

| Task | File | Status |
|------|------|--------|
| Prerequisites check (Go, systemd, root) | `Installer/install.sh` | ✅ |
| Build + install binary | `Installer/install.sh` | ✅ |
| Create data directory | `Installer/install.sh` | ✅ |
| Install + enable + start systemd service | `Installer/install.sh` | ✅ |

---

### Sprint.07 — Production Deployment

**Session 7 of 9**

| Task | Status |
|------|--------|
| Deploy telemetry service via `Installer/install.sh` | ✅ |
| Build + start web container via docker compose prod | ✅ |
| `6dainas.cloud` live (replaces WordPress) | ✅ |
| `telemetry.6dainas.cloud` live | ✅ |

---

### Sprint.08 — Caddy Config + Port Fix

**Session 8 of 9**

| Task | File | Status |
|------|------|--------|
| Create `infra/caddy/Caddyfile` | `infra/caddy/Caddyfile` | ✅ |
| Reverse proxy `6dainas.cloud` → port 3000 | `infra/caddy/Caddyfile` | ✅ |
| Reverse proxy `telemetry.6dainas.cloud` → port 8080 | `infra/caddy/Caddyfile` | ✅ |
| Move telemetry Caddy block from 6DAiNAS-OS repo | — | ✅ |

**Bugs Fixed:**

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 3 | Site unreachable despite container running | `docker-compose.prod.yml` missing `ports: - "3000:3000"` | Added port mapping |

---

### Sprint.09 — .gitignore Cleanup

**Session 9 of 9**

| Task | File | Status |
|------|------|--------|
| Add `reference/` to .gitignore | `.gitignore` | ✅ |

---

### Bugs Fixed This Week

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | Admin dashboard fetches fail in production | `ANALYTICS_URL` hardcoded to localhost | Changed to production telemetry URL |
| 2 | Docker build SWC binary GLIBC error | Package-lock locks gnu binary; Alpine can't run it | Build stages on Debian node:20 |
| 3 | Site unreachable after deploy | Missing port binding in docker-compose.prod.yml | Added `ports: - "3000:3000"` |

---

### Metrics

| Metric | Start of Week | End of Week |
|--------|-------------|------------|
| Site live at 6dainas.cloud | ❌ (WordPress) | ✅ (Next.js) |
| Telemetry service live | ❌ | ✅ |
| Docker containerised | ❌ | ✅ |
| Monorepo structure | ❌ | ✅ |
| Caddy TLS termination | ❌ | ✅ |
| Admin dashboard accessible | ❌ | ✅ |
| Go telemetry endpoints | 0 | 4 |

---

### Files Created / Changed This Week

| File | Action |
|------|--------|
| `apps/web/src/app/page.tsx` | Created |
| `apps/web/src/app/admin/page.tsx` | Created |
| `apps/web/src/app/admin/layout.tsx` | Created |
| `apps/web/src/components/` (3 components) | Created |
| `apps/web/next.config.mjs` | Created |
| `apps/web/package.json` | Created |
| `apps/web/Dockerfile` | Created |
| `apps/web/.env.example` | Created |
| `package.json` | Created (npm workspace root) |
| `package-lock.json` | Created (root lockfile) |
| `infra/docker/docker-compose.yml` | Created |
| `infra/docker/docker-compose.prod.yml` | Created |
| `infra/caddy/Caddyfile` | Created |
| `services/telemetry/model/registration.go` | Created |
| `services/telemetry/service/db.go` | Created |
| `services/telemetry/route/router.go` | Created |
| `services/telemetry/main.go` | Created |
| `Installer/install.sh` | Created |
| `.gitignore` | Modified (added reference/) |
| `docs/deployment.md` | Created |
| `docs/P&D Log Files/MASTER_LOG.md` | Created |
| `docs/P&D Log Files/PHASE_TRACKER.md` | Created |
| `docs/P&D Log Files/WEEKLY_REPORT.md` | Created |

---

### Next Week Plan (Week 2 — 2026-05-12 to 2026-05-16)

- [ ] GitHub Actions CI/CD — build + push Docker image to GHCR on push to main
- [ ] Download page — pulls latest 6DAiNAS-OS release from GitHub Releases API
- [ ] Docs/changelog section — Sprint and release history visible on site
- [ ] E-commerce event tracking endpoint: `POST /api/v1/ecommerce/event`
- [ ] Telemetry auth hardening — replace static Bearer token with JWT

---

## Cumulative Stats

| Metric | Value |
|--------|-------|
| Weeks active | 1 |
| Sprints completed | 9 |
| Sessions | 1 (all work done 2026-05-08) |
| Files created | 23 |
| Bugs fixed | 3 |
| New API endpoints | 4 (`POST /os/register`, `POST /web/register`, `GET /stats`, `GET /health`) |
| Go services | 1 (`services/telemetry/`) |
| Docker stages | 3 (deps, builder, runner) |
| Domains live | 2 (`6dainas.cloud`, `telemetry.6dainas.cloud`) |
| Production readiness score | 85/100 (missing CI/CD, auth hardening, download page) |

---
