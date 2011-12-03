var browser = require('./browser');

var steps = function() {
	this.Given(/^I'm not logged in$/, function(callback) {
	  callback();
	});
	
	this.Given(/^I'm logged in as (*.)$/, function(role,callback) {
		switch(role){
			case 'an user': 
				browser.openStartPage(function(){
//					 callback();	
				});
		}

	});
}

module.exports = steps;