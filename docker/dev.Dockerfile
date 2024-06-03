FROM node:20

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node ../ .

RUN npm ci

CMD ["npm", "run", "dev"] 