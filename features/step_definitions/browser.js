
var assert = require('assert');
var soda = require('soda');
var promise = require('promise').promise;
var debug = true;


var browser = null;
function getBrowser(callback) {
	if (browser == null) {
		createBrowserSession(function(browser){
		  	browser = browser;
			callback(browser);
		});
	}else {
		callback(browser);
	}
}



//exports.getBrowserSession = getBrowserSession;
var browserSession = 0;
function getBrowserSession() {
	return browserSession;
}
function setBrowserSession (sessionId) {
	browserSession = sessionId;
}


function createBrowserSession (callback) {
	browser = new soda.createClient({
	    host: 'localhost'
	  , port: 4444
	  , url: 'http://localhost:8080'
	  , browser: '*googlechrome'
	});	
	if (debug) {
		console.log("creating browser");
		browser.on('command', function(cmd, args){
			console.log(' \x1b[33m%s\x1b[0m: %s', cmd, args.join(', '));
		});
	}
	try {
		browser.session(
			function(err, id){
				if(err){
					console.log("Could not create selenium session.");
					callback.failure();
				}else {
					setBrowserSession(id);
					callback(browser);
				}
			});
	} catch(e){
		throw e;
	}
}
exports.createBrowserSession = createBrowserSession;

function openStartPage(callback){
	getBrowser(function(browser){
		browser.open('/', getBrowserSession(), function(){
			checkPresenceOfElement("//body", callback );
		});
	});
}
exports.openStartPage = openStartPage;

function terminateBrowserSession(callback) {
	getBrowser(function(browser){
		browser.testComplete(getBrowserSession(), function(err) {
			if (err) {
				throw err;
				callback.failure();
			}else {
				setBrowserSession(0);		
				callback();
			}
		});
	});
}
exports.terminateBrowserSession = terminateBrowserSession;



function checkPresenceOfElement(selector,callback) {
	getBrowser(function(browser){
		browser.waitForVisible(selector, function(err){				
			if(err){
				console.dir(err);
			}else {
				browser.assertVisible(selector, function(err){
					if(err){
						throw "ERROR wait for selector: " + selector					
						callback.failure();
					}else {
						console.dir(callback)
						callback();
					}
				});
			}
		});	
	});
}
exports.checkPresenceOfElement = checkPresenceOfElement;


function denyPresenceOfElement(selector,callback) {
	browser.assertElementNotPresent(selector, getBrowserSession(), callback);
}
exports.denyPresenceOfElement = denyPresenceOfElement;


function checkTextIn(selector, text, callback) {
	browser.getText(selector, getBrowserSession(), function(err, res){
		if(err){
			console.dir(err);
			throw "ERROR wait for selector: " + selector
		}else {
			if(res == text){
				callback();	
			}else if(res.indexOf(text) != -1) {
				callback();	
			}else{
				throw "Expected text '" + text + "' differs from real value '" + res + "'";
				callback.failure();		
			}
		}
	});
}
exports.checkTextIn = checkTextIn;


function checkText(text, callback) {
	browser.assertTextPresent(text, callback);
}
exports.checkText = checkText;



function clickOn(selector, callback){
	getBrowser(function(browser){
		browser.mouseDownAt( selector, 
		 	function(){
				browser.mouseUpAt( selector,
					function(){
						if(debug){
							console.log("clicked");
						}	
						callback();
					});
			});	
	});
}
exports.clickOn = clickOn;


function type(selector, content, callback){
	getBrowser(function(browser){
		browser.type(selector,content, 
			function(err){
				if(err){
					console.log("ERROR during typing");
					console.dir(err);
					callback.failure();	
				}else {
					if(debug)
						console.log("Typed " + content);
					callback();
				}

		});
	});
}
exports.type = type;