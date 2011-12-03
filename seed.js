var database = require('./database.js');

console.log("Seeding database...");

// Clear database
database.Donor.find({}).remove();

// Add donors
var donor1 = new database.Donor();
donor1.name = "Joe van Dyk";
donor1.email = "joe@anywhere.com";
donor1.address = "150 Eros Street, Pretoria";
donor1.website = "joevandyk.com";
donor1.save();

var donor2 = new database.Donor();
donor2.name = "Harry Smith";
donor2.email = "harry@somewhere.com";
donor2.address = "257 Smith Street, Johannesburg";
donor2.website = "greendesigns.co.za";
donor2.save();

console.log("Database seeded");

database.disconnect();
