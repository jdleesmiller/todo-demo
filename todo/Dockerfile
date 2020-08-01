#
# Common Dependencies
#
FROM node:12 AS base

RUN mkdir -p /srv/todo/storage && chown -R node:node /srv/todo

USER node

WORKDIR /srv/todo/storage

COPY --chown=node:node storage/package.json storage/package-lock.json ./

RUN npm install --quiet

#
# Backend for Development
#
FROM base AS development-backend

RUN mkdir /srv/todo/backend

WORKDIR /srv/todo/backend

COPY --chown=node:node todo/backend/package.json todo/backend/package-lock.json ./

RUN npm install --quiet

#
# Frontend for Development
#
FROM base AS development-frontend

RUN mkdir /srv/todo/frontend

WORKDIR /srv/todo/frontend

COPY todo/frontend/package.json todo/frontend/package-lock.json ./

RUN npm install --quiet

#
# Frontend Build for Production
#
FROM development-frontend AS build-frontend

COPY frontend .

RUN npm run build

#
# Backend for Production
#
FROM node:12-slim AS production

USER node

WORKDIR /srv/todo/backend

COPY --from=development-backend --chown=root:root /srv/todo/backend/node_modules ./node_modules

COPY --from=development-backend --chown=root:root /srv/todo/storage/node_modules ../storage/node_modules

COPY --from=build-frontend --chown=root:root /srv/todo/frontend/dist ./dist

COPY . .

CMD ["node", "server.js"]
