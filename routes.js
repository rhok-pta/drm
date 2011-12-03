exports.addRoutes = function(app) {
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
};