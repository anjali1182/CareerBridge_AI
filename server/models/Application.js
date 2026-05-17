const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, enum: ['applied', 'shortlisted', 'rejected'], default: 'applied' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
