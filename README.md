###This is the server for Blob the Savior based on the Phoserver project 

#### It will allow users to login, get a token and then access the API to save articles.

config/dbschema.js - mongoose database schema
config/pass.js - contains most of the passport configuration, also contains additional admin middleware function and token generation during successful authentication.

routes/basic.js - basic routes paths
routes/user.js - user paths (login, account, etc)

/foo?access_token?[token] will allow a return on access token.  Modify or copy the foo route for your API as needed.

app.js - main server code

#### 2. Updated package.json file
You can now run npm install without fear and you won't run into ejs errors when rendering layouts.  The layout was changed to a header and a footer.

#### 3. Added check for admin
You can check roles or for admin by modifying the ensureAdmin method in config/pass.js to ensureRole('admin').  Simply add it as an additional middleware as shown in the '/admin' path in app.js

#### 4. You will need to install grunt to seed and drop the database.  

http://gruntjs.com/

```
npm install -g grunt-cli
```

You will then be able to run 

```
grunt --version
grunt --help
```

You can seed and drop the database with a grunt task by running the following commands from the root directory of the node app in terminal.

```
grunt dbseed
grunt dbdrop
```
