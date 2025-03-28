FROM node:20 as build

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build-production

FROM nginx:alpine

COPY --from=build /app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/tso /usr/share/nginx/html/netbase

# Expose the default nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]