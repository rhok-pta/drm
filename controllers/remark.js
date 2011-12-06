var database = require('../database.js');
var _ = require("underscore");

function findDonorOrGroupsFor(id, callback) {
	database.Donor.findOne({_id:id}, function(err, res) {
		if (res) {
			callback(res);
		} else {
			database.Group.findOne({_id:id}, function(err, res) {
				if (res) {
					callback(res);
				} else {
					console.log("Error: could not find target");
					callback(null);
				}
			});
		}
	});
};

exports.show = function (req, res) {
	database.Remark.findOne({_id : req.params.id}, function(err, remark) {
		if (err || !remark)
			res.send("Could not find remark: " + req.params.id);
		else {
			findDonorOrGroupsFor(remark.target, function(target){
			if(target.isDonor){
				var communicationLog = _.sortBy(target.communicationLog, function(post) {return post.date;})
				res.render("donors/show", {donor: target, currentCategory: "donors", activeRemark:remark._id, communicationLog: communicationLog});
			}else {
				res.render("groups/show", {group: target, currentCategory: "groups", activeRemark:remark._id});
				}
			});
		}
	});
};

exports.add = function (req, res) {
	database.Donor.find({}, function(err, donors) {
		database.Group.find({}, function(err, groups) {
			res.render("remarks/_form", {remark: {}, currentCategory: "remind", donors : donors, groups : groups });
		});
	});
};

exports.create = function (req, res) {
	var data = req.body.remark;
	findDonorOrGroupsFor(data.target, function(target) {
		var reminder = new database.Remark(data);
		reminder.target = target;
		reminder.save(function(err) {
			target.remarks.push(reminder);      
			target.save(function(err, result) {
				if (err) {
					var reminderData = req.body.reminder;
					reminderData.errors = err;
					res.render("remarks/_form", {remark: reminderData, currentCategory: "remind", donors : donors, groups : groups }); 
				} else {
					res.redirect("back");
				}
			});        
		});
	});
};
