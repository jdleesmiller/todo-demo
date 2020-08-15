#
# Base
#
FROM node:12 AS base

RUN mkdir -p /srv/todo/storage && chown -R node:node /srv/todo

USER node

WORKDIR /srv/todo/storage

COPY --chown=node:node storage/package.json storage/package-lock.json ./

RUN npm install --quiet

#
# Development
#
FROM base AS development

RUN mkdir /srv/todo/search

WORKDIR /srv/todo/search

COPY --chown=node:node search/package.json search/package-lock.json ./

RUN npm install --quiet

#
# Production
#
FROM node:12-slim AS production

USER node

WORKDIR /srv/todo/search

COPY --from=development --chown=root:root /srv/todo/search/node_modules ./node_modules

COPY . .

CMD ["node", "server.js"]
