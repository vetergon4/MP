#lets build server side image
FROM node:14.15.4-alpine3.12
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["npm", "start"]
