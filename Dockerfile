# Set the base image to Ubuntu
FROM ubuntu

# File Author / Maintainer
MAINTAINER OmgImAlexis

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install apt-get dependencies
RUN apt-get update && apt-get -y install python build-essential wget

RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
ENV SHIPPABLE_NODE_VERSION=v5
RUN . $HOME/.nvm/nvm.sh && nvm install $SHIPPABLE_NODE_VERSION && nvm alias default $SHIPPABLE_NODE_VERSION && nvm use default \
    && npm install -g nodemon

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN . $HOME/.nvm/nvm.sh && nvm alias default $SHIPPABLE_NODE_VERSION && nvm use default \
    && cd /tmp && npm install bcrypt && npm install --production
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE 3000

# Run app using nodemon
CMD ['nodemon', '/src/app.js']
