FROM node:16

ENV DEBUG False

ENV TZ Asia/Kolkata

EXPOSE 3000

WORKDIR /code

COPY . /code

ENV NODE_ENV=development
#ENV NODE_ENV=production
RUN npm install
RUN npm install redux-devtools-extension
RUN npm start
#RUN npm install --only=production
#RUN echo NO_PROBLEM_YET
#ENV NODE_ENV=production
#RUN npm audit fix --verbose
#RUN npm run build --verbose
#RUN npm install -g serve
#--verbose

#RUN npm ci --only=production
#RUN npm i -g pm2

#CMD [ "node", "server.js" ]
#RUN pm2 --name daksh_frontend start npm -- start /code/src/index.js
