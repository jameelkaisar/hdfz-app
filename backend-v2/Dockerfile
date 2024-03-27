FROM maven:3.9.5-eclipse-temurin-17-alpine AS builder

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:resolve dependency:resolve-plugins

COPY src src

# Add -DskipTests to Skip Downloading Dynamic Dependencies like surefire
RUN mvn clean package

FROM openjdk:17-alpine

WORKDIR /app

COPY --from=builder /app/target/hdfz-0.0.1.jar /app/app.jar

ENTRYPOINT ["java","-jar","app.jar"]
