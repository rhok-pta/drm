var express = require('express');
var MemoryStore = express.session.MemoryStore;

var database = require('./database.js');

// Configuration
var config = {port: process.env.PORT || 8080};

//
var app = express.createServer();
app.configure(function(){
  app.set('view engine', 'jade'); 
  app.use(express.logger(':method :url :status'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.query());
  app.use(express.favicon());
  app.use(express.static(__dirname + '/public', {maxAge: 3600000}));
  app.use(express.session({
      store: new MemoryStore({
          maxAge: 24 * 60 * 60 * 1000
      }),
    secret: "asdsa"
 }));
  app.use(app.router, database);  
  
  app.use(function (req, res) {
    res.render("404", {currentCategory: "none"});
  });
});

var controllers = require('./controllers.js');
controllers.addControllers(app);

console.log("Running on port: " + config.port);
app.listen(config.port);
