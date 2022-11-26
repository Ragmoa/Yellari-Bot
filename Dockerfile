FROM node:16

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY src /app/src

RUN npm i

RUN useradd -u 8877 bot
USER bot

CMD ["node", "."]