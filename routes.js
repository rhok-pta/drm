exports.addRoutes = function(app,database) {
  app.get('/', function(req, res) {
    res.render("index");
  });

  app.get('/requests', function(req, res) {
    database.DonationRequest.find({}, function(err, requests) {
      res.render("requests/index", {requests: requests});
    });
  });

  app.get('/requests/:id', function(req, res) {
    database.DonationRequest.findOne({_id: req.params.id}).populate('donors').populate('groups').run(function(err, request) {
      if (err)
        throw err
      else if (!request)
        res.send("Could not find request: " + req.params.id);
      else  
        res.render("requests/show", {request: request});
    });
  });

  app.get('/donors', function(req, res) {
    database.Donor.find({}, function(err, donors) {
      res.render("donors/index", {donors: donors});
    });
  });

  app.get('/donors/new', function(req, res) {
    var donor = {};
    donor.errors = [];
    res.render("donors/_form", {donor : donor });
  });
  
  app.post('/donors/new', function(req, res) {
    var dataOfDonor=req.body.donor;
    //toDo attach current User
    var donor = new database.Donor(dataOfDonor);
    donor.save(function(err){
      if(err){
        dataOfDonor.errors = err.errors;
        res.render("donors/_form", {donor : req.body.donor});
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
              res.render("donors/_form", {donor : dataOfDonor});
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
        res.render("donors/_form", {donor : donor});
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
        res.render("donors/show", {donor: donor});
    });
  });

  app.get('/groups', function(req, res) {
    database.Group.find({}, function(err, groups) {
      res.render("groups/index", {groups: groups});
    });
  });

  app.get('/groups/:id', function(req, res) {
    database.Group.findOne({_id: req.params.id}).populate('donors').run(function(err, group) {
      if (err)
        throw err
      else if (!group)
        res.send("Could not find group: " + req.params.id);
      else  
        res.render("groups/show", {group: group});
    });
  });

  app.get('/settings', function(req, res) {
    res.render("settings");
  });
};
