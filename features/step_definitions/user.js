var browser = require('./browser');
var user = require('../../database.js').User;


var steps = function() {
	this.Given(/^I am not logged in$/, function(callback) {
	  callback();
	});
	
	this.Given(/^I am logged in as (.*)$/, function(role ,callback) {
		switch(role){
			case 'the example user': 				
				loginExampleUser();
		}

	});
}

function loginExampleUser() {
	browser.openStartPage(function(){
		user.findOne({ username : "exampleUser" }, function(err, exampleUser){
			browser.type("//input[title='Username']", exampleUser.username, function(){
				browser.type("//input[title='Password']", exampleUser.password, function(){
					browser.clickOn("//input[title='Login']", callback);
				});							
			});
		});				
	});
}
exports.loginExampleUser=loginExampleUser;

module.exports = steps;