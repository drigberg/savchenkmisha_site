FROM node:latest

WORKDIR /app

COPY ./package.json package.json
COPY ./ui/package.json ui/package.json
COPY ./.env .env

RUN npm install

EXPOSE 5000
EXPOSE 6379

CMD ["npm", "run", "start:dev"]
