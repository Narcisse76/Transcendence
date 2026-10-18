FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=prod

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# needed for vault.sh
RUN apk add --no-cache curl jq

COPY vault.sh /app/vault.sh
RUN chmod +x /app/vault.sh

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "/app/vault.sh"]
CMD ["node", "dist/main.js"]
