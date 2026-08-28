# =========================
# ESTÁGIO DE BUILD
# =========================
FROM eclipse-temurin:25-jdk-alpine AS build

WORKDIR /app

# Copia o projeto
COPY . .

# Permissão e compilação do projeto
RUN chmod +x mvnw && ./mvnw clean package -DskipTests && mv target/*.war target/app.war

# =========================
# ESTÁGIO DE EXECUÇÃO
# =========================
FROM eclipse-temurin:25-jdk-alpine

WORKDIR /app

# Copia o WAR gerado ignorando o arquivo .original
COPY --from=build /app/target/app.war app.war

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.war"]