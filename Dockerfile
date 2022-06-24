FROM node:16-alpine as build-stage

LABEL version="1.0"
LABEL description="Authentication_Server - Backend Api"
LABEL maintainer="alexcamposwd@gmail.com"

WORKDIR /usr/src/server

COPY package.json ./
COPY tsconfig.json ./

COPY . ./

RUN ls -a

RUN npm install
RUN npm run build

EXPOSE $SERVER_LOCAL_PORT

CMD [ "npm", "start" ]
