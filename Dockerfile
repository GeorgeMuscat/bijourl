FROM node:12.17.0-alpine
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build
## this is stage two , where the app actually runs
FROM node:12.17.0-alpine
WORKDIR /usr
COPY package.json ./
RUN npm install --omit-dev
COPY --from=0 /usr/build .
RUN npm install pm2 -g
EXPOSE 9000
CMD ["pm2-runtime","index.js"]