#!/usr/bin/env bash
# =============================================================================
#  6DAiNAS Telemetry Service — Installer
#  Builds the Go binary from source and wires it up as a systemd service.
#
#  Usage:
#    sudo bash install.sh              # interactive
#    TELEMETRY_KEY=<key> sudo bash install.sh   # non-interactive (CI)
#
#  Supported: Debian/Ubuntu/Raspberry Pi OS (any systemd-based Linux)
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

# ── Paths & constants ─────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_ROOT="$(dirname "$SCRIPT_DIR")"   # services/telemetry/

BINARY_NAME="6dainas-telemetry"
BINARY_DEST="/usr/local/bin/${BINARY_NAME}"
SERVICE_USER="6dainas-telemetry"
STATE_DIR="/var/lib/6dainas-telemetry"
UNIT_NAME="6dainas-telemetry.service"
UNIT_SRC="${SERVICE_ROOT}/../../infra/systemd/${UNIT_NAME}"
UNIT_DEST="/etc/systemd/system/${UNIT_NAME}"
PORT="${TELEMETRY_PORT:-7000}"

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}╔══════════════════════════════════════════════════╗"
echo -e "║   6DAiNAS Telemetry Service  —  Installer        ║"
echo -e "║   telemetry.6dainas.cloud                        ║"
echo -e "╚══════════════════════════════════════════════════╝${RESET}\n"

# ── Root check ────────────────────────────────────────────────────────────────
[[ $EUID -eq 0 ]] || die "Run this script with sudo: sudo bash $0"

# ── Dependency checks ─────────────────────────────────────────────────────────
header "Checking dependencies"

command -v go      &>/dev/null || die "Go is not installed. Install from https://go.dev/dl/ then re-run."
command -v systemctl &>/dev/null || die "systemd is required. This installer only supports systemd-based Linux."
command -v git     &>/dev/null || warn "git not found — will build from local source only."

GO_VERSION=$(go version | awk '{print $3}')
ok "Go found: ${GO_VERSION}"
ok "systemd found: $(systemctl --version | head -1)"

# ── Build binary ──────────────────────────────────────────────────────────────
header "Building binary from source"

info "Source directory: ${SERVICE_ROOT}"
info "Building ${BINARY_NAME}…"

cd "${SERVICE_ROOT}"
CGO_ENABLED=0 GOOS=linux go build \
  -ldflags="-w -s -X main.Version=$(git -C "${SERVICE_ROOT}" describe --tags --always 2>/dev/null || echo 'dev')" \
  -o "/tmp/${BINARY_NAME}" \
  ./cmd/server

ok "Binary built: /tmp/${BINARY_NAME} ($(du -sh "/tmp/${BINARY_NAME}" | cut -f1))"

# ── Install binary ────────────────────────────────────────────────────────────
header "Installing binary"

if [[ -f "${BINARY_DEST}" ]]; then
  PREV_VERSION=$("${BINARY_DEST}" --version 2>/dev/null || echo "unknown")
  info "Replacing existing binary (was: ${PREV_VERSION})"
fi

install -m 0755 "/tmp/${BINARY_NAME}" "${BINARY_DEST}"
ok "Installed to ${BINARY_DEST}"

# ── Create system user ────────────────────────────────────────────────────────
header "Creating system user"

if id "${SERVICE_USER}" &>/dev/null; then
  ok "User '${SERVICE_USER}' already exists"
else
  useradd --system --no-create-home --shell /usr/sbin/nologin \
    --comment "6DAiNAS Telemetry Service" "${SERVICE_USER}"
  ok "Created system user '${SERVICE_USER}'"
fi

# ── Create state directory ────────────────────────────────────────────────────
header "Creating data directory"

if [[ -d "${STATE_DIR}" ]]; then
  ok "${STATE_DIR} already exists"
else
  mkdir -p "${STATE_DIR}"
  ok "Created ${STATE_DIR}"
fi

chown -R "${SERVICE_USER}:${SERVICE_USER}" "${STATE_DIR}"
chmod 750 "${STATE_DIR}"
ok "Permissions set on ${STATE_DIR}"

# ── TELEMETRY_KEY ─────────────────────────────────────────────────────────────
header "API key setup"

if [[ -z "${TELEMETRY_KEY:-}" ]]; then
  # Check if already set in unit file
  if [[ -f "${UNIT_DEST}" ]] && grep -q "^Environment=TELEMETRY_KEY=.\+" "${UNIT_DEST}" 2>/dev/null; then
    TELEMETRY_KEY=$(grep "^Environment=TELEMETRY_KEY=" "${UNIT_DEST}" | cut -d= -f3)
    info "Reusing existing TELEMETRY_KEY from ${UNIT_DEST}"
  else
    echo -e "  ${YELLOW}Enter a TELEMETRY_KEY (min 32 chars) or press Enter to auto-generate:${RESET}"
    read -r -p "  TELEMETRY_KEY > " INPUT_KEY
    if [[ -n "${INPUT_KEY}" ]]; then
      [[ ${#INPUT_KEY} -ge 32 ]] || die "Key must be at least 32 characters."
      TELEMETRY_KEY="${INPUT_KEY}"
    else
      TELEMETRY_KEY=$(openssl rand -hex 32)
      warn "Auto-generated key — save this, you will need it in your .env.local:"
      echo -e "\n  ${BOLD}TELEMETRY_KEY=${TELEMETRY_KEY}${RESET}\n"
    fi
  fi
fi

ok "TELEMETRY_KEY configured (length: ${#TELEMETRY_KEY})"

# ── Install systemd unit ──────────────────────────────────────────────────────
header "Installing systemd unit"

UNIT_SRC_RESOLVED="$(realpath "${UNIT_SRC}" 2>/dev/null || true)"
if [[ ! -f "${UNIT_SRC_RESOLVED}" ]]; then
  die "Systemd unit not found at ${UNIT_SRC}. Run from inside the services/telemetry/Installer/ directory."
fi

# Write the unit with the real key and port substituted
sed \
  -e "s|# Environment=TELEMETRY_KEY=|Environment=TELEMETRY_KEY=${TELEMETRY_KEY}|g" \
  -e "s|Environment=TELEMETRY_PORT=7000|Environment=TELEMETRY_PORT=${PORT}|g" \
  "${UNIT_SRC_RESOLVED}" > "${UNIT_DEST}"

chmod 644 "${UNIT_DEST}"
ok "Installed ${UNIT_DEST}"

# ── Enable & start service ────────────────────────────────────────────────────
header "Enabling service"

systemctl daemon-reload

if systemctl is-active --quiet "${UNIT_NAME}"; then
  info "Service is running — restarting to apply update…"
  systemctl restart "${UNIT_NAME}"
  ok "Service restarted"
else
  systemctl enable "${UNIT_NAME}"
  systemctl start  "${UNIT_NAME}"
  ok "Service enabled and started"
fi

# ── Health check ──────────────────────────────────────────────────────────────
header "Health check"

HEALTH_URL="http://127.0.0.1:${PORT}/health"
info "Waiting for service to be ready (up to 15s)…"

for i in $(seq 1 15); do
  if curl -sf "${HEALTH_URL}" &>/dev/null; then
    RESPONSE=$(curl -sf "${HEALTH_URL}")
    ok "Service is healthy: ${RESPONSE}"
    break
  fi
  if [[ $i -eq 15 ]]; then
    warn "Health check timed out. Check logs:"
    warn "  journalctl -u ${UNIT_NAME} -n 30 --no-pager"
    break
  fi
  sleep 1
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}${GREEN}╔══════════════════════════════════════════════════╗"
echo -e "║   Installation complete!                         ║"
echo -e "╚══════════════════════════════════════════════════╝${RESET}"

echo -e "
${BOLD}Service:${RESET}
  Status  : systemctl status ${UNIT_NAME}
  Logs    : journalctl -u ${UNIT_NAME} -f
  Port    : ${PORT}  (proxy via Caddy → telemetry.6dainas.cloud)

${BOLD}Endpoints:${RESET}
  Health          GET  http://127.0.0.1:${PORT}/health
  OS Register     POST http://127.0.0.1:${PORT}/api/v1/os/register
  Web Event       POST http://127.0.0.1:${PORT}/api/v1/web/event
  Web Lead        POST http://127.0.0.1:${PORT}/api/v1/web/lead
  Stats (auth)    GET  http://127.0.0.1:${PORT}/api/v1/stats

${BOLD}Add to your .env.local (6dainas-web):${RESET}
  ANALYTICS_URL=https://telemetry.6dainas.cloud
  ANALYTICS_KEY=${TELEMETRY_KEY}

${BOLD}Caddy config (add to Caddyfile):${RESET}
  telemetry.6dainas.cloud {
      reverse_proxy 127.0.0.1:${PORT}
  }
"
