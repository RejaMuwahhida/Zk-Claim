const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  did: { type: String, required: true, unique: true },
  diseases: [
    {
      disease_name: { type: String, required: true },
      diagnosed_date: { type: Date, required: true },
      treatment_status: { type: String, required: true }
    }
  ]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;