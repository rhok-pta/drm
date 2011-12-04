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
  widgets: [String],
});
exports.UserSchema = UserSchema;

var RemarkSchema = new Schema({
  name : String,
  text : String,
  date : Date,
  user : {type: ObjectId, ref: 'users'}
});
exports.RemarkSchema = RemarkSchema;

var PostSchema = new Schema({
  date : Date,
  name : String,
  user : {type: ObjectId, ref: 'users'},
  medium : String,
  message : String
});

var DonorSchema = new Schema({
  name : { type: String, required: true },
  email: { type: String, required: false },
  company : String,
  street : String, 
  town : String,  
  zipcode : String,   
  country : String,   
  personalInterests : String,
  telephone : String,
  birthday : Date,
  website : String,
  donationDates : [Date], // TODO: Allow for ranges
  communicationLog : [{type: ObjectId, ref: 'posts'}],
  remarks: [{type: ObjectId, ref: 'remarks'}],
  user: {type: ObjectId, ref: 'users'}
});
exports.DonorSchema = DonorSchema;

var GroupSchema = new Schema({
  user : {type: ObjectId, ref: 'users'},
  name : String,
  description : String,
  donors : [{type: ObjectId, ref: 'donors'}],
  rules : String // TODO: Create some format for rules
});
exports.GroupSchema = GroupSchema;

var DonationSchema = new Schema({
  amount : Number,
  date : Date,
  donor : {type: ObjectId, ref: 'donors'}, // DonorSchema
  remark : {type: ObjectId, ref: 'remarks'}, // RemarkSchema
  user : {type: ObjectId, ref: 'users'} // UserSchema
});
exports.DonationSchema = DonationSchema;

var DonationRequestSchema = new Schema({
  name : String,
  donors : [{type: ObjectId, ref: 'donors'}],
  groups : [{type: ObjectId, ref: 'groups'}],
  message : String, // TODO: Handle pictures etc.
   sentDate : Date,
   subject : String,
   user : {type: ObjectId, ref: 'users'} // UserSchema
});
exports.DonationRequestSchema = DonationRequestSchema;

exports.Remark = mongoose.model('remarks', RemarkSchema);
exports.Post = mongoose.model('posts', PostSchema);
exports.Donor = mongoose.model('donors', DonorSchema);
exports.User = mongoose.model('users', UserSchema);
exports.Group = mongoose.model('groups', GroupSchema);
exports.DonationRequest = mongoose.model('requests', DonationRequestSchema);
