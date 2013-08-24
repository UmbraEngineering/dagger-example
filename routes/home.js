
var app        = require('dagger.js').app;
var templates  = app.templates;

app.Resource.create('home', {

	route: '/',
	parent: null,

	get: function(req) {
		req.contentType('text/html');
		req.send(200, templates.render('pages/home'));
	}

});
