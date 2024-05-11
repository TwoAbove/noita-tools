FROM node:22-slim as build-image

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

RUN npm i esbuild

COPY . .

# RUN npm install

RUN npm run console-build

FROM node:22-slim

RUN apt-get update && \
  apt-get install -y \
  python3 make g++

WORKDIR /app

COPY --from=build-image /app/console-build /app/

RUN npm install --production=true

ENTRYPOINT ["npm", "run", "start"]
