import { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getJobs, createJob, updateJob, deleteJob } from '../services/jobService';

const defaultJobState = {
  companyName: '',
  role: '',
  type: 'MNC',
  eligibility: '',
  skillsRequired: '',
  salary: '',
  syllabus: '',
  deadline: '',
  ageLimit: '',
  examPattern: '',
  hiringCriteria: '',
  interviewRounds: '',
  dsaTopics: '',
  aptitudeTopics: '',
};

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobForm, setJobForm] = useState(defaultJobState);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [userRes, jobRes] = await Promise.all([api.get('/admin/users'), getJobs({})]);
        setUsers(userRes.data);
        setJobs(jobRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') loadAdminData();
  }, [user]);

  const handleUserDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleJobChange = (field, value) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleJobEdit = (job) => {
    setSelectedJob(job);
    setJobForm({
      companyName: job.companyName || '',
      role: job.role || '',
      type: job.type || 'MNC',
      eligibility: job.eligibility || '',
      skillsRequired: job.skillsRequired?.join(', ') || '',
      salary: job.salary || '',
      syllabus: job.syllabus || '',
      deadline: job.deadline || '',
      ageLimit: job.ageLimit || '',
      examPattern: job.examPattern || '',
      hiringCriteria: job.hiringCriteria || '',
      interviewRounds: job.interviewRounds || '',
      dsaTopics: job.dsaTopics || '',
      aptitudeTopics: job.aptitudeTopics || '',
    });
  };

  const resetJobForm = () => {
    setSelectedJob(null);
    setJobForm(defaultJobState);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setSavingJob(true);
    const payload = {
      ...jobForm,
      skillsRequired: jobForm.skillsRequired.split(',').map((item) => item.trim()).filter(Boolean),
    };
    try {
      if (selectedJob) {
        const { data } = await updateJob(selectedJob._id, payload);
        setJobs((prev) => prev.map((job) => (job._id === data._id ? data : job)));
      } else {
        const { data } = await createJob(payload);
        setJobs((prev) => [data, ...prev]);
      }
      resetJobForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingJob(false);
    }
  };

  const handleJobDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job._id !== id));
      if (selectedJob?._id === id) resetJobForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <h1 className="text-3xl font-semibold text-white">Admin Panel</h1>
            <p className="mt-2 text-slate-400">Manage users and jobs from a centralized admin dashboard.</p>
          </section>
          <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Summary</h2>
            <div className="mt-6 space-y-4 text-slate-300">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Users</p>
                <p className="mt-3 text-3xl font-semibold text-white">{users.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Jobs</p>
                <p className="mt-3 text-3xl font-semibold text-white">{jobs.length}</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <h2 className="text-2xl font-semibold text-white">Users</h2>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">College</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-5 text-slate-400">Loading users...</td></tr>
                  ) : users.length ? users.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.role}</td>
                      <td className="px-6 py-4">{item.college || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleUserDelete(item._id)} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400">Delete</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="px-6 py-5 text-slate-400">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <h2 className="text-2xl font-semibold text-white">Job manager</h2>
            <p className="mt-2 text-slate-400">Add or edit job listings for government and MNC categories.</p>
            <form onSubmit={handleJobSubmit} className="mt-6 space-y-4">
              {['companyName', 'role', 'eligibility', 'salary', 'deadline', 'ageLimit', 'examPattern', 'hiringCriteria', 'interviewRounds', 'dsaTopics', 'aptitudeTopics', 'syllabus'].map((field) => (
                <label key={field} className="block text-sm text-slate-300">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  <input
                    value={jobForm[field]}
                    onChange={(e) => handleJobChange(field, e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
                  />
                </label>
              ))}
              <label className="block text-sm text-slate-300">
                Type
                <select value={jobForm.type} onChange={(e) => handleJobChange('type', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500">
                  <option value="MNC">MNC</option>
                  <option value="Govt">Govt</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                Skills Required
                <input value={jobForm.skillsRequired} onChange={(e) => handleJobChange('skillsRequired', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500" placeholder="Comma separated" />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={savingJob} className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60">
                  {selectedJob ? 'Update Job' : 'Add Job'}
                </button>
                {selectedJob && (
                  <button type="button" onClick={resetJobForm} className="rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm text-slate-200 hover:border-sky-500">Cancel</button>
                )}
              </div>
            </form>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
          <h2 className="text-2xl font-semibold text-white">Active jobs</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {loading ? (
              <p className="text-slate-400">Loading jobs...</p>
            ) : jobs.length ? jobs.map((job) => (
              <div key={job._id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{job.companyName}</h3>
                    <p className="mt-1 text-slate-400">{job.role} • {job.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleJobEdit(job)} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-sky-500">Edit</button>
                    <button onClick={() => handleJobDelete(job._id)} className="rounded-full bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-400">Delete</button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">Eligibility: {job.eligibility || 'N/A'}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Skills</p>
                <p className="mt-1 text-sm text-slate-300">{job.skillsRequired?.join(', ')}</p>
              </div>
            )) : (
              <p className="text-slate-400">No jobs available yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
