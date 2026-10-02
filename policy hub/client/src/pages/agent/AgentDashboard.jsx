import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import AgentLayout from './AgentLayout';
import { useAuth } from '../../context/AuthContext';

function StatCard({ label, value, to, linkLabel, accent }) {
  return (
    <div className={`bg-white border rounded-xl p-5 ${accent ? 'border-indigo-200' : 'border-gray-200'}`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold mb-3 ${accent && value > 0 ? 'text-indigo-700' : 'text-gray-900'}`}>
        {value ?? '—'}
      </p>
      {to && (
        <Link to={to} className="text-sm text-indigo-600 hover:underline font-medium">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ pendingApps: null, pendingClaims: null });

  useEffect(() => {
    Promise.all([
      api.get('/applications/pending'),
      api.get('/claims/queue'),
    ]).then(([appsRes, claimsRes]) => {
      setCounts({
        pendingApps: appsRes.data.count,
        pendingClaims: claimsRes.data.count,
      });
    }).catch(() => {});
  }, []);

  return (
    <AgentLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}. Here's what needs your attention.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label="Pending Applications"
            value={counts.pendingApps}
            to="/agent/applications"
            linkLabel="Review applications"
            accent
          />
          <StatCard
            label="Claims in Queue"
            value={counts.pendingClaims}
            to="/agent/claims"
            linkLabel="Review claims"
            accent
          />
        </div>
      </div>
    </AgentLayout>
  );
}
