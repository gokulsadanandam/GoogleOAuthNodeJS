var passport = require('passport'),
	strategy = require('passport-strategy'),
	facebookAuth = require('passport-facebook').Strategy,
	User = require('../Model/user')

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new facebookAuth({
	clientID:'356860308217736',
	clientSecret:'3616fed5633c096d5da5b0625b6ba593',
	callbackURL:'https://localhost:443/auth/facebookcallback'
}, async (accessToken,refreshToken,profile,cb)=>{
 	const existingUser = await User.findOne({'userID':profile.id})

 	if(existingUser){
 		return (null,cb)
 	}

 	let newUser = new User({'userID':profile.id})
 	const newuser = await newUser.save()
 	cb(null,newuser)



}))