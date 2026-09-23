# Stage 1: Build Vue 3 app
FROM node:22-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Argumento para la URL del backend en tiempo de compilación (Coolify Build Argument)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

