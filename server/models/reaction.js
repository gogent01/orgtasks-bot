const mongoose = require('mongoose');

const { Schema } = mongoose;

const reactionSchema = new Schema({
  left: { type: String, required: true },
  middle: { type: String, required: true },
  right: { type: String, required: true },
  theme: { type: String, required: true },
  kind: { type: String, required: true },
  difficulty: { type: Number },
  mechanism: { type: String },
  qualification: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reaction', reactionSchema);
