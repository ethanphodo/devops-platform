# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY app/package*.json ./

# Install all dependencies (including dev for building)
RUN npm ci

# Copy application code
COPY app/ ./

# Run linting and tests during build
RUN npm run lint
RUN npm test

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Copy package files
COPY app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code from builder
COPY --from=builder /app/server.js ./

# Set ownership to non-root user
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start application
CMD ["node", "server.js"]
