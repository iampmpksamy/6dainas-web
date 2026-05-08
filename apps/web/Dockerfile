# ── Stage 1: Install dependencies ─────────────────────────────────────────────
# Use Debian-based node (glibc) so npm ci installs the correct SWC gnu binary.
# The lockfile was generated on a glibc host; musl binary is not in it.
FROM node:20 AS deps
WORKDIR /repo

# Copy workspace root + app manifests for deterministic layer caching
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
RUN npm ci

# ── Stage 2: Build Next.js (standalone output) ────────────────────────────────
FROM node:20 AS builder
WORKDIR /repo

COPY --from=deps /repo/node_modules    ./node_modules
COPY package.json                       ./
COPY apps/web                           apps/web

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build --workspace=@6dainas/web

# ── Stage 3: Lean production runtime ──────────────────────────────────────────
# Standalone output has no native addons — safe to run on Alpine.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 -G nodejs nextjs

# Copy only the standalone bundle + static assets — no node_modules needed
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static      ./.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public            ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000 2>/dev/null | grep -q '<' || exit 1

CMD ["node", "server.js"]
