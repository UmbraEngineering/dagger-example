
var app = require('dagger.js').app;

app.models.create('users', {

	schema: {
		name: String,
		email: app.models.types.Email,
		password: {type: String, select: false}
	}

});
