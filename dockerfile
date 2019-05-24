FROM justadudewhohacks/opencv-nodejs
RUN mkdir /temp && mkdir /app
WORKDIR /temp
COPY package.json .
RUN npm i && mv node_modules /app/. 
WORKDIR /app
RUN npm link opencv4nodejs 
COPY . .
RUN npm i -d
CMD ["node", "index.js"]