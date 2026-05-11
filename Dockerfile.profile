FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -pl ProfileService -am -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /app/ProfileService/target/*.jar app.jar
COPY .env .env
ENTRYPOINT ["java", "-jar", "app.jar"]