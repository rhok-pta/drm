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
  
 
  
  
  
  app.get('/', function(req, res) {
    database.Remark.find({active:true}, function(err, remarks){
      res.render("dashboard/index", { currentCategory: "dashboard", remarks: remarks});
    });
  });

  app.get('/requests', function(req, res) {
    database.DonationRequest.find({}, function(err, requests) {
      res.send("WIP");
      return;
      
    requests.forEach(function(request){
      if(request.sentDate == null || request.sentDate > Date.now() ){
        request.sent = "No"  ;
      }else {
        request.sent = "Yes";
      }

      var receiver = [];
      for (index = 0; index < request.groups.length; index++){
        var grp = request.groups[index];
        debugger;
        database.Group.findOne({_id:grp}).each(function(err, grpQuery){      
          console.dir("Error:");
          console.dir(err);       
          console.dir(grpQuery);       
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
                console.dir(receiver);
                receiver.push(donorId);
              }
          });       
          
          if(index == request.groups.length -1){
            // reached last grp in list
            request.amountOfReceiver = receiver.length;
        //    res.render("requests/index", {requests: requests, currentCategory: "requests"});
          }    
        });
      }; 
      });
    });
  });

  app.get('/requests/:id', function(req, res) {
    database.DonationRequest.findOne({_id: req.params.id}).populate('donors').populate('groups').run(function(err, request) {
      if (err)
        throw err
      else if (!request)
        res.send("Could not find request: " + req.params.id);
      else  
        res.render("requests/show", {request: request, currentCategory: "requests"});
    });
  });

  app.get('/donors', function(req, res) {
    database.Donor.find({}, function(err, donors) {
      res.render("donors/index", {donors: donors, currentCategory: "donors"});
    });
  });

  app.get('/donors/new', function(req, res) {
    var donor = {};
    donor.errors = [];
    res.render("donors/_form", {donor : donor, currentCategory: "donors" });
  });
  
  app.post('/donors/new', function(req, res) {
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

  app.post('/donors/edit/:id', function(req, res) {
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

  app.get('/donors/edit/:id', function(req, res) {
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

  app.get('/donors/remove/:id', function(req, res) {
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
  
  app.get('/donors/:id', function(req, res) {
    database.Donor.findOne({_id: req.params.id}).populate('communicationLog').run(function(err, donor) {
      if (err)
        throw err
      else if (!donor)
        res.send("Could not find donor: " + req.params.id);
      else
        res.render("donors/show", {donor: donor, currentCategory: "donors", activeRemark: {}});
    });
  });

  app.get('/groups', function(req, res) {
    database.Group.find({}, function(err, groups) {
      res.render("groups/index", {groups: groups, currentCategory: "groups"});
    });
  });

  app.get('/groups/:id', function(req, res) {
    database.Group.findOne({_id: req.params.id}).populate('donors').run(function(err, group) {
      if (err)
        throw err
      else if (!group)
        res.send("Could not find group: " + req.params.id);
      else  
        res.render("groups/show", {group: group, currentCategory: "groups"});
    });
  });
  
  app.get('/remarks/new', function(req, res) {
    database.Donor.find({}, function(err, donors) {
      database.Group.find({}, function(err, groups) {
        res.render("remarks/_form", {remark: {}, currentCategory: "remind", donors : donors, groups : groups });
      });
    });
  });
  
  app.get('/remarks/:id', function(req, res) {
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
  app.post('/remarks/new', function(req, res) {
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
  
  app.get('/settings', function(req, res) {
    res.render("settings",{currentCategory: "donors"});
  });
};


