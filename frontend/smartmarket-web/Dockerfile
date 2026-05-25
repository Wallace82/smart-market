# ========== BUILD STAGE ==========
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build

# ========== RUNTIME STAGE ==========
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 4200

CMD ["serve", "-s", "dist", "-l", "4200"]
