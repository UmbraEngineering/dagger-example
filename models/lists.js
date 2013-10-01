
var app = require('dagger.js').app;

// 
// Shortcuts to type constructors
// 
var ObjectId = app.models.types.ObjectId;

// 
// Load needed models
// 
app.models.require('users');
app.models.require('items');

// 
// Define the List model
// 
var List = app.models.create('lists', {

	schema: {
		owner: {type: ObjectId, ref: 'users'},
		items: [{type: ObjectId, ref: 'items'}]
	},

	hooks: {
		// Always make sure that the owner of the list is the user that created it
		'pre::post': function(req, done) {
			req.body.owner = req.auth.user._id;
			done();
		}
	}

});
