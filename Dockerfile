FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install && npm run build

COPY .env ./build

EXPOSE 3333

RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]
