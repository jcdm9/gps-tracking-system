FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV TZ="Asia/Manila"

EXPOSE 3009

CMD [ "npm", "run", "dev" ]
