import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';

export default function AdminRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
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
      const { data } = await api.post('/auth/register', { ...form, role: 'admin' });
      login(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-blue-100 p-8">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="text-blue-800 font-bold text-lg tracking-tight">PolicyHub</span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200 mb-4">
          👑 Admin Portal
        </span>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create an admin account</h2>
        <p className="text-gray-500 text-sm mb-6">Set up platform administrator access</p>

        {/* Demo disclaimer */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs">
          ⚠️ <strong>College demo only</strong> — Admin self-registration is enabled for demonstration purposes. A real production system would not expose this publicly.
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-reg-name">
              Full Name
            </label>
            <input
              id="admin-reg-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Jane Doe"
              className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-reg-email">
              Email
            </label>
            <input
              id="admin-reg-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-reg-phone">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="admin-reg-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-reg-password">
              Password
            </label>
            <input
              id="admin-reg-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/admin/login" className="text-blue-600 hover:underline font-medium">
            Log In
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-gray-400">
          <Link to="/" className="hover:text-blue-500 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
