FROM node:12

# Based on
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable ttf-freefont --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /srv/todo/storage \
  && mkdir -p /srv/todo/end-to-end-test \
  && chown -R node:node /srv/todo

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN usermod --groups audio,video node &&\
  mkdir -p /home/node/Downloads

USER node

WORKDIR /srv/todo/storage

COPY --chown=node:node storage/package.json storage/package-lock.json ./

RUN npm install --quiet

WORKDIR /srv/todo/end-to-end-test

COPY --chown=node:node end-to-end-test/package.json end-to-end-test/package-lock.json ./

RUN mkdir node_modules

RUN npm install --quiet
