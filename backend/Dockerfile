FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build
#A faire, le script build pour compiler tout les .ts en .js, seront automatiquement mis dans le dossier dist

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=prod

COPY package*.json ./
RUN npm ci --omit=dev
#--omit=dev n'installe pas les Dependance pour le DEV ainsi on a que ce qu'il faut pour de la prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]