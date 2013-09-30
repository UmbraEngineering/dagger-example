
var app = require('dagger.js').app;

// 
// Load needed models
// 
var List = app.models.require('lists');

// 
// Define the Item model
// 
var Item = app.models.create('items', {

	schema: {
		value: String,
		completed: {type: Boolean, default: false}
	},

	hooks: {
		// 
		// Make sure to remove the reference to an item in its list on deletion
		// 
		'pre::remove': function(next) {
			var item = this;

			item.findList(function(err, list) {
				if (! list) {
					return next();
				}

				list.items.remove(item._id);
				list.save(function() {
					next();
				});
			});
		}
	},

	methods: {
		// 
		// Find the related list for this item
		// 
		findList: function(callback) {
			return List().findOne()
				.where('items').elemMatch({ _id: item._id })
				.exec(callback);
		}
	}

});
