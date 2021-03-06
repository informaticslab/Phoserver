var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	SALT_WORK_FACTOR = 10;
exports.mongoose = mongoose;

// Database connect
var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/phoserver';

var mongoOptions = { db: { safe: true }};

mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + uristring);
  }
});

//******* Database schema TODO add more validation
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

// User schema
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  admin: { type: Boolean, required: true },
  APItoken: {type:String, required:true, unique:true},
  tokenTime: {type: Date, required: true, default: Date.now}
});


// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null ,function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

// Export user model
var userModel = mongoose.model('User', userSchema);
exports.userModel = userModel;


// Token schema
//
//var tokenSchema = new Schema({
//    username: { type: String, required: true, unique: true },
//    token: { type: String, required: true, unique: true },
//    createdon: { type: Date, required: true, default: Date.now}
//})
//
//// Bcrypt middleware
//tokenSchema.pre('save', function(next) {
//	var tokenRecord = this;
//
//	if(!tokenRecord.isModified('token')) return next();
//
//	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//		if(err) return next(err);
//
//		bcrypt.hash(tokenRecord.token, salt, null ,function(err, hash) {
//			if(err) return next(err);
//			tokenRecord.token = hash;
//			next();
//		});
//	});
//});
//
////Export token model
//var tokenModel = mongoose.model('token', tokenSchema);
//exports.tokenModel = tokenModel;
