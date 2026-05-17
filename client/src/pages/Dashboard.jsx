import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getJobs, getApplications, recommendCareer } from '../services/jobService';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: jobsData }, { data: applicationsData }, { data: recommendationData }] = await Promise.all([
          getJobs({ limit: 6 }),
          getApplications(),
          recommendCareer({ skills: user.skills || [], branch: user.branch, cgpa: user.cgpa || 0, interests: [] }),
        ]);
        setJobs(jobsData);
        setApplications(applicationsData);
        setRecommendations(recommendationData.recommendations.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <h2 className="text-3xl font-semibold text-white">Welcome back, {user.name.split(' ')[0]}</h2>
            <p className="mt-2 text-slate-400">Review eligibility, recommended roles, and your recent applications in one place.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Saved</p>
                <p className="mt-4 text-3xl font-semibold text-white">{user.savedJobs?.length || 0}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Applied</p>
                <p className="mt-4 text-3xl font-semibold text-white">{applications.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <h3 className="text-xl font-semibold text-white">Profile snapshot</h3>
            <div className="mt-6 space-y-3 text-slate-300">
              <p><span className="font-semibold text-slate-100">College:</span> {user.college || 'N/A'}</p>
              <p><span className="font-semibold text-slate-100">Branch:</span> {user.branch || 'N/A'}</p>
              <p><span className="font-semibold text-slate-100">CGPA:</span> {user.cgpa || '0.0'}</p>
              <p><span className="font-semibold text-slate-100">Skills:</span> {user.skills?.join(', ') || 'Empty'}</p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
          <h3 className="text-2xl font-semibold text-white">Recommended jobs</h3>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {recommendations.length ? recommendations.map(({ job, score }) => (
                <div key={job._id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xl font-semibold text-white">{job.role}</h4>
                      <p className="text-slate-400">{job.companyName}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-sky-400">{score}% match</span>
                  </div>
                </div>
              )) : <p className="mt-4 text-slate-400">No recommendations available yet.</p>}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-white">Latest jobs</h3>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-3">{jobs.map((job) => <JobCard key={job._id} job={job} />)}</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
