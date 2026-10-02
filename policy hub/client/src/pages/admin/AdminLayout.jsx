import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <aside className="w-60 bg-white flex flex-col shadow-md border-r border-blue-100">
        <div className="px-5 py-6 border-b border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="text-blue-800 font-bold text-base tracking-tight">PolicyHub</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-gray-700 text-xs font-medium truncate max-w-[120px]">{user?.name}</p>
              <span className="text-xs text-blue-600 font-medium">Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'
                }`
              }
            >
              <span className="text-base w-4 text-center">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-blue-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
          >
            <span>↩</span> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
