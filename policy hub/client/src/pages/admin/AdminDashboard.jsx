import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import api from '../../api/axiosInstance';
import AdminLayout from './AdminLayout';

const SUMMARY_CARDS = [
  { key: 'totalPoliciesSold', label: 'Policies Sold',       color: 'text-blue-700',  bg: 'bg-blue-50',    border: 'border-blue-200' },
  { key: 'totalCustomers',    label: 'Total Customers',     color: 'text-blue-700',  bg: 'bg-blue-50',    border: 'border-blue-200' },
  { key: 'claimsApproved',   label: 'Claims Approved',     color: 'text-green-700', bg: 'bg-green-50',   border: 'border-green-200' },
  { key: 'claimsRejected',   label: 'Claims Rejected',     color: 'text-red-700',   bg: 'bg-red-50',     border: 'border-red-200' },
];

const PIE_COLORS = ['#16a34a', '#dc2626']; // green, red

function SummaryCard({ label, value, color, bg, border }) {
  return (
    <div className={`${bg} border ${border} rounded-xl p-5`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
    </div>
  );
}

const formatCurrency = (v) =>
  v >= 100000
    ? `₹${(v / 100000).toFixed(1)}L`
    : `₹${v.toLocaleString()}`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load stats.'))
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats
    ? [
        { name: 'Approved', value: stats.claimsApproved },
        { name: 'Rejected', value: stats.claimsRejected },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform-wide analytics overview</p>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-24">Loading analytics…</p>
        ) : error ? (
          <p className="text-red-500 text-center py-24">{error}</p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {SUMMARY_CARDS.map(({ key, label, color, bg, border }) => (
                <SummaryCard
                  key={key}
                  label={label}
                  value={stats[key]}
                  color={color}
                  bg={bg}
                  border={border}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Claims Pie Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-gray-800 mb-4">
                  Claims Outcome Ratio
                </h2>
                {pieData.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-12">No resolved claims yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v} claims`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Revenue Bar Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-gray-800 mb-4">
                  Monthly Premium Revenue (Last 6 Months)
                </h2>
                {stats.revenueByMonth.every((m) => m.revenue === 0) ? (
                  <p className="text-gray-400 text-sm text-center py-12">No revenue data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={stats.revenueByMonth} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        tickFormatter={(v) => v.split(' ')[0]} // show only month name
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        tickFormatter={formatCurrency}
                        width={56}
                      />
                      <Tooltip
                        formatter={(v) => [formatCurrency(v), 'Revenue']}
                        labelFormatter={(l) => l}
                      />
                      <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
