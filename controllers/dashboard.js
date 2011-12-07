var database = require('../database.js');
var async = require("async");

exports.configuration = {
	customActions: {
		display: {
			method: "get",
			path: "/"
		}
	}
}

function findDonorOrGroupsFor(id, callback) {
	database.Donor.findOne({_id:id}, function (err, res) {
		if (res) {
			callback(res);
		} else {
			database.Group.findOne({_id:id}, function (err, res) {
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

exports.display = function (req, res) {
	var requests = [], populatedRemarks = [];

	function complete(err) {
		res.render("dashboard", { currentCategory: "dashboard", remarks: populatedRemarks});
	}

	database.Remark.find({active:true}).each(function (err, remark) {   
		if (remark) {
			requests.push(function (callback) {
				findDonorOrGroupsFor(remark.target, function(target) {
					if (target) {
						remark.targetName = target.name;
						populatedRemarks.push(remark);
					} else {
						console.log('Error: Remark\'s target is missing - ' + JSON.stringify(remark));
					}
					callback();
				});
			});
		} else {
			async.parallel(requests, complete);
		}
	});
};
