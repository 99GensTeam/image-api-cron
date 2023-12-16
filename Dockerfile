FROM node:18-alpine

# set the working directory
WORKDIR /app

# copy package files
COPY package.json ./
#COPY package-lock.json ./

# install dependencies
RUN npm install

# copy everything to /app directory
COPY . .

RUN cp .env.dev .env

RUN npm run build
#Expose Port
EXPOSE 3000

# run the app
CMD ["node", "dist/app.js"]