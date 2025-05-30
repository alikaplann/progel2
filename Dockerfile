From node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
Run npm ci
COPY . .
Run npx prisma generate --schema=./src/prisma/schema.prisma 
Run npm run build
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./prisma
COPY --from=builder /app/package*.json ./
Run npm ci --omit=dev
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/main.js"]