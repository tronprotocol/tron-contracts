FROM circleci/node:9

USER root

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN ls -la /usr/src/app

RUN yarn install

EXPOSE 9090

CMD ["yarn", "test"]