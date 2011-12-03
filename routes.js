exports.addRoutes = function(app,database) {
	app.get('/', function(req, res) {
		res.render("index");
	});

	app.get('/requests', function(req, res) {
		database.DonationRequest.find({}, function(err, requests) {
			res.render("requests/index", {requests: requests});
		});
	});

	app.get('/requests/:id', function(req, res) {
		database.DonationRequest.findOne({_id: req.params.id}).populate('donors').populate('groups').run(function(err, request) {
			if (err)
				throw err
			else if (!request)
				res.send("Could not find request: " + req.params.id);
			else	
				res.render("requests/new", {request: request});
		});
	});

	app.get('/donors', function(req, res) {
		database.Donor.find({}, function(err, donors) {
			res.render("donors", {donors: donors});
		});
	});

	app.get('/donors/new', function(req, res) {
		var donor = {};
		donor.errors = [];
		res.render("donorNew", {donor : donor });
	});

	app.post('/donors/new', function(req, res) {
		var dataOfDonor=req.body.donor;
		//toDo attach current User
		var donor = new database.Donor(dataOfDonor);
		console.dir(donor);
		donor.save(function(err){
			if(err){
				dataOfDonor.errors = err.errors;
				res.render("donorNew", {donor : req.body.donor});
			}else {
				res.redirect("/donors/" + donor._id);					
			}
		});			
	});


	app.get('/donors/:id', function(req, res) {
		console.log("show donor");
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
			res.render("groups/index", {groups: groups});
		});
	});

	app.get('/groups/:id', function(req, res) {
		database.Group.findOne({_id: req.params.id}).populate('donors').run(function(err, group) {
			if (err)
				throw err
			else if (!group)
				res.send("Could not find group: " + req.params.id);
			else	
				res.render("groups/new", {group: group});
		});
	});

	app.get('/settings', function(req, res) {
		res.render("settings");
	});
};
