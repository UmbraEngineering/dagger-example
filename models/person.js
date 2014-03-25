
var models = require('dagger.js').require('models');

// 
// Define the Person schema
// 
// There is no need to create the actual model here (eg. `mongoose.model('Person', PersonSchema)`)
// as that is handled automatically by dagger's model module.
// 
var PersonSchema = module.exports = new models.Schema({
	field: {type: String}
});
