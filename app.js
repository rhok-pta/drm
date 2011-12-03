var express = require('express');

var database = require('./database.js');

// Configuration
var config = {port: process.env.PORT || 8080};

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
	database.DonationRequest.find({}, function(err, requests) {
		res.render("requests", {requests: requests});
	});
});

app.get('/requests/:id', function(req, res) {
	database.DonationRequest.findOne({_id: req.params.id}, function(err, request) {
		res.render("request", {request: request});
	});
});

app.get('/donors', function(req, res) {
	database.Donor.find({}, function(err, donors) {
		res.render("donors", {donors: donors});
	});
});

app.get('/donors/:id', function(req, res) {
	database.Donor.findOne({_id: req.params.id}, function(err, donor) {
		res.render("donor", {donor: donor});
	});
});

app.get('/groups', function(req, res) {
	database.Group.find({}, function(err, groups) {
		res.render("groups", {groups: groups});
	});
});

app.get('/groups/:id', function(req, res) {
	database.Group.findOne({_id: req.params.id}).populate('user').run(function(err, group) {
		res.render("group", {group: group});
	});
});

app.get('/settings', function(req, res) {
	res.render("settings");
});

console.log("Running on port: " + config.port);
app.listen(config.port);
