import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import { getJobs } from '../services/jobService';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ['UPSC', 'SSC', 'Railway', 'Banking', 'Defence', 'PSU'];

const GovernmentJobs = () => {
  const [governmentJobs, setGovernmentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getJobs({ type: 'Govt' });
        setGovernmentJobs(data);
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
          <h1 className="text-3xl font-semibold text-white">Government Jobs</h1>
          <p className="mt-2 text-slate-400">Explore central government recruitment categories and eligibility details.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span key={category} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">{category}</span>
            ))}
          </div>
        </div>

        <section className="mt-8">
          {loading ? <LoadingSpinner /> : <div className="grid gap-6 lg:grid-cols-3">{governmentJobs.map((job) => <JobCard key={job._id} job={job} />)}</div>}
        </section>
      </main>
    </div>
  );
};

export default GovernmentJobs;
