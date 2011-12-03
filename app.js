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
	app.use(express.session({
    	store: new MongooseStore({
      		maxAge: 24 * 60 * 60 * 1000
    })
  }))
	app.use(app.router, database);
});

var routes = require('./routes.js').addRoutes(app);

console.log("Running on port: " + config.port);
app.listen(config.port);
