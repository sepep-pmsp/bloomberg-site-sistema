FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apk add \
    python3 \
    py3-pip \
    gdal-dev \
    g++ \
    python3-dev \
    build-base \
    bash

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
