FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g next

RUN npm install react-scripts -g

RUN npm install --silent

COPY . .

ENV TZ="Asia/Manila"

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
