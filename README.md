# SurfBOARD

SurfBOARD is a Node.js application designed to help automate the on**boarding** process at 7HCI. 

### Architecture
- [Express 4](https://expressjs.com) for serving static content, providing a RESTful API and handling Google OAuth authentication
- [PostgreSQL 9.6](https://www.postgresql.org/docs/9.6) for persisting on-going onboarding information, with Sequelize as ORM
- [Socket.io](https://socket.io/) for bi-directional communication between server and client
- [Nunjucks](https://mozilla.github.io/nunjucks) for HTML templating
- [CasperJS](http://docs.casperjs.org) and [PhantomJS](http://phantomjs.org) for automating web-based onboarding tasks where an API was not available
- [Babel](https://babeljs.io) for transpiling front-end scripts written in ES6 to ES5
- [Bootstrap 4](https://getbootstrap.com) for responsive front-end design and simple styling
- [Browserify](http://browserify.org) for importing modules into front-end scripts
- [Gulp](http://gulpjs.com) for compiling SASS, browserifying and transpiling code and minifying and injecting everything
- [Docker](https://www.docker.com) and [Travis CI](https://travis-ci.org) for easy integration testing and deployment

### Minimum Requirements
- Ubuntu 14.04.5
- Docker 1.12.3
- Docker Compose 1.13.0

### Installation
1. Add a development.js file with all needed information to the config directory (structured like `config/example.js`)
2. Log in to docker with `docker login`
3. Run `docker-compose pull && docker-compose up -d` to build the containers and start the app.

**Note:** The app listens on port 5000. If using docker-compose, an nginx image is included that
will forward requests from port 80.

#### Deploying without Docker
1. Add a development.js file with all needed information to the config directory (structured like `config/example.js`)
2. Install `rubygems` and install SASS with `gem install sass`
3. Install PhantomJS 2.1.1 ([directions](http://phantomjs.org/download.html)) -- do **not** use NPM!
4. Set NODE_ENV to `development` and run `npm install`
5. Install CasperJS globally with `npm install -g casperjs`
6. Run `npm run build` to build the app
7. Install PostgreSQL (minimum 9.5 to support JSONB) and configure `surfboard` user and DB
8. Run `npm run seed-db` to seed the database
9. Start the express server with `npm start`

### Code Style
The code mostly follows the [Airbnb Style Guide](https://github.com/airbnb/javascript) and uses
[eslint](http://eslint.org) for linting. You can use `npm run lint` to lint everything in the
source directory.

### Testing
[Mocha](https://mochajs.org) is used as the testing framework, utilizing
[chai](http://chaijs.com/api/bdd) for assertions. [Proxyquire](https://github.com/thlorenz/proxyquire)
is used to stub dependencies and [nock](https://github.com/node-nock/nock) is used to mock API calls.
[CasperJS](http://docs.casperjs.org) and [PhantomJS](http://phantomjs.org) are used for functional testing.

### Configuration
**config.api**  
*key:* Any calls made to the server's API will need to include this key as a X-Api-Key header.  

**config.db**  
*password:* password for PostgreSQL surfboard user  

**config.google**  
You will need to generate two new projects through the Google Developer Console:
- A regular project with `OAuth client ID` credential configured for `Web Application`. The
Authorized JavaScript origins and Authorized redirect URIs need to match where the project is hosted.
Any Apps Script that is called directly by the app through `script.googleapis.com` will also need
use this as its project (read more [here](https://developers.google.com/apps-script/guides/rest/api)).
- A service account so that calls to the API can access Google API resources without user 
authentication. The service account will need to be added through the Google Admin console before it
can interact with the G Suite account (directions 
[here](https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority)). 
**Note**: As of writing this, service accounts cannot be used with the Execution API.

The JSON configuration files generated when creating these accounts can then be used to populate this
part of the configuration file.  

**config.clicktime**  
Credentials for ClickTime. The user needs to be an admin able to add additional users.  

**config.trello**  
*key:* Trello application key (see [here](https://trello.com/app-key))  
*token:* Get a permanent token via `https://trello.com/1/authorize?key={key}&scope=read%2Cwrite&name=Surfboard&expiration=never&response_type=token`  
*team:* You can populate the ids for the team and its members by making cURL requests to 
the appropriate [API endpoints](https://developers.trello.com/advanced-reference)  

**config.slack**  
*token:* A legacy token that can be obtained [here](https://api.slack.com/custom-integrations/legacy-tokens)  

**config.drive**  
Google Drive ids can be obtained from the resource's URL or by generating a share link.