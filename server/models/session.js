const mongoose = require('mongoose');

const { Schema } = mongoose;

const sessionSchema = new Schema({
  tg_id: { type: String, required: true },
  state: Object,
  createdAt: { type: Date, default: Date.now, expires: '12h' },
});

module.exports = mongoose.model('Session', sessionSchema);
