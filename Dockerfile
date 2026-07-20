# ── Stage 1: Builder ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

COPY src/ ./src/

# ── Stage 2: Production ─────────────────────────────────────────
FROM node:20-alpine AS production

LABEL maintainer="devsecops-team" \
      org.opencontainers.image.title="secure-cicd-app" \
      org.opencontainers.image.description="Secure CI/CD Pipeline Demo" \
      org.opencontainers.image.source="https://github.com/example/secure-cicd-pipeline"

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/src ./src
COPY --chown=appuser:appgroup package.json ./

# Set environment
ENV NODE_ENV=production

# Switch to non-root user
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --spider http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
