# --------------------------------------------------------------------------------
# BUILD
# --------------------------------------------------------------------------------
FROM maven:3.8.1-adoptopenjdk-16 AS build

WORKDIR /src
COPY . .
RUN mvn org.apache.maven.plugins:maven-install-plugin:2.3.1:install-file \
	-Dfile=/src/repo/plantuml-1.2021.9-SNAPSHOT.jar -DgroupId=net.sourceforge.plantuml \ 
	-DartifactId=plantuml -Dversion=1.2021.9 \
	-Dpackaging=jar
RUN mvn package spring-boot:repackage

# --------------------------------------------------------------------------------
# DISTRIBUTION
# --------------------------------------------------------------------------------
FROM adoptopenjdk:16-jre-hotspot-focal

RUN adduser --disabled-password --gecos '' plantuml
USER plantuml
WORKDIR /home/plantuml

COPY --from=build /src/target/plantuml-editor-backend.jar ./plantuml-editor-backend.jar

EXPOSE 8080

CMD ["java","-jar", "plantuml-editor-backend.jar"]