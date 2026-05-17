const Application = require('../models/Application');

const applyJob = async (req, res) => {
  const { jobId } = req.body;
  const exists = await Application.findOne({ userId: req.user._id, jobId });
  if (exists) {
    return res.status(400).json({ message: 'Already applied for this job' });
  }
  const application = await Application.create({ userId: req.user._id, jobId });
  res.status(201).json(application);
};

const getUserApplications = async (req, res) => {
  const applications = await Application.find({ userId: req.user._id }).populate('jobId');
  res.json(applications);
};

module.exports = { applyJob, getUserApplications };
