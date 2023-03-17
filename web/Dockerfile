FROM node:16 as build-stage
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
# ARG REACT_APP_API_BASE_URL
# ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Stage 2
FROM nginx:1.21
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx-proxy.conf /etc/nginx/conf.d/default.conf
# EXPOSE $REACT_DOCKER_PORT

CMD nginx -g 'daemon off;'