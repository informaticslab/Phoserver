var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  , db = require('./dbschema');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.userModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  db.userModel.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
          db.tokenModel.findOne({username:username}, function(err, token){ 
              if(err) {return done(err);}
              if(!token) {
                                var newtoken = new db.tokenModel({ username: username		    
                                            ,token: Date.now});
                  newtoken.save(function(err) {
                        if(err) {
                    console.log('Error: ' + err);
                    return done(false);
                    } else {
                        console.log('saved new token: ' + newtoken.username);
                        //done();
                    }
                }); 
              }
              else{
              token.update({token: Date.now,
                            createdon: Date.now});
              token.save(function(err) {
                        if(err) {
                    console.log('Error: ' + err);
                    return done(false);
                    } else {
                        console.log('updated token: ' + token.username);
                        //done();
                    }
                }); 
            }
              
                         
        });
        return done(null, user);
        
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
exports.ensureAdmin = function ensureAdmin(req, res, next) {
    return function(req, res, next) {
	console.log(req.user);
        if(req.user && req.user.admin === true)
            next();
        else
            res.send(403);
    }
}

// Use the BearerStrategy within Passport.
//   Strategies in Passport require a `validate` function, which accept
//   credentials (in this case, a token), and invoke a callback with a user
//   object.
passport.use(new BearerStrategy({
  },
  function(token, done) {
    // asynchronous validation, for effect...
    process.nextTick(function () {
      
      // Find the user by token.  If there is no user with the given token, set
      // the user to `false` to indicate failure.  Otherwise, return the
      // authenticated `user`.  Note that in a production-ready application, one
      // would want to validate the token for authenticity.
       
       db.tokenModel.findOne({token:token}, function(err, token){ 
              if(err) {return done(err);}
              if(!token) {
//                                var newtoken = new db.tokenModel({ username: username		    
//                                            ,token: Date.now});
//                  newtoken.save(function(err) {
//                        if(err) {
//                    console.log('Error: ' + err);
//                    return done(false);
                        console.log("Nonexistant token " + token);
                    return done(null, false, { message: 'Nonexistant token.' });
                    } else {
                        db.userModel.findOne({username:token.username}, function(err, user){
                        console.log('saved new token: ' + newtoken.username);
                        if(err) {return done(err);}
                        if(!user){return done(null, false, {message: "Token exists but user doesn't"})}
                        })
                        //done();
                    }
                     return done(null, user);
                }); 
              
       
       
       
       
       
       
      // 
//      findByToken(token, function(err, user) {
//        if (err) { return done(err); }
//        if (!user) { return done(null, false); }
////        return done(null, user);
//      })
    });
  }
));

//function findByToken(token, fn) {
////  for (var i = 0, len = users.length; i < len; i++) {
////    var user = users[i];
////    if (user.token === token) {
////      return fn(null, user);
////    }
////  }
////  return fn(null, null);
//userdb.findOne({ token : token},function(err,user, done){
//    console.log("token was " + token)
//        if(err) { return done(err); }
//        if(!user){
//            return done(null, false, { message: 'Nonexistant token.' });
//        }
//        return user;
//})
//};