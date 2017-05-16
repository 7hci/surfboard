FROM node:6.10.1

WORKDIR /app

ENV NODE_ENV=development

# Necessary link for Ubuntu NodeJS install
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Install Ruby and SASS
RUN apt-get update && apt-get install -y rubygems
RUN gem install sass

# Install PhantomJS
ENV PHANTOMJS_VERSION=phantomjs-2.1.1-linux-x86_64 
ADD https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 .
RUN tar xvf ${PHANTOMJS_VERSION}.tar.bz2
RUN mv $PHANTOMJS_VERSION/bin/phantomjs /usr/bin/
RUN rm -rf phantom*

# Add project files
ADD . .

# Install dependencies
RUN npm install
RUN npm install -g casperjs

# Build dist
RUN npm run build

EXPOSE 5000

# Unlike RUN, CMD runs only after db service is "healthy"
# so we want to wait to seed the db and start the server until then
CMD npm run seed-db && npm start