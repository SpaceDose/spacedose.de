FROM node:lts-alpine AS build

WORKDIR /app

COPY bun.lock package.json ./
RUN bun install

COPY . .
RUN bun build

FROM caddy:2.11-alpine

COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443