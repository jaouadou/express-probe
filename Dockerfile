# Build Stage
FROM node:18-alpine as builder

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only necessary files first
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY .env.example ./.env

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/.env ./

# Switch to non-root user
USER appuser

EXPOSE 8080

CMD ["npm", "start"]
