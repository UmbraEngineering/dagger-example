
var dagger     = require('dagger.js');
var models     = dagger.require('models');
var Endpoint   = dagger.require('endpoint');
var HttpError  = dagger.require('http-meta').HttpError;

var Person = models.require('person').model;

var PeopleEndpoint = module.exports = new Endpoint({

	route: '/people',

	// 
	// GET /people/schema
	// 
	"get /schema": function(req) {
		req.send(200, Person.schemaDescription());
	},

	// 
	// GET /people
	// 
	"get": function(req) {
		Person.findByQuery(req.query)
			.then(
				function(docs) {
					// 
					// NOTE: Authorization should occur here
					// 

					req.send(200, docs.map(Person.serialize));
				},
				HttpError.catch(req)
			);
	},

	// 
	// GET /people/:id
	// 
	"get /:id": function(req) {
		Person.findById(req.params.id).exec()
			.then(
				function(doc) {
					if (! doc) {
						return (new HttpError(404, 'Document not found')).send(req);
					}

					// 
					// NOTE: Authorization should occur here
					// 

					req.send(200, Person.serialize(doc));
				},
				HttpError.catch(req)
			);
	},

	// 
	// POST /people
	// 
	"post": function(req) {
		// 
		// NOTE: Authorization should occur here
		// 

		Person.create(req.body)
			.then(
				function(doc) {
					req.send(200, Person.serialize(doc));
				},
				HttpError.catch(req)
			);
	},

	// 
	// PUT/PATCH /people
	// 
	"put|patch": function(req) {
		var objs = req.body;

		if (! Array.isArray(objs)) {
			return (new HttpError(400, 'Expected an array of objects to update in the body')).send(req);
		}

		// Get only the doc ids
		var ids = objs.map(function(obj) {
			return obj._id;
		});

		// Fetch all of the needed docs
		Person.find({ _id: {$in: ids} }).exec()
			.then(function(docs) {
				if (! docs || docs.length < objs.length) {
					throw new HttpError(404, 'Some documents could not be found');
				}

				// 
				// NOTE: Authorization should occur here
				// 

				objs.forEach(function(obj) {
					var doc = docs.find(function(doc) {
						return doc.id === obj._id;
					});

					doc.set(obj);
				});

				return when.saved(docs);
			})
			.then(
				function(docs) {
					req.send(200, docs.map(Person.serialize));
				},
				HttpError.catch(req)
			);
	},

	// 
	// PUT/PATCH /people/:id
	// 
	"put|patch /:id": function(req) {
		Person.findById(req.params.id).exec()
			.then(function(doc) {
				if (! doc) {
					throw new HttpError(404, 'Document not found');
				}

				// 
				// NOTE: Any kind of authorization should be handled here
				// 

				doc.set(req.body);
				return when.saved(doc);
			})
			.then(
				function(doc) {
					req.send(200, Person.serialize(doc));
				},
				HttpError.catch(req)
			);
	},

	// 
	// DELETE /people
	// 
	"delete": function(req) {
		// 
	},

	// 
	// DELETE /people/:id
	// 
	"delete /:id": function(req) {
		// 
	}

});
