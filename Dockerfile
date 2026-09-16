# --- Étape 1 : compiler l'application Angular ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# --- Étape 2 : servir les fichiers statiques avec nginx ---
FROM nginx:alpine
COPY --from=build /app/dist/projetTD/browser /usr/share/nginx/html
EXPOSE 80