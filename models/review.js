const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  rating:{
    type: Number,
    required: true
  },

  type:[{
    references: [{
      modelType: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        enum: ['patient', 'doctor']
      },
      objectId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'references.modelType'
      }
    }]
  }],
  institution:[{
    type: Schema.Types.ObjectId,
    ref: 'institution'
  }]
});

module.exports = mongoose.model('review', reviewSchema);
