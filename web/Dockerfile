FROM node:lts-alpine AS build

WORKDIR /app

COPY yarn.lock package.json .yarnrc.yml ./
RUN corepack enable
RUN yarn

COPY . .
RUN yarn build

FROM caddy:2.8.1-alpine

COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443