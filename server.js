var express = require('express'),
	app = express(),
	passport = require('passport'),
	strategy = require('passport-strategy'),
	GoogleStrategy = require('passport-google-oauth20').Strategy,
	mongoose = require('mongoose'),
    cookieSession = require('cookie-session');

mongoose.connect('mongodb://localhost:27017/GAuth')

var User = new mongoose.Schema({
	'userID':String
})

const user = mongoose.model('Users',User)



app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["test"]
  })
);

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id,cb) => {
  user.findById(id).then(user => {
    cb(null, user);
  });
});





passport.use(new GoogleStrategy({
	clientID:'814834987599-brlil96uegtl63a95jfpu3c3gdtiinja.apps.googleusercontent.com',
	clientSecret:'qwlrQc74sb4ffAR0hzaHqLPM',
	callbackURL:'http://localhost:3000/auth/googlecallback'
}, async (accessToken,refreshToken,profile,cb)=>{

	const existingUser = await user.findOne({'userID':profile.id})

	if(existingUser){
		return cb(null,existingUser)
	}
	const newUser = new user()
		  newUser.userID = profile.id
	const newuser = await newUser.save()
	cb(null,newuser)

}))

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/googlecallback',passport.authenticate('google',{failureredirect:"/failed"}),
	(req,res)=>{
	console.log(req.user)
		res.redirect('/success')
	})

app.get('/failed',(req,res)=>{
	res.send("failed")
})

app.get('/success',(req,res)=>{
	res.send("success")
})

app.get("/logout",(req,res)=>{
	req.logout()
	res.redirect('/')
})

app.get("/currentuser",(req,res)=>{
	res.send(req.user)
})

app.listen(3000)