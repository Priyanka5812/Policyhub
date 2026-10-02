import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import CustomerLayout from './CustomerLayout';
import { StatusBadge } from '../../components/StatusBadge';

export default function MyPolicies() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/applications/my')
      .then(({ data }) => setApplications(data.applications))
      .catch(() => setError('Failed to load your applications.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Policies</h1>

        {loading ? (
          <p className="text-gray-400 text-center py-16">Loading…</p>
        ) : error ? (
          <p className="text-red-500 text-center py-16">{error}</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="mb-3">No applications yet.</p>
            <Link to="/customer/policies" className="text-blue-600 hover:underline text-sm font-medium">
              Browse policies →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Policy</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Premium</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Applied</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{app.policy?.title}</td>
                    <td className="px-5 py-4 capitalize text-gray-600">{app.policy?.type}</td>
                    <td className="px-5 py-4 text-gray-600">₹{app.policy?.premium?.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {app.status === 'approved' && (
                        <Link
                          to={`/customer/file-claim?applicationId=${app._id}&policyTitle=${encodeURIComponent(app.policy?.title)}`}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          File a Claim
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
