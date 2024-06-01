FROM node:lts-alpine AS build

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm run build

FROM caddy:2.8.1-alpine

COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443