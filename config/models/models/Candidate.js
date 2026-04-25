const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  age: { type: Number, required: true },
  voteCount: { type: Number, default: 0 },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Stores IDs of voters who voted for this candidate
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
