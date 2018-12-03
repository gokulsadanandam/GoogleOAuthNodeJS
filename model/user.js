var mongoose = require('mongoose')

const schema = new mongoose.Schema({
	'userID':String
})

const user = mongoose.model('Users',schema)


module.exports =  user 