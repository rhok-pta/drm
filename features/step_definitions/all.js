
var steps = function() {
	this.Then(/^show me the page/, function(callback){
		console.log("Show me the page");
	});	
}

module.exports = steps;