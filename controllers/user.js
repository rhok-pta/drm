var database = require('../database.js');

exports.configuration = {
	customActions : {
		settings : {
			method: 'get',
			path: '/settings'
		}
	}
}

exports.settings = function (req, res) {
	res.render("users/user", {user: req.session.user, currentCategory: "settings"});
};

exports.show = function (req, res) {
	database.User.findById(req.params.id, function (err, user) {
		if (err || !user) {
			res.send("Could not find user: " + req.params.id);
		} else {
			res.render("users/user", {user: user, currentCategory: "settings"});
		}
	});
};

exports.edit = function (req, res) {
	database.User.findById(req.params.id, function (err, user) {
		if (err || !user) {
			res.send("Could not find user: " + req.params.id);
		} else {
			user.errors = [];
			res.render("users/_form", {user : user, currentCategory: "settings"});
		}
	});       
};

exports.update = function (req, res) {
	var userData = req.body.user;

	database.User.findOne({_id: req.params.id}, function (err, user) {
		if (err)
			throw err
		else if (!user) {
			res.send("Could not find user: " + req.params.id);
		} else {
			for (i in userData) user[i] = userData[i];
			
			user.save(function (err) {
				if (err) {
					if (err.name == "CastError") {
						userData.errors = [];
					} else {
						userData.errors = err.errors;                
					}
					
					res.render("users/_form", {user : userData, currentCategory: "settings"});
				} else {
					req.session.user = user //TODO: renew all users of people logged on, once you can use somebody else
					res.redirect("/settings");
				}
			});
		}
	});
};
