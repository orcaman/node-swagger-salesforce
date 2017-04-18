# node-swagger-salesforce

![swagger screenshot](https://s3.amazonaws.com/general-skyline-stuff/swagger.png)

`node-swagger-salesforce` may be used to easily and automatically create a REST API containning CRUD operations covering 
Salesforce entities. The generator connects to your Salesforce instance (for example, your sandbox environment) using credentials supplied as env vars and proceeds to automatically generate an entire swagger project (controllers, configuration, etc.) over an express.js API server. 

You can choose to auto generate controllers for all your Salesforce entities, or you can configure a white or a black list of entities. 

Read more about swagger [here](https://github.com/swagger-api/swagger-node) and [here](http://swagger.io/).

## motivation

- Get swagger goodness over the plain old Salesforce REST API - declarative coding, documentation, API playground, etc.
- Be able to manipulate Salesforce API results using node (express middlewares and more)
- The vanilla Salesforce REST API is designed for client apps, not server integrations (it only offers OAuth authentication). Projects created with `node-swagger-salesforce` may be easily used for server integrations simply by supplying users credentials (no need to work with the OAuth endpoint).
- The result project may be deployed to a PaaS like Heroku with just a few clicks

## usage

1. Install swagger for node

```bash
$ npm install -g swagger
```

2. Get the project and install it's dependancies
```bash
$ git clone https://github.com/skyline-ai/node-swagger-salesforce.git
$ cd node-swagger-salesforce && npm install
```

3. Build the project (this will run the gulpfile)
```bash
$ npm run build
```

4. Set required env vars - credentials for Salesforce (mandatory) and login URL (this value is optional, the value https://test.salesforce.com should be used in order to connect to sandbox envs). see configuration section for more available config options
```bash
# for example: john.doe@example.com
$ export SF_USER=your Salesforce username
$ export SF_PASSWORD=your Salesforce password
# if you don't know what your token is, you can **RESET** it by following this link:
# https://YOUR_SALES_FORCE_DOMAIN/_ui/system/security/ResetApiTokenConfirm?retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DPersonalInfo&setupid=ResetApiToken
$ export SF_TOKEN=your sales force security token
# optional: connect to sandbox env
$ export SF_LOGIN_URL=https://test.salesforce.com
```

5. Finally, generated your swagger project and run it. The project uses es6 syntax and therefore needs to be transpiled in order for node to run it (at the time of this post the latest dev version of node still doesn't support things like es6 `import`). By default, the babel configuration will create an output at `dist` directory. The output is the generator in es5 code that node can run. This is the actual generator code that you need to run in order to create the final swagger project. By default the dist node app will create your new swagger project at the `out` directory under `dist`. 
```bash
$ cd dist && node app.js
$ cd out && npm install
$ swagger project start
```

To edit your swagger project:
```bash
$ swagger project edit
```

## optional: using white-lists or black-lists
If you want the generator to only create controllers for specific entities, use a white list. Configure the location of the list as the env var `SF_WL_PATH`:
```bash
$ export SF_WL_PATH=../lists/wl.txt
```

If you want the generator to dismiss specific entities and create controllers for the rest, use a black list. Configure the location of the list as the env var `SF_BL_PATH`:
```bash
$ export SF_BL_PATH=../lists/bl.txt
```

The list should be a UTF-8 text file where every line contains the name of the entity in lower case. For example, the following list is set to tell the generator to only create a controller for the account entity:
```bash
$ cat lists/wl.txt 
account
```

## TODO
- tests converage
- auto generate tests for the controllers
- work with Salesforce API to extract mandatory fields and make them mandatory in the swagger api level
- add API key style auth by default 
- add Heroku deployment examples