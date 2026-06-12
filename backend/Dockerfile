FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
COPY package.json ./
RUN chmod +x entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
