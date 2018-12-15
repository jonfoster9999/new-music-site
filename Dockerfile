FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
run npm install
COPY . .
run npm run build

FROM nginx
COPY --from=builder /app/dist/music-site /usr/share/nginx/html
