var browser = require('./browser');

var steps = function() {

	this.Then(/^I'm on the (.*) page/, function(pageName, callback){
		switch(pageName) {
			case 'login':
				browser.openStartPage(callback);
		}
	});	
}

module.exports = steps;