var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

mongoose.connect( process.env.MONGOHQ_URL || 'mongodb://localhost/donorManagementSystem');

exports.disconnect = function() {
	mongoose.disconnect();
}

var UserSchema = new Schema({
	name : String,
	email: String,
	username : String,
	password: String,
});
exports.UserSchema = UserSchema;

var RemarkSchema = new Schema({
	text : String,
	date : Date,
	user : ObjectId
});
exports.RemarkSchema = RemarkSchema;

var DonorSchema = new Schema({
	name : String,
	email: String,
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


exports.Donor = mongoose.model('donors', DonorSchema);
exports.User = mongoose.model('users', UserSchema);
exports.Group = mongoose.model('groups', GroupSchema);
