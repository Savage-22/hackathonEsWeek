# Backend AgroGuardian — API Express (ES modules) + bcrypt nativo
FROM node:22-bookworm-slim

# Herramientas para compilar bcrypt si no hay binario precompilado para la plataforma
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Capa de dependencias cacheable
COPY package*.json ./
RUN npm ci --omit=dev

# Código de la app
COPY . .

# Carpeta de subidas (fotos de aplicaciones #16) — se monta como volumen en compose
RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 4001

CMD ["node", "server.js"]
