const { buildCareerReply } = require('./careerChat');

const isValidKey = (key, prefix) => {
  if (!key?.trim()) return false;
  if (/replace|your_|example|xxx|paste/i.test(key)) return false;
  return key.trim().startsWith(prefix);
};

const isOpenAIConfigured = () => isValidKey(process.env.OPENAI_API_KEY, 'sk-');
const isGroqConfigured = () => isValidKey(process.env.GROQ_API_KEY, 'gsk_');

const buildSystemPrompt = (user = {}) => {
  const name = user.name?.split(' ')[0] || 'student';
  const profileParts = [
    user.branch && `branch: ${user.branch}`,
    user.cgpa != null && `CGPA: ${user.cgpa}`,
    user.college && `college: ${user.college}`,
    user.skills?.length && `skills: ${user.skills.join(', ')}`,
  ].filter(Boolean);

  const profile = profileParts.length ? `${name} (${profileParts.join(', ')})` : name;

  return [
    'You are CareerBridge AI — like ChatGPT, but focused on helping Indian students.',
    'Reply in natural Hinglish (Hindi + English mix) unless the user writes fully in English.',
    'Be friendly, clear, and helpful for ANY question: career, studies, general knowledge, life advice, coding, etc.',
    'Remember the conversation context. Refer to earlier messages when relevant.',
    'Use short paragraphs. Use bullet points when listing steps.',
    'Do not invent fake job offers or guaranteed placements.',
    `Student profile: ${profile}.`,
  ].join(' ');
};

const normalizeHistory = (history = []) =>
  history
    .filter((m) => m && (m.content || m.text))
    .slice(-16)
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || m.text).trim(),
    }))
    .filter((m) => m.content);

const callChatCompletions = async ({ baseUrl, apiKey, model, messages }) => {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 800,
      temperature: 0.75,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    const error = new Error(`AI API error (${response.status})`);
    error.status = response.status;
    error.details = errBody;
    throw error;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
};

const getAIChatReply = async (message, user = {}, history = []) => {
  const system = buildSystemPrompt(user);
  const prior = normalizeHistory(history);
  const messages = [...[{ role: 'system', content: system }], ...prior, { role: 'user', content: message.trim() }];

  if (isOpenAIConfigured()) {
    const reply = await callChatCompletions({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
    });
    return { reply, provider: 'openai' };
  }

  if (isGroqConfigured()) {
    const reply = await callChatCompletions({
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages,
    });
    return { reply, provider: 'groq' };
  }

  return null;
};

const getChatProviderStatus = () => {
  if (isOpenAIConfigured()) {
    return { ai: true, provider: 'openai', label: 'ChatGPT (OpenAI)' };
  }
  if (isGroqConfigured()) {
    return { ai: true, provider: 'groq', label: 'AI Chat (Groq — free)' };
  }
  return {
    ai: false,
    provider: 'rules',
    label: 'Built-in',
    setupHint: 'Add OPENAI_API_KEY or free GROQ_API_KEY in server/.env',
  };
};

const getChatReply = async (message, user = {}, history = []) => {
  try {
    const ai = await getAIChatReply(message, user, history);
    if (ai?.reply) return ai;
  } catch (error) {
    console.error('AI chat failed:', error.message);
    if (error.status === 401) {
      const err = new Error('Invalid API key in server/.env');
      err.status = 503;
      throw err;
    }
  }

  return { reply: buildCareerReply(message, user), provider: 'rules' };
};

module.exports = {
  getChatReply,
  getChatProviderStatus,
  isOpenAIConfigured,
  isGroqConfigured,
};
