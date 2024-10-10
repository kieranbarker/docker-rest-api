# Sets the base image to start from, Node v20 in this case.
FROM node:20-alpine

# Sets the working directory inside the image's filesystem.
WORKDIR /home/node/rest-api

# Copies the package.json and package-lock.json files to the image's filesystem.
COPY package*.json .

# Installs the dependencies from the package files.
RUN npm install

# Copy everything else over, e.g. app.js.
COPY . .

# Explains which port we're using.
EXPOSE 3000

# The default command to use when somebody runs the container.
CMD [ "node", "app.js" ]
