# ─────────────────────────────────────────────────────────────
# Stage 1 : Build avec Maven + JDK 21
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers Maven en premier pour bénéficier du cache Docker
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Télécharger les dépendances (couche cachée si pom.xml inchangé)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B -q

# Copier le code source et compiler
COPY src src
RUN ./mvnw package -DskipTests -B -q

# ─────────────────────────────────────────────────────────────
# Stage 2 : Image runtime allégée (JRE 21)
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S logimatch && adduser -S logimatch -G logimatch
USER logimatch

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
