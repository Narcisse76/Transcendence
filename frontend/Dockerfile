FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

COPY certs/ /etc/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "deamon off;"]
#daemon off = toujours processus principal et -g permet d'injecter cette directive a tous


