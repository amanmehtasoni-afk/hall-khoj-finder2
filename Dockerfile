# ==============================================================================
# HALL KHOJ FINDER — PRODUCTION DOCKERFILE
# Multi-stage optimized Node.js image for Cloud Run / Render / Railway
# ==============================================================================

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY .env.example ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "backend/server.js"]
