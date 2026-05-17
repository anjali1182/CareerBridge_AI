import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', branch: '', cgpa: '', skills: '', graduationYear: '', backlog: '0' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!form.skills.trim()) {
      setError('Enter at least one skill (comma separated)');
      return;
    }
    if (!form.graduationYear) {
      setError('Graduation year is required');
      return;
    }
    setLoading(true);
    try {
      const backlogValue = Number(form.backlog);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        college: form.college.trim(),
        branch: form.branch.trim(),
        cgpa: Number(form.cgpa),
        backlog: Number.isNaN(backlogValue)
          ? form.backlog.toLowerCase() === 'yes'
            ? 1
            : 0
          : backlogValue,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        graduationYear: Number(form.graduationYear),
      };
      const { data } = await registerUser(payload);
      login(data, data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach server. Start backend on http://localhost:5000');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-glow">
        <h1 className="text-3xl font-bold text-white">Create your student profile</h1>
        <p className="mt-2 text-slate-400">Register to access job eligibility, syllabus insight, and AI career recommendations.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          {error && <div className="sm:col-span-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
          {['name','email','password','college','branch','cgpa','skills','graduationYear'].map((field) => (
            <label key={field} className="block text-sm text-slate-300">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                name={field}
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : field === 'cgpa' || field === 'graduationYear' ? 'number' : 'text'}
                value={form[field]}
                onChange={handleChange}
                required
                minLength={field === 'password' ? 6 : undefined}
                min={field === 'cgpa' ? 0 : field === 'graduationYear' ? 2020 : undefined}
                max={field === 'graduationYear' ? 2035 : field === 'cgpa' ? 10 : undefined}
                step={field === 'cgpa' ? '0.01' : undefined}
                placeholder={field === 'skills' ? 'Java, Python, DSA' : field === 'graduationYear' ? '2026' : undefined}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
              />
            </label>
          ))}
          <label className="block text-sm text-slate-300">
            Backlog
            <select
              name="backlog"
              value={form.backlog}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </label>
          <button type="submit" disabled={loading} className="sm:col-span-2 rounded-2xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400 sm:col-span-2">
          Already registered? <Link to="/login" className="text-sky-400 hover:text-sky-300">Login here</Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-500">
          If register fails with &quot;User already exists&quot;, use Login with the same email.
        </p>
      </div>
    </div>
  );
};

export default Register;
