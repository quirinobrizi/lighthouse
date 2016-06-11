FROM node:argon
MAINTAINER Quirino Brizi <quirino.brizi@gmail.com>

RUN mkdir -p /usr/src/lighthouse
WORKDIR /usr/src/lighthouse

COPY package.json /usr/src/lighthouse/
RUN npm install

COPY . /usr/src/lighthouse

EXPOSE 3000
ENV REGISTRY_URL "http://localhost:5000/"

CMD [ "npm", "start" ]