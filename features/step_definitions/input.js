var browser = require('./browser');
var database = require('../../database.js');
var user = database.User;

var steps = function() {

	this.When(/^I fill in (.*)$/, function(desc, callback) {
		switch (desc) {
			case 'the data of the example user':
				user.find({})
		}
	});
	
	this.When(/^I fill in (.*) to (.*)$/, function(name, value, callback) {
		switch (name) {
			case 'username field':
				throw "todo";
		}
	});
}

module.exports = steps;



