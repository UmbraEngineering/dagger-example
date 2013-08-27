
var app = require('dagger.js').app;

var User = app.models.create('users', {

	schema: {
		name: String,
		email: {type: app.models.types.Email, index: {unique: true}},
		password: {type: String, select: false}
	},

	hooks: {
		// Hash the password if it has been changed
		'pre::save': function(next) {
			if (this.isModified('password')) {
				// 
				// TODO
				//   Actually hash passwords
				// 
				this.password = 'hashed:' + this.password;
			}

			next();
		},
		// Send an email when new users are created
		'post::create': function(next) {
			// 
			// TODO
			//   Actually send email
			// 
			console.log('Send Email');

			next();
		}
	}

});
