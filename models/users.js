
var oath    = require('oath');
var crypto  = require('crypto');
var app     = require('dagger.js').app;

var Email     = app.models.types.Email;
var ObjectId  = app.models.types.ObjectId;

var AuthEntity; app.models.require('auth-entities').resolve(function(Model) {
	AuthEntity = Model;
});

var User = app.models.create('users', {

	public: {create: true},

	schema: {
		name: String,
		email: {type: Email, index: {unique: true}},

		// Authentication related fields
		password: {type: String, protected: true},
		passwordSalt: {type: Buffer, protected: true, readonly: true},

		// This field is required for auth to work
		auth: {type: ObjectId, ref: 'auth-entities', readonly: true, populate: true}
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
		// When we create a new user, we have to create an AuthEntity to store
		// its permissions. This is required to use the built-in auth system
		// 
		'pre::create': function(next) {
			var self = this;
			var entity = new AuthEntity({
				perms: {
					users: {
						read: true,
						update: 'ifOwn',
						delete: 'ifOwn'
					}
				}
			});

			entity.save(function(err, entity) {
				if (err) {
					return next(err);
				}

				self.auth = entity;
				next();
			});
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
					promise.resolve(key.key === hashedPassword);
				},
				promise.reject);

			return promise.promise || promise;
		},

		// 
		// Determines if the user referred to in the given request object is this one
		// 
		ifOwn: function(req) {
			var id = req.params.usersId;
			return id === this._id;
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
			return promise.promise || promise;
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
			return promise.promise || promise;
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

		return promise.promise || promise;
	}

});
