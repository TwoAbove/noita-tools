FROM node:18-slim as build-image

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn lambda-build

RUN yarn add aws-lambda-ric
RUN rm -rf node_modules && yarn install --frozen-lockfile --production=true

FROM node:18-alpine

COPY --from=build-image /app/lambda-build  ./
COPY --from=build-image /app/node_modules  ./

ENTRYPOINT ["node", "consoleSearch.js"]
