const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  speciality: {
    type: String,
    required: true
  },
  certifications: {
    type: [String],
    required: true
  },
  availability: {
    type: [],
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  review:[{
    type: Schema.Types.ObjectId,
    ref: "review"
  }]
});

module.exports = mongoose.model('doctor', doctorSchema);