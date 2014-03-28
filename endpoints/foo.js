
var dagger     = require('dagger.js');
var Endpoint   = dagger.require('endpoint');
var HttpError  = dagger.require('http-meta').HttpError;

var FooEndpoint = module.exports = new Endpoint({

	route: '/foo',

	// 
	// GET /foo
	// 
	"get": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	},

	// 
	// POST /foo
	// 
	"post": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	},

	// 
	// PUT/PATCH /foo
	// 
	"put|patch": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	},

	// 
	// DELETE /foo
	// 
	"delete": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	}

});
