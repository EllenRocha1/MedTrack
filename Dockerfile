# Estágio 1: Build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline  # cacheia deps separado do build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Estágio 2: Run (produção ou desenvolvimento via profile)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ARG SPRING_PROFILES_ACTIVE=prod
ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE}
ENV PORT=8081
EXPOSE 8081
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]