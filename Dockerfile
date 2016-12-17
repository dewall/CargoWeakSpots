FROM node:argon
MAINTAINER dewall <a.dewall@52north.org>


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install -g bower
RUN npm install

COPY bower.json /usr/src/app/
RUN bower install --allow-root

COPY . /usr/src/app
EXPOSE 3000

CMD ["npm", "start"]
