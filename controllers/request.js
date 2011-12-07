var database = require('../database.js');

exports.index = function (req, res) {
	database.DonationRequest.find({}).populate("groups").run(function (err, requests) {
		res.render("requests", {requests: requests, currentCategory: "requests"});
	});
};

exports.add = function (req, res) {
	var request = {};
	request.errors = [];
	database.Group.find({}, function (err, groups) {
		database.Donor.find({}, function (err, donors) {
			res.render("requests/_form", {request: request, currentCategory: "requests", donors: donors, groups: groups});
		});    
	});
};

exports.create = function (req, res) {
	console.dir(req.body.request);

	var request = new database.DonationRequest(req.body.request);
	// FIXME: Doesn't work : request.user = req.session.user;
	request.save(function (err, result) {
		if (err) {
			console.dir(err);
		
			var requestData = req.body.request;
			requestData.errors = err;
			database.Group.find({}, function (err, groups) {
				database.Donor.find({}, function (err, donors) {
					res.render("requests/_form", {request: requestData, currentCategory: "requests", donors: donors, groups:groups});
				});
			});
		} else {
			if (req.body.action == "Save") {
				res.redirect("/requests/" + result._id);
			} else {
				sendRequest( result._id, function () {
					res.redirect("/requests/" + result._id);
				});
			}
		}
	});
};

exports.edit = function (req, res) {
	database.DonationRequest.findById(req.params.id, function (err, request) {
		if (err || !request) {
			res.send("Could not find request: " + req.params.id);
		} else {
			request.errors = [];
			database.Group.find({}, function (err, groups) {
				database.Donor.find({}, function (err, donors) {
					res.render("requests/_form", {request: request, currentCategory: "requests", donors: donors, groups:groups});
				});    
			});
		}
	});
};

exports.update = function (req, res) {
	database.DonationRequest.findById(req.params.id, function (err, request) {
		if (err || !request) {
			res.send("Could not find request: " + req.params.id);
		} else {
			var requestData = req.body.request;
			
			for (i in requestData) request[i] = requestData[i];
			
			request.save(function (err, result) {
				if (err) {
					requestData.errors = err.errors;                
					database.Group.find({}, function (err, groups) {
						database.Donor.find({}, function (err, donors) {
							res.render("requests/_form", {request: requestData, currentCategory: "requests", donors: donors, groups:groups});
						});    
					});
				} else {
					res.redirect("/requests/" + result._id);
				}          
			});
		}
	});
};

exports.show = function (req, res) {
	database.DonationRequest.findById(req.params.id).populate('donors').populate('groups').run(function (err, request) {
		if (err || !request) {
			res.send("Could not find request: " + req.params.id);
		} else {
			res.render("requests/show", {request: request, currentCategory: "requests"});
		}
	});
};

exports.destroy = function (req, res) {
	database.DonationRequest.findById(req.params.id).remove(function (err, request) {
		if (err || !request) {
			res.send("Could not find request: " + req.params.id);
		} else {
			res.redirect("/requests");
		}
	});
};
