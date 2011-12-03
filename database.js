var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/donorManagementSystem');

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
	user: {type: Schema.ObjectId, ref: 'User'}
});
exports.DonorSchema = DonorSchema;

var GroupSchema = new Schema({
	user : {type: Schema.ObjectId, ref: 'User'},
	name : String,
	description : String,
	donors : [{type: Schema.ObjectId, ref: 'Donor'}],
	rules : String // TODO: Create some format for rules
});
exports.GroupSchema = GroupSchema;

var DonationSchema = new Schema({
	amount : Number,
	date : Date,
	donor : {type: Schema.ObjectId, ref: 'Donor'}, // DonorSchema
	remark : ObjectId, // RemarkSchema
	user : {type: Schema.ObjectId, ref: 'User'} // UserSchema
});
exports.DonationSchema = DonationSchema;

var DonationRequestSchema = new Schema({
	name : String,
	donors : [{type: Schema.ObjectId, ref: 'Donor'}],
	groups : [{type: Schema.ObjectId, ref: 'Group'}],
	message : String, // TODO: Handle pictures etc.
 	sentDate : Date,
 	subject : String,
 	user : {type: Schema.ObjectId, ref: 'User'} // UserSchema
});
exports.DonationRequestSchema = DonationRequestSchema;


exports.Donor = mongoose.model('donors', DonorSchema);
exports.User = mongoose.model('users', UserSchema);
exports.Group = mongoose.model('groups', GroupSchema);
exports.DonationRequest = mongoose.model('requests', DonationRequestSchema);
