var database = require('./database.js');

console.log("Seeding database...");

// Clear database
database.Donor.find({}).remove();
database.Group.find({}).remove();
database.User.find({}).remove();
database.Remark.find({}).remove();
database.DonationRequest.find({}).remove();

// Add users
var user1 = new database.User();
user1.name = "Joe White";
user1.username = "exampleUser";
user1.password = "secret";
user1.email = "joe@anywhere.com";
user1.address = "150 Eros Street, Pretoria";
user1.website = "mySite.com";
user1.save();

// A Post
var post1 = new database.Post()
post1.date = new Date();
post1.name = "some name";
post1.user = user1;
post1.medium = "email";
post1.message = "my message";
post1.save();

var post2 = new database.Post()
post2.date = new Date();
post2.name = "some name number 2";
post2.user = user1;
post2.medium = "telephone";
post2.message = "another message";
post2.save();

// Add donors
var donor1 = new database.Donor();
donor1.name = "Joe van Dyk";
donor1.email = "joe@anywhere.com";
donor1.street = "150 Eros Street, Pretoria";
donor1.website = "joevandyk.com";
donor1.communicationLog = [post1,post2];
donor1.save();

var donor2 = new database.Donor();
donor2.name = "Harry Smith";
donor2.email = "harry@greendesigns.co.za";
donor2.street = "257 Smith Street, Johannesburg";
donor2.website = "greendesigns.co.za";
donor2.save();

var donor3 = new database.Donor();
donor3.name = "Barry Goldwing";
donor3.email = "barry@goldwinginc.com";
donor3.street = "45 Rutgers Street, Pretoria";
donor3.website = "goldwinginc.com";
donor3.save();

// Add groups
var group1 = new database.Group();
group1.name = "Pretoria";
group1.description = "All donors in the Pretoria area";
group1.donors = [donor1, donor3];
group1.save();

var group2 = new database.Group();
group2.name = "Corporations";
group2.description = "All donors that are corporations";
group2.donors = [donor2, donor3];
group2.save();

// Add donation requests
var request1 = new database.DonationRequest();
request1.name = "Request to companies to donate";
request1.donors = [];
request1.groups = [group2];
request1.message = "Give us money!";
request1.sendDate = new Date();
request1.subject = "Donation Request";
request1.save();

var request2 = new database.DonationRequest();
request2.name = "Personal requests for money";
request2.donors = [donor1];
request2.groups = [];
request2.message = "Would you be so kind as to donate to our cause";
request2.sendDate = new Date();
request2.subject = "Help the children";
request2.save();

console.log("Database seeded");

database.disconnect();
