const User = require('../models/User');
const Job = require('../models/Job');

const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

const removeUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUsers, removeUser };
