var _ = require("underscore");
var async = require("async");

var donorAction = require("./controllers/donor.js");
var groupAction = require("./controllers/group.js");
var requestAction = require("./controllers/request.js");
var remarkAction = require("./controllers/remark.js");
var userAction = require("./controllers/user.js");

exports.addRoutes = function (app, database) {
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

  var andRestrictToUser = function (req, res, next) {
    return req.session.user == undefined ? 
      res.redirect("/login") :
      next();
  }
  
  app.get('/', andRestrictToUser, function (req, res) {
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
  });

  app.get( '/donors', andRestrictToUser, donorAction.index);
  app.get( '/donors/new', andRestrictToUser, donorAction.add);
  app.post('/donors/new', andRestrictToUser, donorAction.create);
  app.get( '/donors/:id', andRestrictToUser, donorAction.show);
  app.get( '/donors/:id/edit', andRestrictToUser, donorAction.edit);
  app.post('/donors/:id/edit', andRestrictToUser, donorAction.update);
  app.get( '/donors/:id/delete', andRestrictToUser, donorAction.destroy); 
  app.post('/donors/:id/addPost', andRestrictToUser, donorAction.addPost);

  app.get( '/groups', andRestrictToUser, groupAction.index);
  app.get( '/groups/new', andRestrictToUser, groupAction.add);
  app.post('/groups/new', andRestrictToUser, groupAction.create);
  app.get( '/groups/:id', andRestrictToUser, groupAction.show);
  app.post('/groups/:id/addPost', groupAction.addPost);
  app.post('/groups/:id/addRemark', andRestrictToUser, groupAction.addRemark);
  app.get( '/groups/:id/edit', andRestrictToUser, groupAction.edit);
  app.post('/groups/:id/edit', andRestrictToUser, groupAction.update);
  app.get( '/groups/:id/delete', andRestrictToUser, groupAction.destroy);
  
  app.get( '/requests', andRestrictToUser, requestAction.index);
  app.get( '/requests/new', andRestrictToUser, requestAction.add);
  app.post('/requests/new', andRestrictToUser, requestAction.create);
  app.get( '/requests/:id', andRestrictToUser, requestAction.show);
  app.get( '/requests/:id/edit', andRestrictToUser, requestAction.edit);
  app.post('/requests/:id/edit', andRestrictToUser, requestAction.update);
  app.get( '/requests/:id/delete', andRestrictToUser, requestAction.destroy);

  app.get( '/remarks/new', andRestrictToUser, remarkAction.add);
  app.post('/remarks/new', andRestrictToUser, remarkAction.create);
  app.get( '/remarks/:id', andRestrictToUser, remarkAction.show); 
  
  app.get( '/settings', andRestrictToUser, userAction.show);
  app.get( '/users/:id/edit', andRestrictToUser, userAction.edit);
  app.post('/users/:id/edit', andRestrictToUser, userAction.update);

  app.get('/login',  function (req, res) {
    res.render("login/index",{layout: 'blank.jade', currentCategory: "donors", user: {errors:[]}});
  });

  app.post('/login', function (req, res) {
    var credentials = req.body.user;    
    database.User.findOne({username : credentials.username}, function(err, user) {
      if (!err && user) {
        if (user.password == credentials.password) {
          req.session.user = user;
          res.redirect("/"); 
          return;
        }        
      }
      credentials.errors= [];
      delete credentials.password;
      credentials.errors.general = "Could not log in with. Wrong username/password";
      res.render("login/index",{layout: 'blank.jade', currentCategory: "donors", user: credentials }); 
    });
  });

  app.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect("/login");
  });
  
  app.get('*', function (req, res) {
    res.render("404", {currentCategory: "none"});
  });
};
