FROM node:12 AS development

RUN mkdir -p /srv/todo/backend && chown -R node:node /srv/todo

USER node

WORKDIR /srv/todo/backend

COPY --chown=node:node backend/package.json backend/package-lock.json ./

RUN npm install --quiet

FROM node:12-slim AS production

USER node

WORKDIR /srv/todo/backend

COPY --from=development --chown=root:root /srv/todo/backend/node_modules ./node_modules

COPY . .

CMD ["node", "server.js"]
