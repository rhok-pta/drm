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
post1.subject = "some name";
post1.user = user1;
post1.medium = "email";
post1.message = "my message";
post1.save();

var post2 = new database.Post()
post2.date = new Date();
post2.subject = "some name number 2";
post2.user = user1;
post2.medium = "telephone";
post2.message = "another message";
post2.save();

var post3 = new database.Post()
post3.date = new Date();
post3.subject = "cut-off date";
post3.user = user1;
post3.medium = "email";
post3.message = "Hi. What is the cut-off date for christmas donations?";
post3.save();

var post4 = new database.Post()
post4.date = new Date();
post4.subject = "postal address";
post4.user = user1;
post4.medium = "Telephone";
post4.message = "Hi. Please can you send me your postal address so that I can post my donations to you.";
post4.save();

// Add donors
var donor1 = new database.Donor();
donor1.name = "Joe van Dyk";
donor1.email = "joe@anywhere.com";
donor1.company = "Anywhere Trading";
donor1.telephone = "0735658739";
donor1.street = "150 Eros Street, Pretoria";
donor1.website = "joevandyk.com";
donor1.communicationLog = [post1,post2];
donor1.save();

var donor2 = new database.Donor();
donor2.name = "Harry Smith";
donor2.email = "harry@greendesigns.co.za";
donor2.street = "257 Smith Street, Johannesburg";
donor2.website = "greendesigns.co.za";
donor2.company = "Green Designs";
donor2.telephone = "0715658739";
donor2.save();

var donor3 = new database.Donor();
donor3.name = "Barry Goldwing";
donor3.email = "barry@goldwinginc.com";
donor3.street = "45 Rutgers Street, Pretoria";
donor3.website = "goldwinginc.com";
donor3.company = "Goldwing Inc";
donor3.telephone = "0735981539";
donor3.save();

var donor4 = new database.Donor();
donor4.name = "Victor Smith";
donor4.email = "victor.smith@sap.com";
donor4.street = "21 Jump Street, Pretoria";
donor4.website = "sap.com";
donor4.company = "SAP";
donor4.telephone = "0786658739";
donor4.save();

var donor5 = new database.Donor();
donor5.name = "Adam Rilley";
donor5.email = "adam.r@zedcorp.com";
donor5.street = "105 Road Campus, Frans Road, Johannesburg";
donor5.website = "zedcorp.com";
donor5.company = "ZedCorp";
donor5.telephone = "0735688739";
donor5.save();

var donor6 = new database.Donor();
donor6.name = "Moses Dlamini";
donor6.email = "moses.dlam@sap.com";
donor6.street = "21 Jump Street, Pretoria";
donor6.website = "sap.com";
donor6.company = "SAP";
donor6.telephone = "0847358739";
donor6.save();

var donor7 = new database.Donor();
donor7.name = "Kim Williams";
donor7.email = "kim.williams@pulsecorp.com";
donor7.street = "98 Boardtalk Office Park, Grove Street, Johannesburg";
donor7.website = "pulsecorp.com";
donor7.company = "PulseCorp";
donor7.telephone = "0725658739";
donor7.save();

var donor8 = new database.Donor();
donor8.name = "Greg Nelson";
donor8.email = "greg.nelson@pulsecorp.com";
donor8.street = "98 Boardtalk Office Park, Grove Street, Johannesburg";
donor8.website = "pulsecorp.com";
donor8.company = "PulseCorp";
donor8.telephone = "0846858739";
donor8.save();

var donor9 = new database.Donor();
donor9.name = "Winnie Chan";
donor9.email = "winnie.chan@clover.com";
donor9.street = "15 Milk Street, Johannesburg";
donor9.website = "clover.com";
donor9.company = "Clover";
donor9.telephone = "0823658739";
donor9.save();

var donor10 = new database.Donor();
donor10.name = "Sandy Ndlovu";
donor10.email = "sndlovu@franstrade.com";
donor10.street = "17 Broad Ave, Pretoria";
donor10.website = "franstrade.com";
donor10.company = "Franstrade";
donor10.telephone = "0735113439";
donor10.save();

var donor11 = new database.Donor();
donor11.name = "Akash Singh";
donor11.email = "akash.singh@bytes.com";
donor11.street = "11 Here Street, Pretoria";
donor11.website = "bytes.com";
donor11.company = "Bytes";
donor11.telephone = "0735658427";
donor11.save();

var donor12 = new database.Donor();
donor12.name = "Joe Van Wyk";
donor12.email = "joevw@bytes.com";
donor12.street = "11 Here Street, Pretoria";
donor12.website = "bytes.com";
donor12.company = "Bytes";
donor12.telephone = "073968720";
donor12.save();


var donor13 = new database.Donor();
donor13.name = "Ernest Jan";
donor13.email = "ernestj@ernestandjan.com";
donor13.street = "11 Clown Road, Johannesburg";
donor13.website = "eandj.com";
donor13.company = "Ernest & Jan";
donor13.telephone = "0835658737";
donor13.save();

var donor14 = new database.Donor();
donor14.name = "Danie Nolan";
donor14.email = "danie.no@metro.com";
donor14.street = "14 Hollard Street, Johannesburg";
donor14.website = "metro.com";
donor14.company = "Metro Trading";
donor14.telephone = "0735158251";
donor14.save();

// Add groups
var group1 = new database.Group();
group1.name = "Pretoria";
group1.description = "All donors in the Pretoria area";
group1.donors = [donor1, donor3];
group1.user = user1;
group1.save();

var group2 = new database.Group();
group2.name = "Corporations";
group2.description = "All donors that are corporations";
group2.donors = [donor2, donor3, donor4, donor11];
group2.user = user1;
group2.save();

var group3 = new database.Group();
group3.name = "Regulars";
group3.description = "Donors who donate on a monthly basis";
group3.donors = [donor2, donor3, donor12, donor5, donor9];
group3.user = user1;
group3.save();

var group4 = new database.Group();
group4.name = "Johannesburg";
group4.description = "All donors in the Pretoria area";
group4.donors = [donor8, donor3, donor7, donor10];
group4.user = user1;
group4.save();

var group5 = new database.Group();
group5.name = "Christmas Donations";
group5.description = "All donors who have donated Christmas gifts";
group5.donors = [donor8, donor6, donor14, donor13];
group5.user = user1;
group5.save();

// Add remarks
var remark1 = new database.Remark();
remark1.name = "Phone for more funding";
remark1.text = "They might have money availabile beginning of December 2011";
remark1.date = new Date();
remark1.target = donor1;
remark1.user = user1;
remark1.save();

donor1.remarks = [remark1];

var remark2 = new database.Remark();
remark2.name = "Collect clothing";
remark2.text = "We need to go and collect clothing from this company next week Monday (12 December 2011)";
remark2.date = new Date();
remark2.target = donor2;
remark2.user = user1;
remark2.save();

donor2.remarks = [remark2];

var remark3 = new database.Remark();
remark3.name = "Collect clothing";
remark3.text = "This collection date needs to be moved to Tuesday (13 December 2011)";
remark3.date = new Date();
remark3.target = donor2;
remark3.user = user1;
remark3.save();

donor2.remarks = [remark3];

var remark4 = new database.Remark();
remark4.name = "Postpone request";
remark4.text = "Call this company next year Februrary (2012) for donations.";
remark4.date = new Date();
remark4.target = donor3;
remark4.user = user1;
remark4.save();

donor3.remarks = [remark4];

var remark5 = new database.Remark();
remark5.name = "Monthly donations";
remark5.text = "This company would like to be reminded monthly to submit donations";
remark5.date = new Date();
remark5.target = donor4;
remark5.user = user1;
remark5.save();

donor4.remarks = [remark5];

var remark6 = new database.Remark();
remark6.name = "Send thank you note";
remark6.text = "Send this company a thank you note for all of their donations.";
remark6.date = new Date();
remark6.target = donor5;
remark6.user = user1;
remark6.save();

donor5.remarks = [remark6];

var remark7 = new database.Remark();
remark7.name = "Send thank you note";
remark7.text = "Send this company a thank you note for all of their donations.";
remark7.date = new Date();
remark7.target = donor6;
remark7.user = user1;
remark7.save();

donor6.remarks = [remark7];

var remark8 = new database.Remark();
remark8.name = "Ask for promised donations";
remark8.text = "This donor promised to donate but they have not and its a month later";
remark8.date = new Date();
remark8.target = donor7;
remark8.user = user1;
remark8.save();

donor7.remarks = [remark8];

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

var request3 = new database.DonationRequest();
request3.name = "Requests for christmas donations";
request3.donors = [];
request3.groups = [group3];
request3.message = "Would you be so kind as to donate gifts for out children so that they may have a merry christmas.";
request3.sendDate = new Date();
request3.subject = "Christmas Donations";
request3.save();

var request4 = new database.DonationRequest();
request4.name = "Requests for boys clothing";
request4.donors = [];
request4.groups = [group3, group1, group2, group4, group5];
request4.message = "Would you be so kind as to donate clothes for our boys between the age of 2 and 14.";
request4.sendDate = new Date();
request4.subject = "Boys Clothing Donations";
request4.save();

var request5 = new database.DonationRequest();
request5.name = "Requests for girls clothing";
request5.donors = [];
request5.groups = [group3, group1, group2, group4, group5];
request5.message = "Would you be so kind as to donate clothes for our girls between the age of 2 and 14.";
request5.sendDate = new Date();
request5.subject = "Girls Clothing Donations";
request5.save();

console.log("Database seeded");

database.disconnect();
