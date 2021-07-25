FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --unsafe-perm

COPY . .

EXPOSE 3002
CMD ["node", "server.js"]
