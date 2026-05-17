import { useEffect, useState } from 'react';
import { CheckCircleIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getJob, applyJob } from '../services/jobService';

const detailFields = [
  { key: 'salary', label: 'Salary' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'ageLimit', label: 'Age limit' },
  { key: 'examPattern', label: 'Exam pattern' },
  { key: 'hiringCriteria', label: 'Hiring criteria' },
  { key: 'interviewRounds', label: 'Interview rounds' },
  { key: 'dsaTopics', label: 'DSA topics' },
  { key: 'aptitudeTopics', label: 'Aptitude topics' },
];

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationStep, setApplicationStep] = useState(0); // 0: not started, 1: submitted, 2: resume, 3: confirmation
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getJob(id);
        setJob(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Job not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const backPath = job?.type === 'MNC' ? '/mnc-jobs' : '/govt-jobs';

  const handleApply = async () => {
    setApplyMessage('');
    setApplying(true);
    try {
      await applyJob(job._id);
      setApplyMessage('Application submitted successfully.');
      setApplicationStep(1);
    } catch (err) {
      setApplyMessage(err.response?.data?.message || 'Could not apply for this job');
    } finally {
      setApplying(false);
    }
  };

  // Handle resume file selection
  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
    setUploadError('');
  };

  // Simulate resume upload and confirmation
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setUploadingResume(true);
    setUploadError('');
    // Simulate upload delay
    setTimeout(() => {
      setApplicationStep(2);
      setUploadingResume(false);
      setTimeout(() => setApplicationStep(3), 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 rounded bg-slate-800 px-4 py-2 text-sky-300 font-semibold hover:bg-slate-700 hover:text-white transition shadow"
            >
              <span aria-hidden="true">←</span> Back
            </Link>
          </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-300">
            {error}
          </div>
        ) : (
          <article className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-400">
                {job.type}
              </span>
              {job.deadline && <span className="text-sm text-slate-400">Deadline: {job.deadline}</span>}
            </div>

            <h1 className="mt-6 text-3xl font-semibold text-white">{job.role}</h1>
            <p className="mt-2 text-xl text-slate-300">{job.companyName}</p>

            {job.eligibility && (
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-white">Eligibility</h2>
                <p className="mt-2 leading-7 text-slate-300">{job.eligibility}</p>
              </section>
            )}

            {job.skillsRequired?.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-white">Skills required</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill) => (
                    <span key={skill} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {job.officialLink && (
              <section className="mt-8">
                <a href={job.officialLink} target="_blank" rel="noopener noreferrer" className="inline-block rounded bg-sky-600 px-4 py-2 text-white font-semibold hover:bg-sky-500 transition">Visit Official Link</a>
              </section>
            )}

            {job.syllabus && (
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-white">Syllabus</h2>
                <p className="mt-2 leading-7 text-slate-300">{job.syllabus}</p>
              </section>
            )}

            <section className="mt-8 grid gap-4 sm:grid-cols-2">
              {detailFields.map(({ key, label }) =>
                job[key] ? (
                  <div key={key} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{job[key]}</p>
                  </div>
                ) : null
              )}
            </section>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleApply}
                disabled={applying || applicationStep > 0}
                className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {applying ? 'Applying...' : applicationStep > 0 ? 'Applied' : 'Apply for this job'}
              </button>
              <Link
                to="/eligibility"
                className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-sky-500"
              >
                Check eligibility
              </Link>
            </div>

            {/* Enhanced Step-by-step application process */}
            {applicationStep > 0 && (
              <div className="mt-10">
                {/* Progress Bar */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex-1 h-2 rounded bg-slate-800 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-700"
                      style={{ width: `${applicationStep * 33.33}%` }}
                    />
                  </div>
                  <span className="ml-4 text-xs text-slate-400">Step {applicationStep} of 3</span>
                </div>
                <ol className="relative border-l-2 border-sky-700 ml-4">
                  {/* Step 1 */}
                  <li className="mb-10 ml-6 flex flex-col gap-1">
                    <span className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full border-2 ${applicationStep >= 1 ? 'bg-sky-500 border-sky-500' : 'bg-slate-800 border-slate-700'} text-white shadow transition-all duration-300`}>
                      <CheckCircleIcon className={`h-6 w-6 ${applicationStep >= 1 ? '' : 'opacity-30'}`} />
                    </span>
                    <h3 className="font-semibold text-lg">Application Submitted</h3>
                    <p className="text-sm text-slate-400">Your application has been submitted.</p>
                  </li>
                  {/* Step 2 */}
                  <li className="mb-10 ml-6 flex flex-col gap-1">
                    <span className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full border-2 ${applicationStep >= 2 ? 'bg-sky-500 border-sky-500' : 'bg-slate-800 border-slate-700'} text-white shadow transition-all duration-300`}>
                      <DocumentArrowUpIcon className={`h-6 w-6 ${applicationStep >= 2 ? '' : 'opacity-30'}`} />
                    </span>
                    <h3 className="font-semibold text-lg">Upload Resume</h3>
                    {applicationStep === 1 ? (
                      <form
                        className="mt-2 flex flex-col sm:flex-row gap-2 items-start"
                        onSubmit={e => { e.preventDefault(); handleResumeUpload(); }}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeChange}
                          className="block w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                          required
                        />
                        <button
                          type="submit"
                          disabled={!resumeFile || uploadingResume}
                          className="rounded bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-1 text-white font-semibold hover:from-sky-500 hover:to-emerald-400 transition disabled:opacity-60"
                        >
                          {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-700/20 text-emerald-400 text-xs font-semibold">
                          <CheckCircleIcon className="h-4 w-4" /> Uploaded
                        </span>
                        {resumeFile && (
                          <span className="text-xs text-slate-300">{resumeFile.name}</span>
                        )}
                      </div>
                    )}
                    {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}
                  </li>
                  {/* Step 3 */}
                  <li className="ml-6 flex flex-col gap-1">
                    <span className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full border-2 ${applicationStep === 3 ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-800 border-slate-700'} text-white shadow transition-all duration-300`}>
                      <CheckCircleIcon className={`h-6 w-6 ${applicationStep === 3 ? '' : 'opacity-30'}`} />
                    </span>
                    <h3 className="font-semibold text-lg">Await Confirmation</h3>
                    <p className="text-sm text-slate-400">
                      {applicationStep === 3 ? (
                        <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
                          <CheckCircleIcon className="h-5 w-5" /> Application complete! You will be notified soon.
                        </span>
                      ) : 'Please wait for confirmation.'}
                    </p>
                  </li>
                </ol>
              </div>
            )}

            {applyMessage && (
              <p className={`mt-4 text-sm ${applyMessage.includes('success') ? 'text-emerald-400' : 'text-amber-300'}`}>
                {applyMessage}
              </p>
            )}
          </article>
        )}
      </main>
    </div>
  );
};

export default JobDetail;
