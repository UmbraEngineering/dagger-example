
var crypto  = require('crypto');
var app     = require('dagger.js').app;

var User = app.models.create('users', {

	schema: {
		name: String,
		email: {type: app.models.types.Email, index: {unique: true}},
		password: {type: String, protected: true},
		passwordSalt: {type: Buffer, protected: true}
	},

	hooks: {
		// 
		// Hash the password if it has been changed
		// 
		'pre::save': function(next) {
			if (! this.isModified('password')) {
				return next();
			}

			hash({ password: this.password }, function(err, password) {
				this.password = password.key;
				this.passwordSalt = password.salt;
				next();
			}.bind(this));
		},

		// 
		// Send an email when new users are created
		// 
		'post::create': function() {
			// 
			// TODO
			//   Actually send email
			// 
			console.log('Send Email');
		}
	},

	methods: {
		// 
		// Tests if the given password matches what's in the database
		// 
		testPassword: function(password, callback) {
			var hashedPassword = this.password;
			hash({password: password, salt: this.passwordSalt}, function(err, key) {
				if (err) {
					return callback(err);
				}

				callback(null, (key === hashedPassword));
			});
		}
	}

});

// -------------------------------------------------------------

// 
// hash(opts, callback)
//   opts: {password, salt, iterations}
//   callback: function(err, {salt, key})
// 
function hash(opts, callback) {
	// If no password was given, generate one at random
	if (! opts.password) {
		return crypto.randomBytes(6, function(err, buf) {
			if (err) {
				return callback(err);
			}
			
			opts.password = buf.toString('base64');
			hash(opts, callback);
		});
	}

	// If no salt was given, generate random salt
	if (! opts.salt) {
		return crypto.randomBytes(64, function(err, buf) {
			if (err) {
				return callback(err);
			}

			opts.salt = buf;
			hash(opts, callback);
		});
	}

	// Do the hashing..
	crypto.pbkdf2(opts.password, opts.salt, 10000, 64, function(err, key) {
		if (err) {
			return callback(err);
		}

		callback(null, {
			key: new Buffer(key).toString('base64'),
			salt: opts.salt
		});
	});
}
