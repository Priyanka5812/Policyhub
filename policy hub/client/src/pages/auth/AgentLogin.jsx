import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';

export default function AgentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.user.role !== 'agent') {
        setError('This login is for agents only. Please use the correct portal.');
        return;
      }
      login(data.user, data.token);
      navigate('/agent/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="text-indigo-800 font-bold text-lg tracking-tight">PolicyHub</span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-indigo-100 text-indigo-700 border-indigo-200 mb-4">
          🧑‍💼 Agent Portal
        </span>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Agent Sign In</h2>
        <p className="text-gray-500 text-sm mb-6">Log in to your agent account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="agent-login-email">
              Email
            </label>
            <input
              id="agent-login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="agent-login-password">
              Password
            </label>
            <input
              id="agent-login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/agent/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-gray-400">
          <Link to="/" className="hover:text-indigo-500 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
