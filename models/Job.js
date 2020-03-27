const mongoose = require('mongoose');
const crypto = require('crypto');

//user schema
const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobsAppliedFor: { type: Array }
});

module.exports = mongoose.model('Job', jobSchema);
