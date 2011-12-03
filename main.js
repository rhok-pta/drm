
var _ = require('underscore')
var mongoose = require('mongoose');
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/donorManagementSystem');

var PersonSchema = new Schema({
	name : String,
	email: String
});

var UserSchema = new Schema({
	username : String,
	password: String
});

_.extend(UserSchema, PersonSchema);

var RemarkSchema = new Schema({
	text : String,
	date : Date,
	user : ObjectId
});

var DonorSchema = new Schema({
	company : ObjectId,
	address : String, // FIXME: Possible separate object
	personalInterests : String,
	telephone : String,
	birthday : Date,
	website : String,
	donationDates : [Date],
	conversationFlow : [ObjectId], // FIXME: Check me
	remarks: [RemarkSchema],
	user: ObjectId
});

var GroupSchema = new Schema({
	user : ObjectId,
	name : String,
	description : String,
	donors : [DonorSchema],
	rules : String // TODO: Create some format for rules
});

var DonationSchema = new Schema({
	amount : Number,
	date : Date,
	donar : ObjectId, // DonorSchema
	remark : ObjectId, // RemarkSchema
	user : ObjectId // UserSchema
});

var DonationRequest = new Schema({
	name : String,
	donors : [DonorSchema],
	groups : [GroupSchema],
	message : String, // TODO: Handle pictures etc.
 	sentDate : Date,
 	subject : String,
 	user : ObjectId // UserSchema
});

_.extend(DonorSchema, PersonSchema);

var donors = mongoose.model('donors', DonorSchema);
var users = mongoose.model('users', UserSchema);

console.log("Running");
