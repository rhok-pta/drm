exports.addRoutes = function(app,database) {
	app.get('/', function(req, res) {
		res.render("index");
	});

	app.get('/requests', function(req, res) {
		database.DonationRequest.find({}, function(err, requests) {
			res.render("requests", {requests: requests});
		});
	});

	app.get('/requests/:id', function(req, res) {
		database.DonationRequest.findOne({_id: req.params.id}).populate('donors').populate('groups').run(function(err, request) {
			if (err)
				throw err
			else if (!request)
				res.send("Could not find request: " + req.params.id);
			else	
				res.render("request", {request: request});
		});
	});

	app.get('/donors', function(req, res) {
		database.Donor.find({}, function(err, donors) {
			res.render("donors", {donors: donors});
		});
	});

	app.get('/donors/new', function(req, res) {
		var donor = new database.Donor();
		res.render("donorNew", {donor : donor});
	});
	app.post('/donors/new', function(req, res) {
		var donor = database.Donor(req.body.donor);
		console.dir(donor);	
		res.render("donorNew", {donor : donor});
	});


	app.get('/donors/:id', function(req, res) {
		database.Donor.findOne({_id: req.params.id}, function(err, donor) {
			if (err)
				throw err
			else if (!donor)
				res.send("Could not find donor: " + req.params.id);
			else	
				res.render("donor", {donor: donor});
		});
	});

	app.get('/groups', function(req, res) {
		database.Group.find({}, function(err, groups) {
			res.render("groups", {groups: groups});
		});
	});

	app.get('/groups/:id', function(req, res) {
		database.Group.findOne({_id: req.params.id}).populate('donors').run(function(err, group) {
			if (err)
				throw err
			else if (!group)
				res.send("Could not find group: " + req.params.id);
			else	
				res.render("group", {group: group});
		});
	});

	app.get('/settings', function(req, res) {
		res.render("settings");
	});
};
