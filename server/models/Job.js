const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    type: { type: String, enum: ['Govt', 'MNC'], required: true },
    eligibility: { type: String },
    skillsRequired: [{ type: String }],
    salary: { type: String },
    syllabus: { type: String },
    officialLink: { type: String },
    deadline: { type: String },
    ageLimit: { type: String },
    examPattern: { type: String },
    hiringCriteria: { type: String },
    interviewRounds: { type: String },
    dsaTopics: { type: String },
    aptitudeTopics: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
