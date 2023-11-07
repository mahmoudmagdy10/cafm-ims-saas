
FROM node:16.16.0 as build
WORKDIR /usr/local/app
COPY ./ /usr/local/app/
RUN npm install
RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/app/dist/demo1 /usr/share/nginx/html
EXPOSE 80
