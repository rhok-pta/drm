exports.addRoutes = function(app) {
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
};