import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GovernmentJobs from './pages/GovernmentJobs';
import MNCJobs from './pages/MNCJobs';
import EligibilityChecker from './pages/EligibilityChecker';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import AdminPanel from './pages/AdminPanel';
import CareerChatbot from './pages/CareerChatbot';
import JobDetail from './pages/JobDetail';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/govt-jobs"
              element={<ProtectedRoute><GovernmentJobs /></ProtectedRoute>}
            />
            <Route
              path="/mnc-jobs"
              element={<ProtectedRoute><MNCJobs /></ProtectedRoute>}
            />
            <Route
              path="/jobs/:id"
              element={<ProtectedRoute><JobDetail /></ProtectedRoute>}
            />
            <Route
              path="/eligibility"
              element={<ProtectedRoute><EligibilityChecker /></ProtectedRoute>}
            />
            <Route
              path="/resume-analyzer"
              element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>}
            />
            <Route
              path="/chatbot"
              element={<ProtectedRoute><CareerChatbot /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
