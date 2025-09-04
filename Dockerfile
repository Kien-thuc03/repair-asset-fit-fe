FROM node:20-alpine AS base
WORKDIR /app

# Cài đặt dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Xây dựng ứng dụng
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Tạo image chạy production
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
