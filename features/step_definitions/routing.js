var browser = require('./browser');

var steps = function() {

	this.Then(/^I am on the (.*) page/, function(pageName, callback){
		switch(pageName) {
			case 'login':
				browser.openStartPage(callback);
				break;
			case 'donors':
				browser.openPage("/donors", callback);
				break;			
			default :
				throw "Couldn't find route for " + pageName;
		}
	});	
}

module.exports = steps;