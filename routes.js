var _ = require("underscore");
var async = require("async");

exports.addRoutes = function(app,database) {
  var findDonorOrGroupsFor = function(id, callBack){
    database.Donor.findOne({_id:id}, function(err, res){
      if(res){
        callBack(res);
      }else {
        database.Group.findOne({_id:id}, function(err, res){
          if(res){
            callBack(res);
          }else{
            throw "Error: could not find target";
          }
        });
      }
    });
  };
  var andRestrictToUser =  function(req, res, next) {
    // toDO
    return next();
    
    return req.session.user == undefined ? 
      res.redirect("/login") :
      next();
  }
  
  var sendRequest =  function(requestId, callback) {
    console.log("Sending a Mail -> TODO");
    // todo sending request
    callback();
  }
  
  
  app.get('/', andRestrictToUser, function(req, res) {
  
    var requests = [], populatedRemarks = [];
    
    function complete(err)
    {
      console.dir(populatedRemarks);
      res.render("dashboard/index", { currentCategory: "dashboard", remarks: populatedRemarks});
    }
  
    database.Remark.find({active:true}).each(function(err, remark) {   
      if (remark) {
        requests.push(function (callback) {
          findDonorOrGroupsFor(remark.target, function(target) {
            remark.targetName = target.name;
            populatedRemarks.push(remark);
            callback();
          });
        });
      }
      else
        async.parallel(requests, complete);
    });
  });

  app.get('/donors', andRestrictToUser, function(req, res) {
    database.Donor.find({}, function(err, donors) {
      res.render("donors", {donors: donors, currentCategory: "donors"});
    });
  });

  app.get('/donors/new', andRestrictToUser, function(req, res) {
    var donor = {};
    donor.errors = [];
    res.render("donors/_form", {donor : donor, currentCategory: "donors" });
  });
  
  app.post('/donors/new', andRestrictToUser, function(req, res) {
    var dataOfDonor=req.body.donor;
    //toDo attach current User
    var donor = new database.Donor(dataOfDonor);
    donor.save(function(err){
      if(err){
        dataOfDonor.errors = err.errors;
        res.render("donors/_form", {donor : req.body.donor, currentCategory: "donors"});
      }else {
        res.redirect("/donors/" + donor._id);         
      }
    });     
  });

  app.post('/donors/edit/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");
    var dataOfDonor=req.body.donor;

    database.Donor.findOne({_id: req.params.id}).populate('donors').run(function(err, donor) {
        if (err)
          throw err
        else if (!donor) {
          res.send("Could not find donor: " + req.params.id);
        } else{
          for (var i in dataOfDonor){
            donor[i] = dataOfDonor[i];
          }
          donor.save(function(err){
            if(err){
              if(err.name == "CastError"){
                dataOfDonor.errors = [];
                dataOfDonor.errors.birthday  = err.message;
              }else {
                dataOfDonor.errors = err.errors;                
              }          
              res.render("donors/_form", {donor : dataOfDonor, currentCategory: "donors"});
            }else {
              res.redirect("/donors/" + donor._id);
            }
          });
        }
    });
  });
  
  app.get('/donors/edit/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");    
    database.Donor.findOne({_id: req.params.id}).populate('donors').run(function(err, donor) {
      if (err)
        throw err
      else if (!donor)
        res.send("Could not find donor: " + req.params.id);
      else{
        donor.errors = [];
        res.render("donors/_form", {donor : donor, currentCategory: "donors"});
      }
    });       
  });

  app.get('/donors/remove/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");
    database.Donor.findOne({_id: req.params.id}).populate('donors').run(function(err, donor) {
      if (err)
        throw err
      else if (!donor)
        res.send("Could not find donor: " + req.params.id);
      else{
        donor.remove(function(){
          res.redirect("/donors");  
        });
      }
    });       
  }); 
  
  app.get('/donors/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");
    database.Donor.findOne({_id: req.params.id}).populate('communicationLog').run(function(err, donor) {
      if (err)
        throw err
      else if (!donor)
        res.send("Could not find donor: " + req.params.id);
      else
        res.render("donors/show", {donor: donor, currentCategory: "donors", activeRemark: {}});
    });
  });

  app.post('/donors/addPost/:id', function(req, res) {
    var id = req.params.id;
    var post = new database.Post(req.body.post);
    post.user = req.session.user;
    database.Donor.findOne({_id: id}, function(err, donor) {
      post.save(function(err,result){
        if(result){
          donor.communicationLog.push(post);
          donor.save(function(){
            res.redirect("/donors/" +id);
          });
        }
      });
    });
  });
  

  app.post('/groups/addPost/:id', function(req, res) {
    var id = req.params.id;
    var post = new database.Post(req.body.post);
    post.user = req.session.user;
    database.Group.findOne({_id: id}, function(err, group) {

      post.save(function(err,result){
        if(err)
          console.dir(err);
        group.communicationLog.push(post);
        group.save(function(err, result){
          if(err)
              console.dir(err);
          console.dir(result);
          res.redirect("/groups/" +id);
        });
      });
    });
  });
    
  app.get('/groups', andRestrictToUser, function(req, res) {
    database.Group.find({}).populate('user').populate('name').run(function(err, groups) {
      res.render("groups/index", {groups: groups, currentCategory: "groups"});
    });
  });

  app.get('/groups/new', andRestrictToUser, function(req, res) {
    group = {};
    group.errors = [];
    group.isNew = true;
    database.Donor.find({}, function(err, donors) {
      res.render("groups/_form", {group: group, currentCategory: "groups", donors : donors});
    });
  });

  app.post('/groups/new', andRestrictToUser, function(req, res) {
    var groupData=req.body.group;
    var group = new database.Group(groupData);
    group.user = req.session.user;
    group.save(function(err) {
      if (err) {
        groupData.errors = err.errors;
        res.render("groups/_form", {group : req.body.group, currentCategory: "group"});
      } else {
        res.redirect("/groups/" + group._id);
      }
    });     
  });

  app.get('/groups/edit/:id', andRestrictToUser, function(req, res) {
    database.Donor.find({}, function(errDonors, donors) {
      database.Group.findOne({_id: req.params.id}).populate('donors').run(function(err, group) {
        if (err)
          throw err
        else if (!group)
          res.send("Could not find group: " + req.params.id);
        else {
          group.errors = [];
          res.render("groups/_form", {donors: donors, group : group, currentCategory: "groups"});
        }
      });
    });
  });

  app.post('/groups/edit/:id', andRestrictToUser, function(req, res) {
    var groupData = req.body.group;

    database.Donor.find({}, function(errDonors, donors) {
      database.Group.findOne({_id: req.params.id}).populate("donors").run(function(err, group) {
          var index;
          if (err)
            throw err
          else if (!group) {
            res.send("Could not find group: " + req.params.id);
          } else{
            for (index in groupData)
              group[index] = groupData[index];
              
            group.save(function(err) {
              if (err) {
                if(err.name == "CastError") {
                  groupData.errors = [];
                  groupData.errors.donors = err.name;
                }
                else
                  groupData.errors = err;
                  
                res.render("groups/_form", {donors: donors, group : groupData, currentCategory: "groups"});
              } else {
                res.redirect("/groups/" + group._id);
              }
            });
          }
      });
    });
  });
  
  app.get('/groups/remove/:id', andRestrictToUser, function(req, res) {
    database.Group.findOne({_id: req.params.id}).run(function(err, group) {
      if (err)
        throw err
      else if (!group)
        res.send("Could not find group: " + req.params.id);
      else{
        group.remove(function() {
          res.redirect("/groups");  
        });
      }
    });       
  });

  app.get('/groups/:id', andRestrictToUser, function(req, res) {
    console.dir("asda");
    if(req.params.id == null)
      res.send("No valid id");    
      database.Group.findOne({_id: req.params.id}).populate('donors').populate('communicationLog').run(function(err, group) {
        console.dir(group);
      if (err)
        throw err
      else if (!group)
        res.send("Could not find group: " + req.params.id);
      else  
        res.render("groups/show", {group: group, currentCategory: "groups"});
    });
  });
  
  
  app.get('/requests', andRestrictToUser, function(req, res) {
    database.DonationRequest.find({}).populate("groups").run(function(err, requests) {
      res.render("requests/index", {requests: requests, currentCategory: "requests"});
    });
  });
  
  app.get('/requests/edit/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");
    database.DonationRequest.findOne({_id: req.params.id}, function(err, request) {
      if(request != null){
        request.errors = [];
        database.Group.find({}, function(err, groups){
          database.Donor.find({}, function(err, donors){
            console.dir(groups);
            res.render("requests/_form", {request: request, currentCategory: "requests", donors: donors, groups:groups});
          });    
        });
      }
    });
  });
  
  app.post('/requests/edit/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");
    database.DonationRequest.findOne({_id: req.params.id}, function(err, request) {
      if(request != null){
        var dataOfRequest = req.body.request;
        for (i in dataOfRequest){
          request[i] = dataOfRequest[i];
        }
        request.save(function(err, result){
          if(err){
              dataOfRequest.errors = err.errors;                
              database.Group.find({}, function(err, groups){
                database.Donor.find({}, function(err, donors){
                  res.render("requests/_form", {request: dataOfRequest, currentCategory: "requests", donors: donors, groups:groups});
                });    
              });
          }else {
            res.redirect("/requests/" + result._id);
          }                    
        });
      }
    });
  });  
  
  app.get('/requests/new', andRestrictToUser, function(req, res) {
    database.Group.find({}, function(err, groups){
      database.Donor.find({}, function(err, donors){
        res.render("requests/_form", {request: {errors: [] }, currentCategory: "requests", donors: donors, groups:groups});
      });    
    });
  });

  app.post('/requests/new', andRestrictToUser, function(req, res) {
    var request = new database.DonationRequest(req.body.request);
    request.user = req.session.user;
    request.save(function(err, result){
      if (err) {
        var data = req.body.request;
        data.errors = err;
        res.render("requests/_form", {request: data, currentCategory: "requests", donors: donors, groups:groups});
      }else {
        if(req.body.action == "Save") {
          res.redirect("/requests/" + result._id);
        }else {
          sendRequest( result._id, function(){
            res.redirect("/requests/" + result._id);
          });
        }
      }
    });

  });
  
  app.get('/requests/remove/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");
    database.DonationRequest.findOne({_id: req.params.id},function(err, request) {
      if (err)
        throw err
      request.remove();
      res.redirect("/requests");
    });
  });
  
  app.get('/requests/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");
    database.DonationRequest.findOne({_id: req.params.id}).populate('donors').populate('groups').run(function(err, request) {
      if (err)
        throw err
      else if (!request)
        res.send("Could not find request: " + req.params.id);
      else  
        res.render("requests/show", {request: request, currentCategory: "requests"});
    });
  });
   
  app.get('/remarks/new', andRestrictToUser, function(req, res) {
    database.Donor.find({}, function(err, donors) {
      database.Group.find({}, function(err, groups) {
        res.render("remarks/_form", {remark: {}, currentCategory: "remind", donors : donors, groups : groups });
      });
    });
  });
  
  app.get('/remarks/:id', andRestrictToUser, function(req, res) {
    if(req.params.id == null)
      res.send("No valid id");  
    database.Remark.findOne({_id : req.params.id}, function(err, remark){
      findDonorOrGroupsFor(remark.target, function(target){
        if(target.isDonor){
          res.render("donors/show", {donor: target, currentCategory: "donors", activeRemark:remark._id});
        }else {
          res.render("groups/show", {group: target, currentCategory: "groups", activeRemark:remark._id});
        }
      });      
    });
  });  
  app.post('/remarks/new', andRestrictToUser, function(req, res) {
    var data = req.body.remark;
    findDonorOrGroupsFor(data.target, function(target){
      var reminder = new database.Remark(data);
      reminder.target = target;
      reminder.save(function(err){
        target.remarks.push(reminder);      
        target.save(function(err, result){
          if (err){
            var reminderData = req.body.reminder;
            reminderData.errors = err;
            res.render("remarks/_form", {remark: reminderData, currentCategory: "remind", donors : donors, groups : groups }); 
          }else {
            res.redirect("/");
          }
        });        
      });
    });
  });
  
  app.get('/settings', andRestrictToUser, function(req, res) {
    res.render("users/user",{user: req.session.user, currentCategory: "settings"});
  });
  
  app.get('/users/edit/:id', andRestrictToUser, function(req, res) {
    database.User.findOne({_id: req.params.id}, function(err, user) {
      if (err)
        throw err
      else if (!user)
        res.send("Could not find user: " + req.params.id);
      else{
        user.errors = [];
        res.render("users/_form", {user : user, currentCategory: "settings"});
      }
    });       
  });
  
  app.post('/users/edit/:id', andRestrictToUser, function(req, res) {
    // update
    var dataOfUser=req.body.user;

    database.User.findOne({_id: req.params.id}, function(err, user) {
        if (err)
          throw err
        else if (!user) {
          res.send("Could not find user: " + req.params.id);
        } else{
          for (i in dataOfUser){
            user[i] = dataOfUser[i];
          }
          user.save(function(err){
            if(err){
              if(err.name == "CastError"){
                dataOfUser.errors = [];
              }else {
                dataOfUser.errors = err.errors;                
              }
              req.flash('info', 'tests');
              console.dir(err);
              res.render("users/_form", {donor : dataOfUser, currentCategory: "settings"});
            }else {
              req.session.user = user //TODO: renew all users of people logged on, once you can use somebody else
              res.redirect("/settings");
            }
          });
        }
    });
  });
  
  
  
  app.get('/login',  function(req, res) {
    res.render("login/index",{layout: 'blank.jade', currentCategory: "donors", user: {errors:[]}});
  });

  app.post('/login', function(req, res) {
    var credentials = req.body.user;    
    database.User.findOne({username : credentials.username}, function(err, user){
      if (!err) {
        if(user.password == credentials.password){
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



  app.get('/logout',  function(req, res) {
    req.session.user = null;
    res.redirect("/login");
  });
};
