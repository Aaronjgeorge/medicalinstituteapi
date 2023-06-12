const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type:String,
    required:true
  },
  age: {
    type: Number,
    required: true
  },
  ethnicity: {
    type: String,
    required: true
  },
  allergies: {
    type: [String],
    required: true
  },
  upcoming:{
    type:[],

  },
  previous:{
    type:[]
  },
  review:[{
    type: Schema.Types.ObjectId,
    ref: "review"
  }]
});

module.exports = mongoose.model('patient', patientSchema);