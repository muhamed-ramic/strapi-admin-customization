FROM strapi/base
WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install
COPY . .

ENV NODE_ENV production

RUN yarn build
EXPOSE 1337
CMD [ "yarn", "develop" ]
