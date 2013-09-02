
var app = require('dagger.js').app;

var Foo = app.models.create('foos', {

	schema: {
		value: String
	}

});
