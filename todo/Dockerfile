FROM node:12 AS development

RUN mkdir /srv/todo && chown node:node /srv/todo

USER node

WORKDIR /srv/todo

COPY --chown=node:node package.json package-lock.json ./

RUN npm install --quiet

FROM node:12-slim AS production

USER node

WORKDIR /srv/todo

COPY --from=development --chown=root:root /srv/todo/node_modules ./node_modules

COPY . .

CMD ["node", "server.js"]
