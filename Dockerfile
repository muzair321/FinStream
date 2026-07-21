FROM eclipse-temurin:26-jre-jammy

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/server/target/*.jar app.jar
COPY etl-python/ ./etl-python/

RUN pip3 install -r etl-python/requirements.txt

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]