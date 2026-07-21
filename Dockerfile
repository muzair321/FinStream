# ---- Stage 1: Build the Spring Boot jar ----
FROM eclipse-temurin:26-jdk-jammy AS build

RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY backend/server/pom.xml .
COPY backend/server/src ./src

RUN mvn clean package -DskipTests

# ---- Stage 2: Runtime image ----
FROM eclipse-temurin:26-jre-jammy

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /build/target/*.jar app.jar
COPY etl-python/ ./etl-python/

RUN pip3 install -r etl-python/requirements.txt

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]