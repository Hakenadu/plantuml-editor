### STAGE 1: Build ###
FROM node:14.17-alpine AS build
ARG BUILD_TYPE=build-release
WORKDIR /app

COPY package.json ./
RUN npm install

COPY src src
COPY angular.json .browserslistrc karma.conf.js tsconfig.app.json tsconfig.json tsconfig.spec.json .editorconfig ./

RUN npm run $BUILD_TYPE

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /app/dist/plantuml-editor /usr/share/nginx/html
ADD ./misc/default.conf /etc/nginx/conf.d/default.conf
