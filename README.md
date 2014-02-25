Phoserver
===========

Issue tracker is available: TBD

## Goals


##Requirements
* 

## Roadmap
* Active development

## Contributing
Anyone is encouraged to contribute to the project by [forking](https://help.github.com/articles/fork-a-repo) and submitting a pull request. (If you are new to GitHub, you might start with a [basic tutorial](https://help.github.com/articles/set-up-git).) 

By contributing to this project, you grant a world-wide, royalty-free, perpetual, irrevocable, non-exclusive, transferable license to all users under the terms of the [Apache Software License v2](http://www.apache.org/licenses/LICENSE-2.0.html) or later.

All comments, messages, pull requests, and other submissions received through CDC and PHIResearchLab.org pages including this GitHub page are subject to the Presidential Records Act and may be archived. Learn more http://cdc.gov/privacy

## License

This project constitutes a work of the United States Government and is not subject to domestic copyright protection under 17 USC § 105.

The project utilizes code licensed under the terms of the Apache Software License and therefore is licensed under ASL v2 or later.

This program is free software: you can redistribute it and/or modify it under the terms of the Apache Software License version 2, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Apache Software License for more details.

You should have received a copy of the Apache Software License along with this program. If not, see http://www.apache.org/licenses/LICENSE-2.0.html

## Privacy

This project contains only non-sensitive, publicly available data and information. All material and community participation is covered by the PHIResearchLab.org [Disclaimer](http://www.phiresearchlab.org/index.php?option=com_content&view=article&id=26&Itemid=15) and [Code of Conduct](http://www.phiresearchlab.org/index.php?option=com_content&view=article&id=27&Itemid=19). For more information about CDC's privacy policy, please visit http://www.cdc.gov/privacy.html


###This is a base-level server with simple, session based login that creates tokens that expire for API-level access. 

#### It grew from Jared Hansen's excellent passport-http-bearer example (https://github.com/jaredhanson/passport-http-bearer) and excellent passport-local express3-mongoose-multiple-file examples(https://github.com/jaredhanson/passport-local/tree/master/examples/express3-mongoose-multiple-files)

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
