var express = require('express'),
	app = express(),
	passport = require('passport'),
	mongoose = require('mongoose'),
    cookieSession = require('cookie-session'),
    FbAuth = require('./Config/Passport-FAuth'),
    Oauth = require('./Config/Passport-GAuth'),
    https = require('https');

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

app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/Views/index.html')
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/facebook',
	passport.authenticate('facebook'))

app.get('/auth/googlecallback',passport.authenticate('google'),
	(req,res)=>{
		res.redirect('/currentuser')
	})

app.get('/auth/facebookcallback',passport.authenticate('facebook'),(req,res)=>{
	res.redirect('/currentuser')
})

app.get('/success',(req,res)=>{
	res.send(req.user)
})

app.get("/logout",(req,res)=>{
	req.logout()
	res.redirect('/')
})

app.get("/currentuser",(req,res)=>{
	console.log(req.user)
	res.send(req.user)
})

server = https.createServer(app)

server.listen(8443)