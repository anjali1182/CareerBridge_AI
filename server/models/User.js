const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String },
    college: { type: String },
    branch: { type: String },
    cgpa: { type: Number, default: 0 },
    skills: [{ type: String }],
    backlog: { type: Number, default: 0 },
    graduationYear: { type: Number },
    resume: { type: String },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
