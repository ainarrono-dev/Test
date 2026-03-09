# ─────────────────────────────────────────────────────────────
# Stage 1 : Build Angular avec Node
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copier package*.json d'abord pour profiter du cache npm install
COPY package*.json ./
RUN npm ci --prefer-offline --quiet

# Copier le reste et builder en mode production
COPY . .
RUN npm run build -- --configuration production

# ─────────────────────────────────────────────────────────────
# Stage 2 : Serveur nginx léger
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Copier les fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
