# ---- Stage 1: Build frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---- Stage 2: Production image ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .
COPY --from=frontend-build /build/dist ./public

EXPOSE 3001
CMD ["node", "server.js"]
