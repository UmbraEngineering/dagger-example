
var app = require('dagger.js').app;

var Bar = app.models.create('bars', {

	public: true,

	schema: {
		value: String
	}

});
