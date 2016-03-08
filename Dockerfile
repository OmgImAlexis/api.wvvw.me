# Set the base image to Ubuntu
FROM ubuntu

# File Author / Maintainer
MAINTAINER OmgImAlexis

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install Node.js and other dependencies
RUN apt-get update \
    && apt-get -y install python build-essential wget \
    && wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install 5 \
    && nvm alias default 5 \
    && nvm use default

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
