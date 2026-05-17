import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <article className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-glow transition hover:-translate-y-1 hover:border-sky-500">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-400">{job.type}</span>
        <span className="text-xs text-slate-400">Deadline: {job.deadline}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{job.role}</h3>
      <p className="mt-2 text-slate-300">{job.companyName}</p>
      {job.officialLink && (
        <a href={job.officialLink} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 underline hover:text-sky-300">Official Link</a>
      )}
      <p className="mt-3 text-sm leading-6 text-slate-400">{job.eligibility}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skillsRequired?.slice(0, 4).map((skill) => (
          <span key={skill} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{skill}</span>
        ))}
      </div>
      <Link to={`/jobs/${job._id}`} className="mt-6 inline-flex rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Explore</Link>
    </article>
  );
};

export default JobCard;
