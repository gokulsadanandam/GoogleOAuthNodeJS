var passport = require('passport'),
    strategy = require('passport-strategy'),
    googleStrategy = require('passport-google-oauth20').Strategy,
    User = require('../model/user')

passport.serializeUser((user,cb)=>{
	cb(null,user.id)
})

passport.deserializeUser((id,cb)=>{
	User.findById(id).then((user)=>{
		cb(null,user)
	})
})

passport.use(new googleStrategy({
    clientID: '814834987599-brlil96uegtl63a95jfpu3c3gdtiinja.apps.googleusercontent.com',
    clientSecret: 'qwlrQc74sb4ffAR0hzaHqLPM',
    callbackURL: 'http://localhost:3000/auth/googlecallback'
}, async(accessToken, refreshToken, profile, cb) => {

    const ExistingUser = await User.findOne({
        "userID": profile.id
    })

    if (ExistingUser) {
        return cb(null, ExistingUser)
    }
    const NewUser = new User() 
    	  NewUser.userID = profile.id
    const newuser = NewUser.save()

    cb(null,newuser)
}))
