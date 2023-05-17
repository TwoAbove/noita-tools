FROM node:18-slim as build-image

RUN apt-get update && \
  apt-get install -y \
  g++ \
  make \
  cmake \
  build-essential autoconf automake libtool m4 libssl-dev \
  unzip \
  python3 \
  libcurl4-openssl-dev \
  libfontconfig1

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn lambda-build

RUN rm -rf node_modules && yarn install --frozen-lockfile --production=true

FROM node:18-alpine

COPY --from=build-image /app/lambda-build  ./
COPY --from=build-image /app/node_modules  ./

ENTRYPOINT ["node", "consoleSearch.js"]
