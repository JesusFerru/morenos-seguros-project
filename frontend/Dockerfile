FROM node:20 as build
WORKDIR /app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Copiar el resto del código y compilar en modo producción
COPY . .
RUN npm run build-production

# Etapa Nginx para servir los archivos estáticos
FROM nginx:alpine

# Configuración SPA (Angular router necesita fallback a index.html)
COPY --from=build /app/default.conf.template /etc/nginx/templates/default.conf.template

# Copiar el build Angular directo a la raíz del servidor web
COPY --from=build /app/dist/moreno-seguros /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
