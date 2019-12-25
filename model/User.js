const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
	email:{
		type: String,
		require: true,
		min: 6
	},

	password:{
		type: String,
		require: true,
		min: 6
	},
	created_at:{
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userScheme)
