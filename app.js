var express = require('express');

var database = require('./database.js');

// Configuration
var config = {port: 8080};

//
var app = express.createServer();
app.configure(function(){
	app.set('view engine', 'jade');
	
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.query());
	app.use(express.static(__dirname + '/public', {maxAge: 3600000}));
	app.use(app.router);
});

// Routing
app.get('/', function(req, res) {
	res.render("index");
});

app.get('/requests', function(req, res) {
	res.render("requests");
});

app.get('/donors', function(req, res) {
	database.Donor.find({}, function(err, donors) {
		res.render("donors", {donors: donors});
	});
});

app.get('/groups', function(req, res) {
	res.render("groups");
});

app.get('/settings', function(req, res) {
	res.render("settings");
});

console.log("Running on port: " + config.port);
app.listen(config.port);
