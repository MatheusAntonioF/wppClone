const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
	},
	last_seen: {
		type: Date,
		default: Date.now()
	}
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
