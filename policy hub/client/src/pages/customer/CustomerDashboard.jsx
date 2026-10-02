import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import CustomerLayout from './CustomerLayout';
import { useAuth } from '../../context/AuthContext';

function StatCard({ label, value, to, linkLabel }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mb-3">{value ?? '—'}</p>
      {to && (
        <Link to={to} className="text-sm text-blue-600 hover:underline font-medium">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ applications: null, claims: null });

  useEffect(() => {
    Promise.all([
      api.get('/applications/my'),
      api.get('/claims/my'),
    ]).then(([appsRes, claimsRes]) => {
      setStats({
        applications: appsRes.data.count,
        claims: claimsRes.data.count,
      });
    }).catch(() => {});
  }, []);

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's a summary of your PolicyHub account.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="My Applications" value={stats.applications} to="/customer/my-policies" linkLabel="View policies" />
          <StatCard label="My Claims" value={stats.claims} to="/customer/my-claims" linkLabel="View claims" />
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col justify-between">
            <p className="text-sm text-blue-700 font-medium mb-1">Looking for coverage?</p>
            <p className="text-xs text-blue-500 mb-3">Browse available health and vehicle plans.</p>
            <Link
              to="/customer/policies"
              className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Browse Policies
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
