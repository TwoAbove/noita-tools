FROM node:18-slim as build-image

RUN apt-get update && \
  apt-get install -y \
  g++ \
  make \
  cmake \
  build-essential autoconf automake libtool m4 libssl-dev \
  unzip \
  libcurl4-openssl-dev \
  libfontconfig1 \
  python python3

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn lambda-build

RUN yarn add aws-lambda-ric
RUN rm -rf node_modules && yarn install --frozen-lockfile --production=true

FROM gcr.io/distroless/nodejs18-debian11

COPY --from=build-image /app/lambda-build  ./
COPY --from=build-image /app/node_modules  ./

# ENTRYPOINT ["node", "node_modules/.bin/aws-lambda-ric"]
CMD ["node_modules/.bin/aws-lambda-ric", "lambdaSearch.handler" ]
