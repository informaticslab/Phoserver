var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  	,bcrypt = require('bcrypt-nodejs')
	,SALT_WORK_FACTOR = 10
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
          bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);
                console.log('hashing token');
		bcrypt.hash(Date.now, salt, null ,function(err, hash) {
			if(err) return next(err);
                         user.update({APItoken: hash,tokenTime: Date.now});
          user.save( function(err) {
                        if(err) {
                    console.log('Error: ' + err);
                    return done(false);
                    } else {
                        console.log('updated APItoken');
                        return done(null, user);
                    }
                }); 
			
		});
	});
         
//          db.tokenModel.findOne({username:username}, function(err, token){ 
//              if(err) {return done(err);}
//              if(!token) {
//                                var newtoken = new db.tokenModel({ username: username		    
//                                            ,token: Date.now});
//                  newtoken.save(function(err) {
//                        if(err) {
//                    console.log('Error: ' + err);
//                    return done(false);
//                    } else {
//                        console.log('saved new token: ' + newtoken.username);
//                        //done();
//                    }
//                }); 
//              }
//              else{
//              token.update({token: Date.now,
//                            createdon: Date.now});
//              token.save(function(err) {
//                        if(err) {
//                    console.log('Error: ' + err);
//                    return done(false);
//                    } else {
//                        console.log('updated token: ' + token.username);
//                        //done();
//                    }
//                }); 
//            }
//              
//                         
//        });
       // return done(null, user);
        
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

//route for bearerstratege
passport.use(new BearerStrategy(
  function(token, done) {
       console.log("Authenticating bearer with APItoken: "+token)
    db.userModel.findOne({ APItoken: token }, function (err, user) {
       
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  }
));

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



