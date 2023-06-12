const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const institutionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  insurance:{
    type:[String],
  },
  email:{
    type:String
  },
  doctors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'doctor'
    }
  ],
  patients: [
    {
      type: Schema.Types.ObjectId,
      ref: 'patient'
    }
  ],
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: 'patient'
    }
  ]
});

module.exports = mongoose.model('institution', institutionSchema);