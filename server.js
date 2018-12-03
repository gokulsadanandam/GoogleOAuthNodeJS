var express = require('express'),
	app = express(),
	passport = require('passport'),
	mongoose = require('mongoose'),
    cookieSession = require('cookie-session'),
    Oauth = require('./Config/Passport-GAuth');

mongoose.connect('mongodb://localhost:27017/GAuth',()=>{
	console.log(mongoose.connection.readyState)
})

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["LifeisAwesome!"]
  })
);

app.use(passport.initialize())
app.use(passport.session())

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