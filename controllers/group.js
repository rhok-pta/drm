var database = require('../database.js');

exports.configuration = {
	customActions : {
		addRemark : {
			method : 'post',
			suffix : '/:id/addRemark'
		},
		addPost : {
			method : 'post',
			suffix : '/:id/addPost'
		}
	}
}

exports.index = function (req, res) {
	database.Group.find({}).populate('user', 'name').run(function(err, groups) {
		res.render("groups/index", {groups: groups, currentCategory: "groups"});
	});
};

exports.add = function (req, res) {
	group = {};
	group.errors = [];
	group.isNew = true;
	database.Donor.find({}, function (err, donors) {
		res.render("groups/_form", {group: group, currentCategory: "groups", donors : donors});
	});
};

exports.create = function (req, res) {
	var groupData = req.body.group;
	var group = new database.Group(groupData);
	group.user = req.session.user;
	group.save(function (err) {
		if (err) {
			groupData.errors = err.errors;
			res.render("groups/_form", {group : req.body.group, currentCategory: "group"});
		} else {
			res.redirect("/groups/" + group._id);
		}
	});     
};

exports.edit = function (req, res) {
	database.Donor.find({}, function (errDonors, donors) {
		database.Group.findById(req.params.id).populate('donors').run(function(err, group) {
			if (err || !group) {
				res.send("Could not find group: " + req.params.id);
			} else {
				group.errors = [];
				res.render("groups/_form", {donors: donors, group : group, currentCategory: "groups"});
			}
		});
	});
};

exports.update = function (req, res) {
	var groupData = req.body.group;

	database.Donor.find({}, function (errDonors, donors) {
		database.Group.findById(req.params.id).populate("donors").run(function (err, group) {
			var index;
			if (err || !group) {
				res.send("Could not find group: " + req.params.id);
			} else {
				for (index in groupData) group[index] = groupData[index];

				group.save(function (err) {
					if (err) {
						if (err.name == "CastError") {
							groupData.errors = [];
							groupData.errors.donors = err.name;
						} else {
							groupData.errors = err;
						}
						res.render("groups/_form", {donors: donors, group : groupData, currentCategory: "groups"});
					} else {
						res.redirect("/groups/" + group._id);
					}
				});
			}
		});
	});
};

exports.destroy = function (req, res) {
	database.Group.findById(req.params.id).run(function(err, group) {
	if (err || !group) {
		res.send("Could not find group: " + req.params.id);
	} else {
		group.remove(function () {
			res.redirect("/groups");  
		});
	}
	});       
};

exports.show = function (req, res) {   
	database.Group.findById(req.params.id).populate('donors').populate('communicationLog').run(function (err, group) {
		if (err || !group)
			res.send("Could not find group: " + req.params.id);
		else  
			res.render("groups/show", {group: group, currentCategory: "groups"});
	});
};

exports.addRemark = function (req, res) {
	var remarkData = req.body.remark;
	var remark = new database.Group(remarkData);
	remark.user = req.session.user;
	if (remark.date == null)
		remark.date = new Date();
		remark.save(function (err) {
			if (err) {
				remarkData.errors = err.errors;
				res.render("groups/_form", {group : req.body.group, currentCategory: "group"});
			} else {
				res.redirect("/groups/" + group._id);
			}
	});     
};

exports.addPost = function (req, res) {
	var post = new database.Post(req.body.post);
	post.user = req.session.user;
	if (!post.date) post.date = new Date();

	database.Group.findById(req.params.id, function(err, group) {
		post.save(function(err,result) {
			group.communicationLog.push(post);
			group.save(function(err, result) {
				res.redirect("/groups/" + req.params.id);
			});
		});
	});
};
