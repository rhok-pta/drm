var browser = require('./browser');
var database = require('../../database.js');
var user = database.User;

var steps = function() {

	this.When(/^I fill in (.*)$/, function(desc, callback) {
		switch (desc) {
			case 'the data of the example user':
				
		}


	});
}

module.exports = steps;



