
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.helloworld = function(req, res){
  res.render('helloworld', { title: 'Hello, World!' });
};
exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "userlist" : docs
            });
        });
    };
};
exports.newuser = function(req, res){
  res.render('newuser', { title: 'Add New User' });
};

exports.checkuser = function(req, res){
  res.render('checkuser', { title: 'Check User Password' });
};
exports.adduser = function(db) {
    return function(req, res) {

        // Get our form values. These rely on the "name" attributes
        var userName = req.body.username;
        var userEmail = req.body.useremail;
        var userPassword = req.body.userpassword;
        console.log("password passed in was " + userPassword);
        
        //hash that password
        var bcrypt = require('bcrypt-nodejs');
        // Generate a salt
        var salt = bcrypt.genSaltSync(10);
        // Hash the password with the salt
        var hash = bcrypt.hashSync(userPassword, salt);
        
        // Set our collection
        var collection = db.get('usercollection');
        console.log("Userhash was " + hash);
        // Submit to the DB
        collection.insert({
            "username" : userName,
            "email" : userEmail,
            "passhash" :hash
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                res.location("userlist");
                // And forward to success page
                res.redirect("userlist");
            }
        });

    };
};
exports.verifyuser = function(db) {
    return function(req, res) {

        // Get our form values. These rely on the "name" attributes
        var userName = req.body.username;
        var userPassword = req.body.userpassword;
        //console.log("user passed in was " + userName);
        //console.log("password passed in was " + userPassword);
        
        //get the user
         var collection = db.get('usercollection');
         collection.findOne({username:userName}, function(e,doc){
           //console.log("user pulled back was " + doc.username);
           //console.log("hash pulled back was " + doc.passhash);
           var bcrypt = require('bcrypt-nodejs');
           if(bcrypt.compareSync(userPassword, doc.passhash))
           {
               res.send("That was the correct password :D");
               //console.log("The compareSync function returned true");
           }
           else if(!bcrypt.compareSync(userPassword, doc.passhash))
           {
               res.send("WHO YOU IS AMS!? >:C");
               //console.log("The compareSync function did not return true");
           };
       });

    };
};