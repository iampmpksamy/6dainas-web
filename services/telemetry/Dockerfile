# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM golang:1.22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o telemetry ./cmd/server

# ── Stage 2: Lean runtime ─────────────────────────────────────────────────────
FROM alpine:3.19 AS runner

RUN apk add --no-cache ca-certificates tzdata && \
    addgroup -g 1001 -S telemetry && adduser -S -u 1001 -G telemetry telemetry

WORKDIR /app
COPY --from=builder /app/telemetry .

USER telemetry

ENV TELEMETRY_PORT=7000
ENV TELEMETRY_DB=/data/telemetry.db

EXPOSE 7000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:7000/health | grep -q ok || exit 1

CMD ["./telemetry"]
