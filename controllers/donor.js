var database = require('../database.js');
var _ = require("underscore");

exports.configuration = {
	customActions : {
		addPost : {
			method : 'post',
			suffix : '/:id/addPost'
		}
	}
}

exports.index = function (req, res) {
	database.Donor.find({}, function (err, donors) {
		res.render("donors", {donors: donors, currentCategory: "donors"});
	});
};

exports.add = function (req, res) {
	var donor = {};
	donor.errors = [];
	res.render("donors/_form", {donor : donor, currentCategory: "donors" });
};

exports.create = function (req, res) {
	var donorData = req.body.donor;
	
	var donor = new database.Donor(donorData);
	donor.user = req.session.user;
	donor.save(function (err) {
		if (err) {
			donorData.errors = err;
			res.render("donors/_form", {donor: donorData, currentCategory: "donors"});
		} else {
			res.redirect("/donors/" + donor._id);         
		}
	});     
};

exports.edit = function (req, res) {   
	database.Donor.findById(req.params.id).populate('donors').run(function (err, donor) {
		if (err || !donor) {
			res.send("Could not find donor: " + req.params.id);
		} else {
			donor.errors = [];
			res.render("donors/_form", {donor : donor, currentCategory: "donors"});
		}
	});       
};

exports.update = function (req, res) {
	var donorData = req.body.donor;

	database.Donor.findById(req.params.id).populate('donors').run(function (err, donor) {
		if (err || !donor) {
			res.send("Could not find donor: " + req.params.id);
		} else {
			for (var i in donorData) donor[i] = donorData[i];
			
			donor.save(function (err) {
				if (err) {
					if (err.name == "CastError") {
						donorData.errors = [];
						donorData.errors.birthday  = err.message;
					} else {
						donorData.errors = err.errors;                
					}          
					res.render("donors/_form", {donor : donorData, currentCategory: "donors"});
				} else {
					res.redirect("/donors/" + donor._id);
				}
			});
		}
	});
};

exports.destroy = function (req, res) {
	database.Donor.findById(req.params.id).populate('donors').run(function (err, donor) {
		if (err || !donor) {
			res.send("Could not find donor: " + req.params.id);
		} else {
			donor.remove(function () {
				res.redirect("/donors");  
			});
		}
	});       
};

exports.show = function (req, res) {
	database.Donor.findById(req.params.id).populate('communicationLog').run(function (err, donor) {
		if (err || !donor) {
			res.send("Could not find donor: " + req.params.id);
		} else {
			var communicationLog = _.sortBy(donor.communicationLog, function (post) {return post.date;})
			res.render("donors/show", {donor: donor, currentCategory: "donors", activeRemark: {}, communicationLog: communicationLog});
		}
	});
};

exports.addPost = function (req, res) {
	var post = new database.Post(req.body.post);
	post.user = req.session.user;
	if (!post.date) post.date = new Date();
	database.Donor.findById(req.params.id, function (err, donor) {
		post.save(function (err, result) {
			if (result) {
				donor.communicationLog.push(post);
				donor.save(function () {
					res.redirect("/donors/" + req.params.id);
				});
			}
		});
	});
};
