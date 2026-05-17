import { useState } from 'react';
import Navbar from '../components/Navbar';
import { analyzeResume } from '../services/jobService';

const ResumeAnalyzer = () => {
  const [skills, setSkills] = useState('DSA, Java, SQL');
  const [summary, setSummary] = useState('Experienced final year student with strong problem-solving and system design capabilities.');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = { skills: skills.split(',').map((skill) => skill.trim()).filter(Boolean), summary };
      const { data } = await analyzeResume(payload);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
          <h1 className="text-3xl font-semibold text-white">Resume Analyzer</h1>
          <p className="mt-2 text-slate-400">Upload your skills and summary to get a quick resume score and improvement suggestions.</p>
          <form onSubmit={handleAnalyze} className="mt-8 space-y-6">
            <label className="block text-sm text-slate-300">
              Skills (comma separated)
              <textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows="3" className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500" />
            </label>
            <label className="block text-sm text-slate-300">
              Summary / Resume extract
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows="4" className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500" />
            </label>
            <button type="submit" disabled={loading} className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{ loading ? 'Analyzing...' : 'Analyze Resume' }</button>
          </form>
          {result && (
            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <h2 className="text-2xl font-semibold text-white">Resume Results</h2>
              <p className="mt-3 text-slate-300">Score: <span className="font-semibold text-white">{result.score}%</span></p>
              <div className="mt-4 space-y-3 text-slate-300">
                <p><span className="font-semibold text-white">Missing keywords:</span> {result.missingKeywords.join(', ')}</p>
                <div>
                  <p className="font-semibold text-white">Suggestions:</p>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
                    {result.suggestions.map((suggestion, index) => (<li key={index}>{suggestion}</li>))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalyzer;
