const mongoose = require('mongoose');

const userdataSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true, 
  },
  LastName: {
    type: String,
    required: true, 
  },
  EmailAddress: {
    type: String,
    required: true,
    unique: true, 
  },
  PhoneNumber: {
    type: String,
    required: true, 
  },
  City: {
    type: String,
    default: ''
  },
  Address: {
    type: String,
    default: ''
  },
  ZipCode: {
    type: String,
    default: ''
  },
  CountryOfResidence: {
    type: String,
    default: ''
  },
 
});
const Userdata = mongoose.model("Userdata", userdataSchema);

module.exports = Userdata;
