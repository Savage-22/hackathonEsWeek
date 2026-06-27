# Frontend AgroGuardian — build de Vite servido por nginx (puerto 3000)

# --- Etapa de build ---
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL se hornea en build. Vacío = mismo origen (rutas relativas /api y /uploads),
# así sirve igual sobre http (antes del cert) y https (después de certbot).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Etapa de runtime ---
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
