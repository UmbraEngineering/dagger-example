
var app = require('dagger.js').app;

app.models.require('bars');

var ObjectId = app.models.types.ObjectId;

var Foo = app.models.create('foos', {

	public: true,

	schema: {
		value: String,
		bars: [{type: ObjectId, ref: 'bars'}]
	}

});
