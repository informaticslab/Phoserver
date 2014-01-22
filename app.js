
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//added security goodness
passport = require("passport");
LocalStrategy = require('passport-local').Strategy;

// New Code, added by ME :D :D happy...
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/test-photon-admin');



var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({ secret: 'SECRET' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//added forsecurity environment'
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//Fun added code by ME :D
app.get('/helloworld', routes.helloworld);
app.get('/userlist', routes.userlist(db));
app.get('/newuser', routes.newuser);
app.get('/checkuser', routes.checkuser);
app.post('/adduser', routes.adduser(db));
app.post('/verifyuser', routes.verifyuser(db));


passport.use(new LocalStrategy(function(username, password,done){
    var collection = db.get('usercollection');
         collection.findOne({username:username}, function(e,doc){
           if(e) { return done(e); }
        if(!doc){
            return done(null, false, { message: 'Incorrect username.' });
        }
           var bcrypt = require('bcrypt-nodejs');
//           if(bcrypt.compareSync(password, doc.passhash))
//           {
//               res.send("That was the correct password :D");
//               //console.log("The compareSync function returned true");
//           }
//           else if(!bcrypt.compareSync(userPassword, doc.passhash))
//           {
//               res.send("WHO YOU IS AMS!? >:C");
//               //console.log("The compareSync function did not return true");
//           };
           bcrypt.compare(password, doc.passhash, function(err, res) {
               if (err) { return done(err); }
               if (res === true)
               {
                    return done(null, doc);
                }
                done(null, false, { message: 'Incorrect password.' });
    // res === true
     });
         })}));
     //  });
//    db.users.findOne({ username : username},function(err,user){
//        if(err) { return done(err); }
//        if(!user){
//            return done(null, false, { message: 'Incorrect username.' });
//        }
//
//        hash( password, user.salt, function (err, hash) {
//            if (err) { return done(err); }
//            if (hash == user.hash) return done(null, user);
//            done(null, false, { message: 'Incorrect password.' });
//        });
//    });
//}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
