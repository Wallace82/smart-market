FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/client-service-0.1.0-SNAPSHOT.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","/app/app.jar"]
