# --------------------------------------------------------------------------------
# BUILD FRONTEND
# --------------------------------------------------------------------------------
FROM node:14.17-alpine AS build-frontend
WORKDIR /app

COPY plantuml-editor-frontend/package.json ./
RUN npm install

COPY plantuml-editor-frontend/src src
COPY plantuml-editor-frontend/angular.json plantuml-editor-frontend/.browserslistrc plantuml-editor-frontend/karma.conf.js plantuml-editor-frontend/tsconfig.app.json plantuml-editor-frontend/tsconfig.json plantuml-editor-frontend/tsconfig.spec.json plantuml-editor-frontend/.editorconfig ./

RUN npm run build-release

# --------------------------------------------------------------------------------
# BUILD BACKEND
# --------------------------------------------------------------------------------
FROM maven:3.8.1-adoptopenjdk-16 AS build-backend

WORKDIR /app
COPY plantuml-editor-backend .
RUN mvn org.apache.maven.plugins:maven-install-plugin:2.3.1:install-file \
	-Dfile=/app/repo/plantuml-1.2021.9-SNAPSHOT.jar -DgroupId=net.sourceforge.plantuml \ 
	-DartifactId=plantuml -Dversion=1.2021.9 \
	-Dpackaging=jar
RUN mvn package spring-boot:repackage

# --------------------------------------------------------------------------------
# DISTRIBUTION
# --------------------------------------------------------------------------------
FROM adoptopenjdk:16-jre-hotspot-focal

RUN apt update && apt install --yes nginx

ADD ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build-frontend /app/dist/plantuml-editor /usr/share/nginx/html
COPY --from=build-backend /app/target/plantuml-editor-backend.jar ./plantuml-editor-backend.jar

EXPOSE 80

CMD ["sh","-c","nginx && java -jar plantuml-editor-backend.jar"]
