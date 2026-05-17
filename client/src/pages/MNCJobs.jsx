import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import { getJobs } from '../services/jobService';
import LoadingSpinner from '../components/LoadingSpinner';

const companies = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Deloitte'];

const MNCJobs = () => {
  const [mncJobs, setMncJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getJobs({ type: 'MNC' });
        setMncJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
          <h1 className="text-3xl font-semibold text-white">MNC Jobs</h1>
          <p className="mt-2 text-slate-400">Browse top corporate openings from the world’s leading employers.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {companies.map((company) => (
              <span key={company} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">{company}</span>
            ))}
          </div>
        </div>

        <section className="mt-8">
          {loading ? <LoadingSpinner /> : <div className="grid gap-6 lg:grid-cols-3">{mncJobs.map((job) => <JobCard key={job._id} job={job} />)}</div>}
        </section>
      </main>
    </div>
  );
};

export default MNCJobs;
