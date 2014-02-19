var express = require('express')
  , app = express()
  , db = require('./config/dbschema')
  , pass = require('./config/pass')
  , passport = require('passport')
  , basic_routes = require('./routes/basic')
  , user_routes = require('./routes/user')
  , article_routes = require('./routes/articles');
  
// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs'); 
  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});

//enable CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
// Basic pages
app.get('/', basic_routes.index);

// User pages

app.get('/account', pass.ensureAuthenticated, user_routes.account);
app.get('/login', user_routes.getlogin);
app.post('/login', user_routes.postlogin);
app.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin(), user_routes.admin);
app.get('/logout', user_routes.logout);

//App pages

app.get('/token', pass.token);
app.get('/foo', 
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json(req.user);
  });
app.get('/articles/:id', article_routes.findById);
app.get('/articles', article_routes.findAll);
app.post('/articles', passport.authenticate('bearer', { session: false }),
  article_routes.addArticle);
app.put('/articles/:id', passport.authenticate('bearer', { session: false }),
  article_routes.updateArticle);
app.delete('/articles/:id', passport.authenticate('bearer', { session: false }),
  article_routes.deleteArticle);

app.listen(3000, function() {
  console.log('Express server listening on port 3000');
});

