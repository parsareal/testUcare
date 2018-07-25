var mongoose = require('mongoose');

var doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  }, 

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: Number,
    required: true
  },

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }

});

var Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = {Doctor};
