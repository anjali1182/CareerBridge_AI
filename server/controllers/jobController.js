const Job = require('../models/Job');

const getJobs = async (req, res) => {
  const { type, company, search } = req.query;
  const filter = { status: 'active' };
  if (type) filter.type = type;
  if (company) filter.companyName = company;
  if (search) filter.$or = [
    { companyName: { $regex: search, $options: 'i' } },
    { role: { $regex: search, $options: 'i' } },
    { eligibility: { $regex: search, $options: 'i' } },
  ];
  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json(jobs);
};

const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) res.json(job);
  else res.status(404).json({ message: 'Job not found' });
};

const createJob = async (req, res) => {
  const job = new Job(req.body);
  const createdJob = await job.save();
  res.status(201).json(createdJob);
};

const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  Object.assign(job, req.body);
  const updatedJob = await job.save();
  res.json(updatedJob);
};

const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  await job.remove();
  res.json({ message: 'Job removed' });
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
