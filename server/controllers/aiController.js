const Job = require('../models/Job');
const { getChatReply, getChatProviderStatus } = require('../utils/aiChatProvider');

const recommendCareer = async (req, res) => {
  const { skills = [], branch, cgpa, interests = [] } = req.body;
  const jobs = await Job.find({ status: 'active' });
  const parsedSkills = skills.map((skill) => skill.toLowerCase());
  const scored = jobs.map((job) => {
    const required = job.skillsRequired.map((skill) => skill.toLowerCase());
    const matchedSkills = required.filter((item) => parsedSkills.includes(item));
    const skillScore = required.length ? (matchedSkills.length / required.length) * 70 : 0;
    const cgpaScore = cgpa >= 8 ? 20 : cgpa >= 7 ? 12 : 6;
    const branchScore = branch && job.eligibility?.toLowerCase().includes(branch.toLowerCase()) ? 10 : 0;
    const score = Math.min(100, skillScore + cgpaScore + branchScore);
    const missingSkills = required.filter((item) => !parsedSkills.includes(item));
    return { job, score: Math.round(score), missingSkills };
  });
  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 8);
  res.json({ recommendations: sorted });
};

const analyzeResume = async (req, res) => {
  const { skills = [], summary = '' } = req.body;
  const score = Math.min(100, skills.length * 10 + (summary ? 10 : 0));
  const suggestions = [];
  if (skills.length < 4) suggestions.push('Add more technical skills and tools in your resume.');
  if (!summary) suggestions.push('Write a strong objective or summary section.');
  if (!skills.includes('DSA')) suggestions.push('Include DSA and algorithm skills for technical job matching.');
  res.json({ score, suggestions, missingKeywords: ['Leadership', 'Problem Solving', 'Teamwork'] });
};

const chatCareer = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const { reply, provider } = await getChatReply(message, req.user || {}, history);
    res.json({ reply, source: provider });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Chat failed',
    });
  }
};

const getChatStatus = async (req, res) => {
  const status = getChatProviderStatus();
  res.json({
    openai: status.provider === 'openai',
    ai: status.ai,
    provider: status.provider,
    label: status.label,
    setupHint: status.setupHint,
  });
};

module.exports = { recommendCareer, analyzeResume, chatCareer, getChatStatus };
