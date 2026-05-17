import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),_transparent_30%)]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-glow backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-sky-400">CareerBridge AI</p>
              <h1 className="mt-6 text-5xl font-bold text-white sm:text-6xl">Smart career guidance for students, powered by AI.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Explore government and MNC jobs, check eligibility, analyze your resume, and receive skill-based recommendations in one intelligent portal.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Get Started</Link>
                <Link to="/dashboard" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-sky-500">Dashboard</Link>
                <Link to="/govt-jobs" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-sky-500">Govt Jobs</Link>
                <Link to="/mnc-jobs" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-sky-500">MNC Jobs</Link>
                <Link to="/eligibility" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-sky-500">Eligibility</Link>
                <Link to="/resume-analyzer" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-sky-500">Resume Analyzer</Link>
                <Link to="/chatbot" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-sky-500">Chatbot</Link>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-white">Featured capabilities</h2>
              <ul className="mt-6 space-y-4 text-slate-300">
                <li>• AI job matching with percentage score</li>
                <li>• Deep eligibility analysis for govt and MNC roles</li>
                <li>• Resume scoring, keyword suggestions, and skill gap insights</li>
                <li>• Admin job management and user tracking</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
