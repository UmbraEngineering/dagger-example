
// Define a global ROOT directory override
global.ROOT = __dirname + '/..';

var conf        = require('dagger.js/lib/conf');
var connection  = require('dagger.js/lib/mongoose').connection;

var Role = exports.Role = connection.model('role', {name: String, perms: { }});

Role.findOrCreate = function(name, perms, callback) {
	Role.findOne({ name: name }, function(err, role) {
		var action = 'updated';
		if (! role) {
			role = new Role({ name: name });
			action = 'created';
		}

		role.perms = perms;
		role.save(function() {
			console.log('Role "' + name + '" ' + action);
			callback();
		});
	});
};

Role.defineRoles = function(roles, callback) {
	var running = 0;
	var checkIfDone = function() { };

	Object.keys(roles).forEach(function(name) {
		var perms = roles[name];
		
		running++;
		Role.findOrCreate(name, perms, function() {
			running--;
			checkIfDone();
		});
	});

	checkIfDone = function() {
		if (! running) {
			connection.close();
			console.log('Done building roles.')
		}
	}
};
