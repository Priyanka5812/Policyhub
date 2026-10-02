import { Link } from 'react-router-dom';

const PORTALS = [
  {
    role: 'customer',
    label: 'Customer Portal',
    icon: '👤',
    desc: 'Browse policies, apply & track claims',
    accent: 'border-blue-200 hover:border-blue-400 hover:shadow-blue-100',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    btn: 'bg-blue-600 hover:bg-blue-700',
    linkColor: 'text-blue-600 hover:text-blue-800',
    redirect: '/customer/dashboard',
    loginPath: '/customer/login',
    registerPath: '/customer/register',
  },
  {
    role: 'agent',
    label: 'Agent Portal',
    icon: '🧑‍💼',
    desc: 'Review applications & process claims',
    accent: 'border-indigo-200 hover:border-indigo-400 hover:shadow-indigo-100',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    btn: 'bg-indigo-600 hover:bg-indigo-700',
    linkColor: 'text-indigo-600 hover:text-indigo-800',
    redirect: '/agent/dashboard',
    loginPath: '/agent/login',
    registerPath: '/agent/register',
  },
  {
    role: 'admin',
    label: 'Admin Portal',
    icon: '👑',
    desc: 'Analytics, stats & platform overview',
    accent: 'border-blue-200 hover:border-blue-400 hover:shadow-blue-100',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    btn: 'bg-blue-600 hover:bg-blue-700',
    linkColor: 'text-blue-600 hover:text-blue-800',
    redirect: '/admin/dashboard',
    loginPath: '/admin/login',
    registerPath: '/admin/register',
  },
];


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-blue-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="text-blue-800 font-bold text-lg tracking-tight">PolicyHub</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/customer/login" className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
            Customer
          </Link>
          <Link to="/agent/login" className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-lg transition-colors">
            Agent
          </Link>
          <Link to="/admin/login" className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="text-center max-w-3xl w-full">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-700 text-xs font-medium">Insurance Management Platform</span>
          </div>

          <h1 className="text-5xl font-bold text-blue-900 mb-4 leading-tight">
            Manage Policies &<br />
            <span className="text-blue-500">Claims Seamlessly</span>
          </h1>

          <p className="text-blue-400 text-lg mb-12 leading-relaxed">
            Choose your portal to log in or create an account
          </p>

          {/* Portal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {PORTALS.map((portal) => (
              <div
                key={portal.role}
                className={`bg-white border rounded-2xl p-6 text-left transition-all duration-200 shadow-sm hover:shadow-lg ${portal.accent}`}
              >
                <div className="text-3xl mb-3">{portal.icon}</div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${portal.badge} mb-3 inline-block`}>
                  {portal.label}
                </span>
                <p className="text-gray-500 text-sm mb-5">{portal.desc}</p>

                {/* Login button */}
                <Link
                  to={portal.loginPath}
                  className={`w-full py-2.5 text-white text-sm font-semibold rounded-xl transition-all ${portal.btn} mb-3 flex items-center justify-center`}
                >
                  Log In →
                </Link>

                {/* Register link */}
                <div className="text-center">
                  <Link
                    to={portal.registerPath}
                    className={`text-xs font-medium transition-colors ${portal.linkColor}`}
                  >
                    Register
                  </Link>
                </div>
              </div>
            ))}
          </div>


          <p className="text-gray-400 text-xs">
            All demo accounts use password: <span className="text-gray-600 font-mono">Demo@1234</span>
            {' · '}
            <Link to="/portal-register" className="text-blue-600 hover:underline">Create your own account</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-blue-300 text-xs border-t border-blue-100 bg-white">
        PolicyHub — Insurance Policy & Claims Management System
      </footer>
    </div>
  );
}
