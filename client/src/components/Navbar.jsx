import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="text-2xl font-bold text-sky-400">CareerBridge AI</Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/govt-jobs">Govt Jobs</Link>
          <Link to="/mnc-jobs">MNC Jobs</Link>
          <Link to="/eligibility">Eligibility</Link>
          <Link to="/resume-analyzer">Resume Analyzer</Link>
          <Link to="/chatbot">Career Chatbot</Link>
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          {user ? (
            <button onClick={logout} className="rounded-full bg-slate-700 px-4 py-2 text-slate-100 transition hover:bg-slate-600">Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="rounded-full bg-sky-500 px-4 py-2 text-slate-950">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
