import { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { getJobs } from '../services/jobService';

const EligibilityChecker = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const computeMatch = (job) => {
    const skillMatch = job.skillsRequired.filter((item) => user.skills?.map((s) => s.toLowerCase()).includes(item.toLowerCase())).length;
    const percent = Math.min(100, Math.round((skillMatch / Math.max(job.skillsRequired.length, 1)) * 70 + (user.cgpa >= 8 ? 20 : user.cgpa >= 7 ? 12 : 6)));
    return percent;
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data } = await getJobs({});
      setJobs(data);
      setMatchResults(data.map((job) => ({ job, score: computeMatch(job), status: computeMatch(job) > 60 ? 'Eligible' : 'Needs Improvement' })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
          <h1 className="text-3xl font-semibold text-white">Smart Eligibility Checker</h1>
          <p className="mt-2 text-slate-400">Compare your profile against job criteria and see match percentages.</p>
          <button onClick={handleAnalyze} className="mt-6 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Analyze Eligibility</button>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
          {loading ? (
            <p className="text-slate-300">Analyzing jobs...</p>
          ) : matchResults.length ? (
            <div className="space-y-4">
              {matchResults.slice(0, 8).map(({ job, score, status }) => (
                <div key={job._id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{job.companyName} — {job.role}</h3>
                      <p className="text-sm text-slate-400">Eligibility: {job.eligibility}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm ${status === 'Eligible' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{status}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">Match: {score}%</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">Click analyze to compare your profile with active jobs.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default EligibilityChecker;
