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
  
  
  
  app.get('/', andRestrictToUser, function(req, res) {
    database.Remark.find({active:true}, function(err, remarks){
      res.render("dashboard/index", { currentCategory: "dashboard", remarks: remarks});
    });
  });

  app.get('/requests', andRestrictToUser, function(req, res) {
    database.DonationRequest.find({}, function(err, requests) {
            
    for(var reqIndex = 0; reqIndex < requests.length; reqIndex++) {
        var request = requests[reqIndex];
      if(request.sentDate == null || request.sentDate > Date.now() ){
        request.sent = "No"  ;
      }else {
        request.sent = "Yes";
      }
      var receiver = request.donors;
      
      if(request.groups.length > 0){
        console.log("aa");
        for (index = 0; index < request.groups.length; index++){
          var grp = request.groups[index];
          database.Group.findOne({_id:grp}, function(err, grpQuery){
            grpQuery.donors.forEach(function(donorId){
                var found = false;
                receiver.forEach(function(d){
                  if(d==donorId){
                    console.log("gefunden");
                    found = true;
                    return true; 
                  }
                });
                if (found == false){
                  receiver.push(donorId);
                }
            });
            
            if(index == request.groups.length -1){
              // reached last grp in list
              request.amountOfReceiver = receiver.length;
              if(reqIndex == requests.length-1)
                res.render("requests/index", {requests: requests, currentCategory: "requests"});
            }          
          });
        }        
      }else {
        request.amountOfReceiver = receiver.length;
        if(reqIndex == requests.length-1)
          res.render("requests/index", {requests: requests, currentCategory: "requests"});        
      }
    }
    
    });
  });

  app.get('/requests/:id', andRestrictToUser, function(req, res) {
    database.DonationRequest.findOne({_id: req.params.id}).populate('donors').populate('groups').run(function(err, request) {
      if (err)
        throw err
      else if (!request)
        res.send("Could not find request: " + req.params.id);
      else  
        res.render("requests/show", {request: request, currentCategory: "requests"});
    });
  });

  app.get('/donors', andRestrictToUser, function(req, res) {
    database.Donor.find({}, function(err, donors) {
      res.render("donors/index", {donors: donors, currentCategory: "donors"});
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
    // update
    var dataOfDonor=req.body.donor;

    database.Donor.findOne({_id: req.params.id}).populate('donors').run(function(err, donor) {
        if (err)
          throw err
        else if (!donor) {
          res.send("Could not find donor: " + req.params.id);
        } else{
          for (i in dataOfDonor){
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
              req.flash('info', 'tests');
              console.dir(err);
              res.render("donors/_form", {donor : dataOfDonor, currentCategory: "donors"});
            }else {
              res.redirect("/donors/" + donor._id);
            }
          });
        }
    });
  });
  
  app.get('/donors/edit/:id', andRestrictToUser, function(req, res) {
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
    database.Donor.findOne({_id: req.params.id}).populate('communicationLog').run(function(err, donor) {
      if (err)
        throw err
      else if (!donor)
        res.send("Could not find donor: " + req.params.id);
      else
        res.render("donors/show", {donor: donor, currentCategory: "donors", activeRemark: {}});
    });
  });

  app.get('/groups', andRestrictToUser, function(req, res) {
    database.Group.find({}, function(err, groups) {
      res.render("groups/index", {groups: groups, currentCategory: "groups"});
    });
  });

  app.get('/groups/:id', andRestrictToUser, function(req, res) {
    database.Group.findOne({_id: req.params.id}).populate('donors').run(function(err, group) {
      if (err)
        throw err
      else if (!group)
        res.send("Could not find group: " + req.params.id);
      else  
        res.render("groups/show", {group: group, currentCategory: "groups"});
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
    res.render("settings",{currentCategory: "donors"});
  });
  
  app.get('/login',  function(req, res) {
    res.render("login/index",{layout: 'blank.jade', currentCategory: "donors", user: {errors:[]}});
  });

  app.post('/login', function(req, res) {
    var credentials = req.body.user;    
    database.User.findOne({username : credentials.username}, function(err, user){
      if (!err) {
        console.dir(req.session.user);
        console.dir(credentials);
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



