# Set the base image to Ubuntu
FROM ubuntu

# File Author / Maintainer
MAINTAINER OmgImAlexis

# Install Node.js and other dependencies
RUN apt-get update && \
    apt-get -y install python build-essential && \
    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash

# Install nodemon
RUN npm install -g nodemon

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install bcrypt && npm install --production
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE 3000

# Run app using nodemon
CMD ['nodemon', '/src/app.js']
