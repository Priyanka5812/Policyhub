import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const PORTALS = [
  {
    key: 'customer',
    label: 'Customer Portal',
    icon: '👤',
    desc: 'Browse policies, apply for coverage & track your claims',
    accent: 'border-blue-500/40 hover:border-blue-400 hover:bg-blue-500/5',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    activeText: 'text-blue-400',
    activeBorder: 'border-blue-500',
    ring: 'focus:ring-blue-500',
    btn: 'bg-blue-600 hover:bg-blue-700',
    selectBtn: 'bg-blue-600 hover:bg-blue-500',
    loginPath: '/customer/login',
    dashboard: '/customer/dashboard',
  },
  {
    key: 'agent',
    label: 'Agent Portal',
    icon: '🧑‍💼',
    desc: 'Review policy applications & process customer claims',
    accent: 'border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-500/5',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    activeText: 'text-indigo-400',
    activeBorder: 'border-indigo-500',
    ring: 'focus:ring-indigo-500',
    btn: 'bg-indigo-600 hover:bg-indigo-700',
    selectBtn: 'bg-indigo-600 hover:bg-indigo-500',
    loginPath: '/agent/login',
    dashboard: '/agent/dashboard',
  },
  {
    key: 'admin',
    label: 'Admin Portal',
    icon: '👑',
    desc: 'Platform analytics, user management & system overview',
    accent: 'border-blue-500/40 hover:border-blue-400 hover:bg-blue-500/5',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    activeText: 'text-blue-400',
    activeBorder: 'border-blue-500',
    ring: 'focus:ring-blue-500',
    btn: 'bg-blue-600 hover:bg-blue-700',
    selectBtn: 'bg-blue-600 hover:bg-blue-500',
    loginPath: '/admin/login',
    dashboard: '/admin/dashboard',
  },
];

export default function PortalRegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedPortal, setSelectedPortal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const portal = PORTALS.find((p) => p.key === selectedPortal);

  const handleSelectPortal = (key) => {
    setSelectedPortal(key);
    setError('');
    setForm({ name: '', email: '', phone: '', password: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', { ...form, role: portal.key });
      login(data.user, data.token);
      navigate(portal.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">P</div>
          <span className="text-white font-bold text-xl tracking-tight">PolicyHub</span>
        </div>

        {/* ── STEP 1: Portal Selection ── */}
        {!selectedPortal && (
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Create an account</h2>
            <p className="text-slate-400 text-sm mb-6">Which portal do you want to join?</p>

            <div className="space-y-3">
              {PORTALS.map((p) => (
                <button
                  key={p.key}
                  id={`select-${p.key}`}
                  onClick={() => handleSelectPortal(p.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border bg-slate-800/60 text-left transition-all duration-200 ${p.accent}`}
                >
                  <span className="text-3xl">{p.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{p.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{p.desc}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${p.badge}`}>
                    Select →
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/" className="text-blue-400 hover:underline font-medium">
                Go to home
              </Link>
            </p>
            <p className="mt-2 text-center text-xs text-slate-600">
              <Link to="/" className="hover:text-slate-400 transition-colors">← Back to home</Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: Registration Form ── */}
        {selectedPortal && portal && (
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">

            {/* Back bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700 bg-slate-800/80">
              <button
                onClick={() => setSelectedPortal(null)}
                className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1"
              >
                ← Change portal
              </button>
              <span className="text-slate-600 text-xs">|</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${portal.badge}`}>
                {portal.icon} {portal.label}
              </span>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-1">Create an account</h2>
              <p className="text-slate-400 text-sm mb-6">
                Registering as a <span className="font-semibold text-slate-300">{portal.label.split(' ')[0]}</span>
              </p>

              {/* Admin disclaimer */}
              {portal.key === 'admin' && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs">
                  ⚠️ <strong>College demo only</strong> — Admin self-registration is for demonstration purposes only.
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="reg-name">
                    Full Name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Doe"
                    className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${portal.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="reg-email">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${portal.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="reg-phone">
                    Phone <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${portal.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="reg-password">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${portal.ring}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 text-white rounded-lg font-medium disabled:opacity-50 transition-colors ${portal.btn}`}
                >
                  {loading ? 'Creating account…' : `Register as ${portal.label.split(' ')[0]}`}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to={portal.loginPath} className={`font-medium hover:underline ${portal.activeText}`}>
                  Log In
                </Link>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
