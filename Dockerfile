# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build Next.js (standalone output) ────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next build reads NEXT_PUBLIC_* at build time — runtime secrets stay in env
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ── Stage 3: Lean production runtime ──────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Port the server listens on (can be overridden via docker-compose environment)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Non-root user — same pattern as Maalig
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 -G nodejs nextjs

# standalone output + static assets + public dir
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000 2>/dev/null | grep -q '<' || exit 1

CMD ["node", "server.js"]
