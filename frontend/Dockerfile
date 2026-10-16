FROM node:22-alpine AS build-game
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY index.html ./
COPY public ./public
COPY src ./src
RUN npm run build -- --base=/game/

FROM node:22-alpine AS build-menu
WORKDIR /app
COPY menu/package*.json ./
RUN npm ci
COPY menu/ ./
RUN npm run build

FROM nginx:1.27-alpine AS runner

RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/nginx/certs/key.pem \
      -out /etc/nginx/certs/cert.pem \
      -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=ft_transcendence/CN=localhost"

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-menu /app/dist /usr/share/nginx/html
COPY --from=build-game /app/dist /usr/share/nginx/html/game

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
#daemon off = toujours processus principal et -g permet d'injecter cette directive a tous


