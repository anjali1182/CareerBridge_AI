const createContext = (user = {}) => ({
  name: user.name?.split(' ')[0] || 'there',
  skills: user.skills?.length ? user.skills.join(', ') : 'Java, DSA, projects',
  branch: user.branch || 'your branch',
  cgpa: user.cgpa ?? 'N/A',
  college: user.college || 'your college',
});

/** @type {{ test: (q: string, ctx: object) => boolean, reply: (ctx: object) => string, priority?: number }[]} */
const INTENTS = [
  {
    priority: 100,
    test: (q) => /how are you|how r u|how're you|kaise ho|kaisa hai|kya haal|how do you do/.test(q),
    reply: (c) => `Main theek hoon, ${c.name}! Aap batao — career, jobs, ya interview mein kya help chahiye?`,
  },
  {
    priority: 95,
    test: (q) => /^(thanks|thank you|dhanyavad|shukriya)\b/.test(q),
    reply: () => 'Welcome! Aur koi career sawal ho to pucho.',
  },
  {
    priority: 95,
    test: (q) => /^(bye|goodbye|see you|alvida)\b/.test(q),
    reply: (c) => `Bye ${c.name}! Placement prep ke liye kabhi bhi wapas aana.`,
  },
  {
    priority: 90,
    test: (q) => /who are you|what are you|tum kaun|aap kaun/.test(q),
    reply: () => 'Main CareerBridge AI hoon — students ke liye jobs, resume, aur career guidance.',
  },
  {
    priority: 85,
    test: (q) => /^(hi|hello|hey|namaste|hii)\b/.test(q),
    reply: (c) => `Hi ${c.name}! Career, resume, govt/MNC jobs, aur interview prep mein help kar sakta hoon.`,
  },
  {
    priority: 80,
    test: (q) => /confus|lost|samajh nahi|kya karu|what should i do|guide me|help me choose/.test(q),
    reply: (c) =>
      `${c.name}, pehle goal fix karo: Govt job, MNC IT, ya higher studies. Phir Eligibility + recommended jobs dekho. Roz 2 ghante focused study.`,
  },
  {
    priority: 75,
    test: (q) => /tell me about yourself|introduce yourself|self introduction/.test(q),
    reply: (c) =>
      `Interview intro (30 sec): "I am ${c.name}, ${c.branch} student at ${c.college}, CGPA ${c.cgpa}. Skills: ${c.skills}. Recently I built [project] using [tech]."`,
  },
  {
    priority: 70,
    test: (q) => /resume|cv|biodata/.test(q),
    reply: () =>
      'Resume 1 page: contact, education, skills, 2 projects, internship. Action words use karo. Tech role ke liye GitHub + DSA likho.',
  },
  {
    priority: 70,
    test: (q) => /linkedin|github|portfolio/.test(q),
    reply: () =>
      'LinkedIn: professional photo + headline + projects. GitHub: 2-3 clean repos with README. Dono resume par link karo.',
  },
  {
    priority: 70,
    test: (q) => /internship|intern\b/.test(q),
    reply: (c) =>
      `Internship: ${c.branch} students LinkedIn, college TPO, aur company career pages check karo. Small project + resume ready rakho.`,
  },
  {
    priority: 68,
    test: (q) => /project idea|project\b|build what/.test(q),
    reply: (c) =>
      `${c.skills} use karke banao: Job Portal, Resume Analyzer, ya E-commerce mini app. Full stack ya ${c.branch} related topic best hai.`,
  },
  {
    priority: 65,
    test: (q) => /govt|government|upsc|ssc|railway|banking|defence|psu/.test(q),
    reply: () =>
      'Govt: Govt Jobs page → role chuno → syllabus + age limit padho. Daily GK, aptitude, previous papers. Long-term plan chahiye.',
  },
  {
    priority: 65,
    test: (q) => /mnc|tcs|infosys|wipro|accenture|google|microsoft|amazon|deloitte|placement|campus/.test(q),
    reply: () =>
      'MNC: DSA daily + aptitude + core subjects. MNC Jobs page se company dekho. Mock interviews aur resume tailor karo.',
  },
  {
    priority: 64,
    test: (q) => /dsa|data structure|leetcode|hackerrank|coding practice/.test(q),
    reply: () =>
      'DSA order: Arrays → HashMap → Trees → Graphs → DP. Roz 1 easy + 1 medium, 45 din streak. Striver A2Z ya NeetCode 150.',
  },
  {
    priority: 64,
    test: (q) => /aptitude|quant|reasoning|english grammar/.test(q),
    reply: () =>
      'Aptitude: percentages, ratios, time-work, puzzles daily 30 min. English: 1 article padho + 5 new words. Placement dono chahiye.',
  },
  {
    priority: 63,
    test: (q) => /interview|hr round|technical round/.test(q),
    reply: () =>
      'Interview: JD padho, 2 projects deep, STAR format (Situation-Task-Action-Result). HR: strengths, weakness (real + fix), why this company.',
  },
  {
    priority: 62,
    test: (q) => /reject|rejection|fail|failed|nahi hua/.test(q),
    reply: (c) =>
      `${c.name}, rejection normal hai. Gap analysis karo — skills weak the ya practice kam. 2 week targeted improve, phir dubara apply.`,
  },
  {
    priority: 60,
    test: (q) => /\bcgpa\b|\bgpa\b|low marks|percentage/.test(q),
    reply: (c) =>
      `Aapka CGPA ${c.cgpa}. 7+ achha; kam ho to projects + internships + skills se compensate. Honest resume, fake mat likho.`,
  },
  {
    priority: 60,
    test: (q) => /backlog|kt\b|supplementary/.test(q),
    reply: () => 'Backlog pehle clear karo. Companies ka backlog limit check karo. Saath mein 1 skill + 1 project chalu rakho.',
  },
  {
    priority: 58,
    test: (q) => /salary|package|lpa|ctc|stipend/.test(q),
    reply: () =>
      'Salary role, city, company par depend karti hai. Fresher IT: often 3-12 LPA range (company wise). Govt: pay scale fixed hota hai.',
  },
  {
    priority: 58,
    test: (q) => /eligib|eligible|match percent/.test(q),
    reply: () => 'Eligibility page: profile ke hisaab se match %. Skills update + CGPA sahi rakho score badhane ke liye.',
  },
  {
    priority: 57,
    test: (q) => /apply|application|form fill/.test(q),
    reply: () => 'Job card → Explore → detail → Apply. Pehle eligibility check. Same job dubara apply mat karo.',
  },
  {
    priority: 55,
    test: (q) => /\bskills?\b|skill gap|kya seekhu|what to learn/.test(q),
    reply: (c) =>
      `Aapke skills: ${c.skills}. Ek nayi skill add karo (e.g. React/Cloud). Har skill par 1 chhota project — Eligibility score badhega.`,
  },
  {
    priority: 54,
    test: (q) => /python|java\b|javascript|react|node|full stack|web dev/.test(q),
    reply: (c) =>
      `Tech stack: ${c.branch} ke liye core + 1 framework. Web: HTML/CSS/JS → React → Node. Roz code likho, sirf video mat dekho.`,
  },
  {
    priority: 54,
    test: (q) => /data science|machine learning|ai\b|ml\b|deep learning/.test(q),
    reply: () =>
      'AI/ML path: Python → Statistics → ML basics → 1 Kaggle project. Pehle strong Python + maths, phir specialization.',
  },
  {
    priority: 53,
    test: (q) => /cloud|aws|azure|devops|docker|kubernetes/.test(q),
    reply: () => 'Cloud: Linux basics → AWS free tier → deploy 1 project. Certification optional; hands-on project zyada important.',
  },
  {
    priority: 52,
    test: (q) => /m\.?tech|ms\b|mba|higher studies|abroad|gre|gate\b/.test(q),
    reply: (c) =>
      `Higher studies: GATE (India PG), GRE (abroad). CGPA ${c.cgpa} — top colleges ke liye 8+ helpful. Decide early: job vs PG.`,
  },
  {
    priority: 50,
    test: (q) => /final year|third year|2nd year|1st year|college year/.test(q),
    reply: (c) =>
      `${c.branch} student: 1st-2nd year → basics + DSA start. 3rd → projects + internship. Final → placements + revisions.`,
  },
  {
    priority: 48,
    test: (q) => /time table|daily routine|schedule|roz kya karu/.test(q),
    reply: () =>
      'Daily: 2h DSA + 1h core subject + 1h project/aptitude. Sunday revision. Phone kam, consistency zyada.',
  },
  {
    priority: 47,
    test: (q) => /certification|certificate|course\b|udemy|coursera/.test(q),
    reply: () =>
      '1-2 relevant certificates OK (AWS, Java). Zyada certificates spam lagti hain. Project + skills proof zyada matter karti hai.',
  },
  {
    priority: 45,
    test: (q) => /motivat|tension|stress|pressure|parents|depress/.test(q),
    reply: (c) =>
      `${c.name}, compare kam karo — apna pace rakho. Chhote goals (weekly) banao. Health + sleep theek rakho. Career marathon hai, sprint nahi.`,
  },
  {
    priority: 44,
    test: (q) => /startup|business|entrepreneur|khud ka kaam/.test(q),
    reply: () =>
      'Startup: pehle 1 real problem solve karo, MVP banao, users se baat karo. Job experience bhi valuable hai pehle.',
  },
  {
    priority: 42,
    test: (q) => /govt.*private|private.*govt|which is better/.test(q),
    reply: () =>
      'Govt = stability + exams. Private/MNC = growth + skills. Apna risk appetite aur family situation se choose karo.',
  },
  {
    priority: 40,
    test: (q) => /\bbranch\b/.test(q) || /\b(cse|it|ece|eee|mech|civil)\b/.test(q),
    reply: (c) =>
      `${c.branch}: core subjects strong + 2 projects + internship. ${c.college} ke TPO notices bhi follow karo.`,
  },
  {
    priority: 35,
    test: (q) => /what is|what's|explain|meaning of|kya hota|kya hai/.test(q),
    reply: () =>
      'Specific term likho — jaise "what is DSA", "what is eligibility". Main us par short answer dunga.',
  },
  {
    priority: 30,
    test: (q) => /help|kya kar sakte|what can you|features/.test(q),
    reply: () =>
      'Main bata sakta hoon: resume, DSA plan, govt/MNC jobs, interview, CGPA, projects, internship, eligibility. Topic naam likho.',
  },
];

/** Keyword FAQ — scores by matched keyword count */
const FAQ = [
  { keys: ['oops', 'object oriented'], a: 'OOPS: classes, inheritance, polymorphism — interviews mein examples ready rakho.' },
  { keys: ['dbms', 'sql', 'database'], a: 'DBMS: normalization, joins, indexing. SQL practice: 5 queries daily.' },
  { keys: ['os', 'operating system'], a: 'OS: processes, threads, deadlock, memory — GATE/placement dono mein aata hai.' },
  { keys: ['cn', 'network', 'computer network'], a: 'CN: OSI model, TCP/IP, HTTP — system design basics ke liye useful.' },
  { keys: ['hr', 'tell me weakness'], a: 'Weakness real batao + kaise improve kar rahe ho. Fake weakness mat do.' },
  { keys: ['group discussion', 'gd round'], a: 'GD: listen first, 2-3 valid points, calm tone, facts > loud voice.' },
  { keys: ['gap year', 'drop year'], a: 'Gap honest explain karo — us time skills/courses/projects kya kiye, wo dikhao.' },
  { keys: ['fresher', 'no experience'], a: 'Fresher: projects + internships + hackathons experience ki jagah le sakte hain.' },
  { keys: ['remote', 'work from home', 'wfh'], a: 'Remote roles badh rahe hain — communication + self discipline strong honi chahiye.' },
  { keys: ['bond', 'service agreement'], a: 'Bond padh kar sign karo — duration, penalty, location clause check karo.' },
  { keys: ['offer letter', 'joining'], a: 'Offer: CTC breakdown, probation, location, joining date confirm karo likhit mein.' },
  { keys: ['communication', 'english weak'], a: 'English: daily 15 min speak, 1 podcast, simple sentences. Fluency > fancy words.' },
  { keys: ['youtube', 'channel', 'resource'], a: 'Free resources: Striver (DSA), Apna College, Neso Academy. Roz 1 topic + practice.' },
  { keys: ['book', 'books'], a: 'DSA: Cracking Coding Interview. Aptitude: RS Aggarwal. Ek book repeat karo, 10 mat kholo.' },
  { keys: ['hackathon'], a: 'Hackathon: team + idea + demo. Win na ho to bhi resume point strong hota hai.' },
  { keys: ['non cs', 'non it', 'career change'], a: 'Non-CS → IT: Python + DSA + 2 projects + basics 6-12 month plan realistic hai.' },
  { keys: ['age limit', 'age'], a: 'Govt jobs ki age limit role wise hoti hai — job card par Age limit field dekho.' },
  { keys: ['syllabus'], a: 'Syllabus job card / detail page par hai. Topic list banao, weekly targets set karo.' },
  { keys: ['mock test', 'practice test'], a: 'Mock tests weekly — time limit ke saath. Galat questions notebook mein likho.' },
  { keys: ['chatbot', 'explore', 'dashboard'], a: 'Dashboard: overview. Govt/MNC Jobs: listings. Explore: job detail. Eligibility: match %.' },
];

const matchFAQ = (q) => {
  let best = { score: 0, answer: null };
  for (const item of FAQ) {
    let score = 0;
    for (const key of item.keys) {
      if (q.includes(key)) score += 1;
    }
    if (score > best.score) best = { score, answer: item.a };
  }
  return best.score >= 1 ? best.answer : null;
};

const buildCareerReply = (message, user = {}) => {
  const q = message.toLowerCase().trim().replace(/\s+/g, ' ');
  const ctx = createContext(user);

  if (!q) {
    return 'Kuch likh kar bhejo — main career, jobs, resume, DSA par help karunga.';
  }

  const sorted = [...INTENTS].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  for (const intent of sorted) {
    if (intent.test(q, ctx)) {
      return intent.reply(ctx);
    }
  }

  const faqAnswer = matchFAQ(q);
  if (faqAnswer) return faqAnswer;

  // Soft match: user asked something with "?" — acknowledge topic words
  const topicHints = [];
  if (/job|naukri|career/.test(q)) topicHints.push('jobs');
  if (/study|padhai|exam/.test(q)) topicHints.push('study plan');
  if (/company|office/.test(q)) topicHints.push('companies');
  if (topicHints.length) {
    return `${ctx.name}, ${topicHints.join(' + ')} par sawal thoda specific likho — example: "TCS ke liye kya prepare karu?"`;
  }

  return `${ctx.name}, ye sawal thoda unclear hai. Career se related pucho jaise: resume, DSA, govt job, MNC, interview, CGPA, project.`;
};

module.exports = { buildCareerReply };
