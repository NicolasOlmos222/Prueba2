FROM node:22-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

ENV PORT=3000

CMD ["node", "index.js"]

