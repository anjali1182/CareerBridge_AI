const User = require('../models/User');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    Object.assign(user, req.body);
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      college: updatedUser.college,
      branch: updatedUser.branch,
      cgpa: updatedUser.cgpa,
      skills: updatedUser.skills,
      backlog: updatedUser.backlog,
      graduationYear: updatedUser.graduationYear,
      resume: updatedUser.resume,
      role: updatedUser.role,
      savedJobs: updatedUser.savedJobs,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const saveJob = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (!user.savedJobs.includes(req.body.jobId)) {
      user.savedJobs.push(req.body.jobId);
      await user.save();
    }
    res.json(user.savedJobs);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getProfile, updateProfile, saveJob };
