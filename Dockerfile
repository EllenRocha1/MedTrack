# Estágio 1: Build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline  # cacheia deps separado do build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Estágio 2: Run (Produção)
# FROM eclipse-temurin:21-jre-alpine
# WORKDIR /app
# COPY --from=build /app/target/*.jar app.jar
# ENTRYPOINT ["java", "-jar", "app.jar"]

# Estágio 2 Run (Desenvolvimento)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY . .
RUN apk add --no-cache dos2unix && \
    dos2unix mvnw && \
    chmod +x mvnw
ENTRYPOINT ["./mvnw", "spring-boot:run"]