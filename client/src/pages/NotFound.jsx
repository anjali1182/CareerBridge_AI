import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-slate-950 px-4 py-20 text-center text-slate-200">
    <h1 className="text-6xl font-extrabold text-white">404</h1>
    <p className="mt-4 text-xl">Page not found.</p>
    <Link to="/" className="mt-8 inline-block rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Go back home</Link>
  </div>
);

export default NotFound;
