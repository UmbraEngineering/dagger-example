
var app   = require('dagger.js').app;
var role  = app.models.require('role')();

app.models.create('user', {

	schema: {
		name: String,
		email: app.Model.Types.Email,
		password: {type: String, protected: true},
		role: {type: app.models.types.ObjectId, $ref: 'role'},
		permChanges: [String]
	}

});
