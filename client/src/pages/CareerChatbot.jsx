import { useContext, useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { getChatStatus, sendChatMessage } from '../services/jobService';

const quickPrompts = [
  'how are you?',
  'Resume tips do',
  'DSA ka plan batao',
  'Govt job vs MNC?',
  'Interview kaise prepare karu?',
];

const CareerChatbot = () => {
  const { user } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState({ ai: false, label: 'Loading...', provider: 'rules' });
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    getChatStatus()
      .then(({ data }) => setChatStatus(data))
      .catch(() => setChatStatus({ ai: false, label: 'Built-in', provider: 'rules' }));
  }, []);

  useEffect(() => {
    if (messages.length) return;
    const name = user?.name?.split(' ')[0] || 'there';
    setMessages([
      {
        role: 'assistant',
        text: chatStatus.ai
          ? `Hi ${name}! Main ChatGPT jaisa assistant hoon — koi bhi sawal pucho, context yaad rakhunga.`
          : `Hi ${name}! AI mode off hai. FREE key: server folder mein scripts\\setup-ai-chat.ps1 chalao, ya .env mein GROQ_API_KEY lagao.`,
      },
    ]);
  }, [chatStatus.ai, user?.name, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const pushReply = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', text: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const history = nextMessages.map((m) => ({ role: m.role, text: m.text }));
      const { data } = await sendChatMessage(trimmed, history.slice(0, -1));
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      const fallback =
        err.response?.status === 401
          ? 'Session expire — dubara login karo.'
          : err.response?.data?.message ||
            'Server connect nahi hua. Backend port 5000 chalu karo.';
      setMessages((prev) => [...prev, { role: 'assistant', text: fallback }]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    pushReply(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      pushReply(input);
    }
  };

  const clearChat = () => {
    const name = user?.name?.split(' ')[0] || 'there';
    setMessages([
      {
        role: 'assistant',
        text: chatStatus.ai
          ? `Chat clear ho gayi, ${name}. Naya sawal pucho!`
          : `Chat clear. AI ke liye GROQ_API_KEY (free) ya OPENAI_API_KEY .env mein lagao.`,
      },
    ]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Career Chat</h1>
            <p className="text-sm text-slate-400">ChatGPT-style — conversation yaad rakhta hai</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              chatStatus.ai ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}
          >
            {chatStatus.label || (chatStatus.ai ? 'AI ON' : 'Built-in')}
          </span>
        </div>

        {!chatStatus.ai && (
          <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <strong>1 minute setup (FREE):</strong> Groq key —{' '}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 underline"
            >
              console.groq.com/keys
            </a>{' '}
            → copy key → <code className="text-amber-100">server/.env</code> →{' '}
            <code className="text-amber-100">GROQ_API_KEY=gsk_...</code> → server restart
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-glow">
          <div className="flex flex-wrap gap-2 border-b border-slate-800 p-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => pushReply(prompt)}
                disabled={loading}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-sky-500 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
            <button
              type="button"
              onClick={clearChat}
              className="ml-auto rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-red-500/50 hover:text-red-300"
            >
              Clear chat
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4" style={{ minHeight: '22rem', maxHeight: 'calc(100vh - 20rem)' }}>
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <div key={`${index}-${message.text.slice(0, 8)}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                      isUser
                        ? 'bg-sky-500 text-slate-950'
                        : 'border border-slate-700 bg-slate-950 text-slate-200'
                    }`}
                  >
                    {!isUser && (
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-sky-400">
                        CareerBridge AI
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-400">
                  <span className="inline-flex gap-1">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse delay-75">●</span>
                    <span className="animate-pulse delay-150">●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-800 p-3">
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={chatStatus.ai ? 'Message CareerBridge AI...' : 'Ask anything (built-in mode)...'}
                disabled={loading}
                className="min-h-[3rem] flex-1 resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="self-end rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-500">Enter send · Shift+Enter new line</p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CareerChatbot;
