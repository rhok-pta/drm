var _ = require('underscore')
var mongoose = require('mongoose');
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/donorManagementSystem');

exports.disconnect = function() {
	mongoose.disconnect();
}

var PersonSchema = new Schema({
	name : String,
	email: String
});

var UserSchema = new Schema({
	username : String,
	password: String
});
_.extend(UserSchema, PersonSchema);
exports.UserSchema = UserSchema;

var RemarkSchema = new Schema({
	text : String,
	date : Date,
	user : ObjectId
});
exports.RemarkSchema = RemarkSchema;

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
exports.DonorSchema = DonorSchema;

var GroupSchema = new Schema({
	user : ObjectId,
	name : String,
	description : String,
	donors : [DonorSchema],
	rules : String // TODO: Create some format for rules
});
exports.GroupSchema = GroupSchema;

var DonationSchema = new Schema({
	amount : Number,
	date : Date,
	donar : ObjectId, // DonorSchema
	remark : ObjectId, // RemarkSchema
	user : ObjectId // UserSchema
});
exports.DonationSchema = DonationSchema;

var DonationRequestSchema = new Schema({
	name : String,
	donors : [DonorSchema],
	groups : [GroupSchema],
	message : String, // TODO: Handle pictures etc.
 	sentDate : Date,
 	subject : String,
 	user : ObjectId // UserSchema
});
exports.DonationRequestSchema = DonationRequestSchema;

_.extend(DonorSchema, PersonSchema);

exports.Donor = mongoose.model('donors', DonorSchema);
exports.User = mongoose.model('users', UserSchema);
exports.Group = mongoose.model('groups', GroupSchema);
