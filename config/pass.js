var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  	,bcrypt = require('bcrypt-nodejs')
	,SALT_WORK_FACTOR = 10 
  , db = require('./dbschema')
  , expirationHours = 2;

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
                         //user.update({APItoken: hash,tokenTime: Date.now});
                         user.APItoken = hash;
                         user.tokenTime = Date.now();
                         
          user.save( function(err) {
                        if(err) {
                    console.log('Error: ' + err);
                    return done(false);
                    } else {
                        console.log('saved new token');
                        return done(null, user);
                    }
                }); 
			
		});
	});
        
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
      var expiration = user.tokenTime; 
       expiration.setHours( user.tokenTime.getHours()+expirationHours)
      console.log("Comparing expiration of " + expiration + " to now of " +Date.now());
      if(expiration >= Date.now() )
      {
            return done(null, user, { scope: 'all' });
      }
      else 
      {
          console.log("Token was expired");
            return done("Token was expired", false);
      }
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

exports.token = function (req, res, next) {
  //res.json(req.user.APItoken);
  var userblurb = req.body;
  //console.log(userblurb);
   var username = userblurb.username;
   //console.log('user is ' +username);
   var password = userblurb.password;
   //console.log('password is ' + password);
  db.userModel.findOne({ username: username }, function(err, user) {
    if (err) { res.send(err);
    return next(err);}
    if (!user) { res.send( 'Unknown user ' + username ); 
    return next('Unknown user ' + username);}
    user.comparePassword(password, function(err, isMatch) {
      if (err) {res.send(err)
      return next(err)};
      if(isMatch) {
          
          bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) {res.send(err);
               return next(err) }
                console.log('hashing token');
                	bcrypt.hash(Date.now, salt, null ,function(err, hash) {
			if(err) {res.send(err);
                        return next(err)}
                         //user.update({APItoken: hash,tokenTime: Date.now});

                         user.APItoken = hash;
                         user.tokenTime = Date.now();
                         var APItoken = {
                             "APItoken":user.APItoken,
                             "tokenTime":user.tokenTime
                         }
          user.save( function(err) {
                        if(err) {
                    console.log('Error saving user token: ' + err);
                    res.send(err);
                    return next(err);
                    } else {
                        console.log('saved new token');
                       
                        res.send(APItoken);
                    }
                }); 
			
		});
	});
        
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });

};


