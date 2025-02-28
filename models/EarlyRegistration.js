const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EarlyRegistrationSchema = new Schema({
  fullname: {
    type: String,
    required: [true, 'İsim soyisim alanı zorunludur']
  },
  phone: {
    type: String,
    required: [true, 'İletişim numarası alanı zorunludur']
  },
  message: {
    type: String,
    required: [true, 'Mesaj alanı zorunludur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const EarlyRegistration = mongoose.model('EarlyRegistration', EarlyRegistrationSchema);
module.exports = EarlyRegistration; 