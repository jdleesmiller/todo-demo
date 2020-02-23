#
# Backend for Development
#
FROM node:12 AS development-backend

RUN mkdir -p /srv/todo/backend &&\
  mkdir -p /srv/todo/storage &&\
  chown -R node:node /srv/todo

USER node

WORKDIR /srv/todo/storage

COPY --chown=node:node storage/package.json storage/package-lock.json ./

RUN npm install --quiet

WORKDIR /srv/todo/backend

COPY --chown=node:node backend/package.json backend/package-lock.json ./

RUN npm install --quiet

#
# Frontend for Development
#
FROM node:12 AS development-frontend

RUN mkdir -p /srv/todo/frontend/dist && chown -R node:node /srv/todo

USER node

WORKDIR /srv/todo/frontend

COPY frontend/package.json frontend/package-lock.json ./

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
