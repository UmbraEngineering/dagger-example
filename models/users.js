
var oath    = require('oath');
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

			User.hashPassword({ password: this.password }).then(
				function(password) {
					this.password = password.key;
					this.passwordSalt = password.salt;
					next();
				}.bind(this),
				next);
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
		testPassword: function(password, promise) {
			promise = promise || new oath();

			var hashedPassword = this.password;

			User.hashPassword({ password: password, salt: this.passwordSalt }).then(
				function(key) {
					promise.resolve(key === hashedPassword);
				},
				promise.reject);

			return promise.promise;
		}
	},

	// 
	// User.hashPassword({password, salt, iterations}).then(function({salt, key}))
	// 
	hashPassword: function(opts, promise) {
		promise = promise || new oath();

		// If no password was given, generate one at random
		if (! opts.password) {
			crypto.randomBytes(6, function(err, buf) {
				if (err) {
					return oath.reject(err);
				}
				
				opts.password = buf.toString('base64');
				User.hashPassword(opts, promise);
			});
			return promise.promise;
		}

		// If no salt was given, generate random salt
		if (! opts.salt) {
			crypto.randomBytes(64, function(err, buf) {
				if (err) {
					return oath.reject(err);
				}

				opts.salt = buf;
				User.hashPassword(opts, promise);
			});
			return promise.promise;
		}

		// Do the hashing..
		crypto.pbkdf2(opts.password, opts.salt, 10000, 64, function(err, key) {
			if (err) {
				return oath.reject(err);
			}

			promise.resolve({
				key: new Buffer(key).toString('base64'),
				salt: opts.salt
			});
		});

		return promise.promise;
	}

});
