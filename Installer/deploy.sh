#!/usr/bin/env bash
# =============================================================================
#  6DAiNAS Web — Production Deployment Script
#  Deploys the Next.js branding site (6dainas.cloud) as a Docker container.
#
#  Usage (from repo root):
#    bash Installer/deploy.sh              # interactive
#    SKIP_BUILD=1 bash Installer/deploy.sh # pull from GHCR, skip local build
#
#  Prerequisites on the HomeLab server:
#    - Docker 24+ and Docker Compose v2
#    - Caddy running as a system service
#    - Cloudflare DNS A record for 6dainas.cloud → this server's IP
# =============================================================================

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()  { echo -e "${CYAN}  →${RESET} $*"; }
ok()    { echo -e "${GREEN}  ✓${RESET} $*"; }
warn()  { echo -e "${YELLOW}  ⚠${RESET} $*"; }
die()   { echo -e "${RED}  ✗ ERROR:${RESET} $*" >&2; exit 1; }
header(){ echo -e "\n${BOLD}${CYAN}▶ $*${RESET}"; }
ask()   { echo -e "  ${YELLOW}$*${RESET}"; }

# ── Paths ─────────────────────────────────────────────────────────────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/infra/docker/docker-compose.prod.yml"
ENV_FILE="${REPO_ROOT}/.env.local"
ENV_EXAMPLE="${REPO_ROOT}/.env.example"
CADDY_SNIPPET="${REPO_ROOT}/infra/caddy/6dainas-web.caddy"
GHCR_IMAGE="ghcr.io/iampmpksamy/6dainas-web:main"
LOCAL_IMAGE="6dainas-web:latest"

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}╔══════════════════════════════════════════════════╗"
echo -e "║   6DAiNAS Web — Production Deployment            ║"
echo -e "║   6dainas.cloud                                  ║"
echo -e "╚══════════════════════════════════════════════════╝${RESET}\n"

info "Repo root: ${REPO_ROOT}"

# ── Dependency checks ─────────────────────────────────────────────────────────
header "Checking prerequisites"

command -v docker      &>/dev/null || die "Docker is not installed. Install from https://docs.docker.com/engine/install/"
docker compose version &>/dev/null || die "Docker Compose v2 is required: sudo apt install docker-compose-plugin"

ok "Docker: $(docker --version | cut -d' ' -f3 | tr -d ',')"
ok "Compose: $(docker compose version --short)"

if ! docker info &>/dev/null; then
    die "Docker daemon is not running or you lack permission. Try: sudo usermod -aG docker \$USER && newgrp docker"
fi

# ── .env.local setup ──────────────────────────────────────────────────────────
header "Environment configuration"

if [[ -f "${ENV_FILE}" ]]; then
    ok ".env.local already exists — using existing values"
    # shellcheck disable=SC1090
    source "${ENV_FILE}"
else
    warn ".env.local not found — creating from template"
    cp "${ENV_EXAMPLE}" "${ENV_FILE}"

    echo ""
    ask "Enter ADMIN_PASSWORD (password for /admin/login):"
    read -r -p "  > " ADMIN_PASSWORD_INPUT
    [[ -n "${ADMIN_PASSWORD_INPUT}" ]] || die "ADMIN_PASSWORD cannot be empty"

    ADMIN_SECRET_GEN=$(openssl rand -hex 32)
    ask "Enter ADMIN_SECRET (min 32 chars) or press Enter to auto-generate:"
    read -r -p "  > " ADMIN_SECRET_INPUT
    ADMIN_SECRET_VAL="${ADMIN_SECRET_INPUT:-${ADMIN_SECRET_GEN}}"
    [[ ${#ADMIN_SECRET_VAL} -ge 32 ]] || die "ADMIN_SECRET must be at least 32 characters"

    ask "Enter ANALYTICS_KEY (from telemetry service installer) or press Enter to leave blank:"
    read -r -p "  > " ANALYTICS_KEY_INPUT

    # Write values into .env.local
    sed -i \
        -e "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${ADMIN_PASSWORD_INPUT}|" \
        -e "s|^ADMIN_SECRET=.*|ADMIN_SECRET=${ADMIN_SECRET_VAL}|" \
        -e "s|^ANALYTICS_KEY=.*|ANALYTICS_KEY=${ANALYTICS_KEY_INPUT}|" \
        "${ENV_FILE}"

    ok ".env.local written"
fi

# ── Docker image ──────────────────────────────────────────────────────────────
header "Docker image"

if [[ "${SKIP_BUILD:-0}" == "1" ]]; then
    info "SKIP_BUILD=1 — pulling from GHCR: ${GHCR_IMAGE}"
    docker pull "${GHCR_IMAGE}"
    DEPLOY_IMAGE="${GHCR_IMAGE}"
    ok "Pulled ${DEPLOY_IMAGE}"
else
    echo ""
    ask "Build image locally (b) or pull from GHCR (p)? [b/p, default: b]"
    read -r -p "  > " BUILD_CHOICE
    BUILD_CHOICE="${BUILD_CHOICE:-b}"

    if [[ "${BUILD_CHOICE}" == "p" ]]; then
        info "Pulling from GHCR: ${GHCR_IMAGE}"
        docker pull "${GHCR_IMAGE}"
        DEPLOY_IMAGE="${GHCR_IMAGE}"
        ok "Pulled ${DEPLOY_IMAGE}"
    else
        info "Building locally from ${REPO_ROOT}…"
        docker build \
            -f "${REPO_ROOT}/apps/web/Dockerfile" \
            -t "${LOCAL_IMAGE}" \
            "${REPO_ROOT}"
        DEPLOY_IMAGE="${LOCAL_IMAGE}"
        ok "Built ${DEPLOY_IMAGE}"
    fi
fi

# Write WEB_IMAGE into .env.local so docker-compose picks it up
if grep -q "^WEB_IMAGE=" "${ENV_FILE}" 2>/dev/null; then
    sed -i "s|^WEB_IMAGE=.*|WEB_IMAGE=${DEPLOY_IMAGE}|" "${ENV_FILE}"
else
    echo "WEB_IMAGE=${DEPLOY_IMAGE}" >> "${ENV_FILE}"
fi

# ── Deploy ────────────────────────────────────────────────────────────────────
header "Deploying container"

cd "${REPO_ROOT}"

if docker ps --format '{{.Names}}' | grep -q "^6dainas-web$"; then
    info "Container already running — rolling update…"
    WEB_IMAGE="${DEPLOY_IMAGE}" docker compose -f "${COMPOSE_FILE}" up -d --no-deps --pull never web
    ok "Container updated"
else
    info "Starting container for the first time…"
    WEB_IMAGE="${DEPLOY_IMAGE}" docker compose -f "${COMPOSE_FILE}" up -d
    ok "Container started"
fi

# ── Health check ──────────────────────────────────────────────────────────────
header "Health check"

info "Waiting for Next.js to be ready (up to 30s)…"
for i in $(seq 1 30); do
    if curl -sf http://127.0.0.1:3000 &>/dev/null; then
        ok "Next.js is responding on http://127.0.0.1:3000"
        break
    fi
    if [[ $i -eq 30 ]]; then
        warn "Timeout waiting for Next.js. Check logs:"
        warn "  docker logs 6dainas-web --tail 50"
        break
    fi
    sleep 1
done

# ── Caddy wiring ──────────────────────────────────────────────────────────────
header "Caddy configuration"

CADDYFILE_CANDIDATES=(
    "/DATA/Developer/CasaOS Rebranding to 6DAiNASOS/6DAiNAS-OS/caddy/Caddyfile"
    "/etc/caddy/Caddyfile"
    "/var/lib/caddy/Caddyfile"
)

CADDYFILE_FOUND=""
for f in "${CADDYFILE_CANDIDATES[@]}"; do
    if [[ -f "$f" ]]; then
        CADDYFILE_FOUND="$f"
        break
    fi
done

if [[ -n "${CADDYFILE_FOUND}" ]]; then
    if grep -q "6dainas.cloud" "${CADDYFILE_FOUND}"; then
        ok "6dainas.cloud block already present in ${CADDYFILE_FOUND}"
    else
        warn "6dainas.cloud block not found in ${CADDYFILE_FOUND}"
        echo -e "\n  Add the contents of ${CADDY_SNIPPET}"
        echo -e "  to: ${CADDYFILE_FOUND}\n"
        echo -e "  Then reload Caddy: ${BOLD}sudo systemctl reload caddy${RESET}"
    fi
else
    warn "Caddyfile not found. Add the contents of:"
    warn "  ${CADDY_SNIPPET}"
    warn "to your Caddyfile, then reload Caddy."
fi

# ── DNS reminder ──────────────────────────────────────────────────────────────
header "Cloudflare DNS checklist"

SERVER_IP=$(curl -s --max-time 5 https://ipv4.icanhazip.com 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "
  ${BOLD}Update Cloudflare DNS for 6dainas.cloud:${RESET}

  ${BOLD}Required records:${RESET}
  ┌──────────────────────────┬────────┬───────────────────┬──────────┐
  │ Name                     │ Type   │ Content           │ Proxy    │
  ├──────────────────────────┼────────┼───────────────────┼──────────┤
  │ 6dainas.cloud            │ A      │ ${SERVER_IP}      │ ✓ ON     │
  │ www.6dainas.cloud        │ CNAME  │ 6dainas.cloud     │ ✓ ON     │
  └──────────────────────────┴────────┴───────────────────┴──────────┘

  ${BOLD}Cloudflare SSL/TLS mode:${RESET} Full (strict)
  ${BOLD}Cloudflare → SSL/TLS → Edge Certificates → Always Use HTTPS:${RESET} ON

  Once DNS propagates (usually < 5 min with Cloudflare orange cloud):
    curl -I https://6dainas.cloud
"

# ── Final summary ─────────────────────────────────────────────────────────────
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════╗"
echo -e "║   Deployment complete!                           ║"
echo -e "╚══════════════════════════════════════════════════╝${RESET}"

echo -e "
  ${BOLD}Container:${RESET}
    Status  : docker ps --filter name=6dainas-web
    Logs    : docker logs 6dainas-web -f
    Restart : docker compose -f infra/docker/docker-compose.prod.yml restart

  ${BOLD}After DNS switch:${RESET}
    Site    : https://6dainas.cloud
    Admin   : https://6dainas.cloud/admin/login
    Health  : https://6dainas.cloud/api/track (POST)
"
