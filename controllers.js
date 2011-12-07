var fs = require("fs");

var donorAction = require("./controllers/donor.js");
var groupAction = require("./controllers/group.js");
var requestAction = require("./controllers/request.js");
var remarkAction = require("./controllers/remark.js");
var userAction = require("./controllers/user.js");

function identity(req, res, next) {
	next();
}

function andRestrictToUser(req, res, next) {
	return req.session.user == undefined ? res.redirect("/login") : next();
}

function addAction(app, method, path, middleware, func) {
	switch (method) {
		case 'get':
			app.get(path, middleware, func);
			break;
		case 'post':
			app.post(path, middleware, func);
			break;
		default:
			console.log("Unhandled method: " + method);
	}
}

exports.addController = addController = function (app, name, controller) {
	var config;
	if (controller.configuration) {
		config = controller.configuration;
	} else {
		config = {}
	}
	
	if (!config.plural) config.plural = name + 's';
	if (!config.prefix) config.prefix = '/' + config.plural;
	if (!config.authenticate && 
		config.authenticate !== false) config.authenticate = true;
	
	var prefix = config.prefix;
	var middleware = config.authenticate ? andRestrictToUser : identity;
	
	console.log('Adding controller: ' + name + ' (' + prefix + ')');
	
	Object.keys(controller).map(function (action) {
		if (action === 'configuration') return;
	
		console.log(' * Adding action: ' + action);
		var fn = controller[action];
		switch (action) {
			case 'index':
				app.get(prefix, middleware, fn);
				break;
			case 'add':
				app.get(prefix + '/new', middleware, fn);
				break;
			case 'create':
				app.post(prefix + '/new', middleware, fn);
				break;
			case 'show':
				app.get(prefix + '/:id', middleware, fn);
				break;
			case 'edit':
				app.get(prefix + '/:id/edit', middleware, fn);
				break;
			case 'update':
				app.post(prefix + '/:id/edit', middleware, fn);
				break;
			case 'destroy':
				app.post(prefix + '/:id/delete', middleware, fn);
				break;
			default:
				if (config.customActions && config.customActions[action]) {
					var act = config.customActions[action];
					var path = prefix;
					if (act.suffix) path += act.suffix;
					if (act.path) path = act.path;
					console.log('    * ' + act.method + " " + path);
					addAction(app, act.method, path, middleware, fn);
				} else {
					console.log('Error: Unhandled action "' + action + '"');
				}
		}
	});
};

exports.addControllers = function (app) {
	fs.readdir('controllers', function (err, files) {
		if (err) {
			console.log('Error adding controllers: ' + err);
			return;
		}
		
		for (var fileIndex in files) {
			var file = files[fileIndex];
			
			var extensionPos = file.indexOf('.');
			if (extensionPos == -1) continue;
			var extension = file.substring(extensionPos + 1);
			var name = file.substring(0, extensionPos);
			
			if (extension !== "js") continue;
			
			addController(app, name, require('./controllers/' + file));
		}
	});
};
