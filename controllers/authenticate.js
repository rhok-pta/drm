var database = require('../database.js');

exports.configuration = {
	authenticate: false,
	customActions: {
		loginForm: {
			method: "get",
			path: "/login"
		},
		login: {
			method: "post",
			path: "/login"
		},
		logout: {
			method: "get",
			path: "/logout"
		},
	}
}

exports.loginForm = function (req, res) {
	res.render("login", {layout: 'blank.jade', currentCategory: "donors", user: {errors:[]}});
};

exports.login = function (req, res) {
	var credentials = req.body.user;    
	database.User.findOne({username : credentials.username}, function(err, user) {
		if (!err && user) {
			if (user.password == credentials.password) {
				req.session.user = user;
				res.redirect("/"); 
				return;
			}        
		}
		
		credentials.errors = [];
		delete credentials.password;
		credentials.errors.general = "Could not log in. Wrong username or password";
		res.render("login", {layout: 'blank.jade', currentCategory: "donors", user: credentials}); 
	});
};

exports.logout = function (req, res) {
	delete req.session.user;
	res.redirect("/login");
};
