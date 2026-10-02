import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import CustomerLayout from './CustomerLayout';
import { useToast } from '../../context/ToastContext';

const TYPE_LABELS = { health: 'Health', vehicle: 'Vehicle' };

function PolicyCard({ policy, onApply }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{policy.title}</h3>
          <span className="text-xs text-gray-500">{TYPE_LABELS[policy.type]} Insurance</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          policy.type === 'health' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {policy.type}
        </span>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2">{policy.description}</p>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-xs text-gray-400">Premium</p>
          <p className="font-semibold text-gray-800">₹{policy.premium.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-xs text-gray-400">Coverage</p>
          <p className="font-semibold text-gray-800">₹{policy.coverageAmount.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-xs text-gray-400">Duration</p>
          <p className="font-semibold text-gray-800">{policy.durationMonths}mo</p>
        </div>
      </div>

      <button
        onClick={() => onApply(policy)}
        className="mt-auto w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Apply
      </button>
    </div>
  );
}

function ConfirmModal({ policy, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1">Confirm Application</h3>
        <p className="text-sm text-gray-500 mb-4">
          Apply for <strong>{policy.title}</strong>?<br />
          Monthly premium: <strong>₹{policy.premium.toLocaleString()}</strong>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PolicyCatalog() {
  const [policies, setPolicies] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const { addToast } = useToast();
  const [applying, setApplying] = useState(false);

  const fetchPolicies = async (type = '') => {
    setLoading(true);
    try {
      const params = type ? { type } : {};
      const { data } = await api.get('/policies', { params });
      setPolicies(data.policies);
    } catch {
      setError('Failed to load policies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPolicies(filter); }, [filter]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post('/applications', { policyId: selected._id });
      addToast('Application submitted successfully!', 'success');
      setSelected(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Application failed.', 'error');
      setSelected(null);
    } finally {
      setApplying(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Policy Catalog</h1>
          <div className="flex gap-2">
            {['', 'health', 'vehicle'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  filter === t
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

{loading ? (
          <p className="text-gray-400 text-center py-16">Loading policies…</p>
        ) : error ? (
          <p className="text-red-500 text-center py-16">{error}</p>
        ) : policies.length === 0 ? (
          <p className="text-gray-400 text-center py-16">No policies available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {policies.map((p) => (
              <PolicyCard key={p._id} policy={p} onApply={setSelected} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ConfirmModal
          policy={selected}
          onConfirm={handleApply}
          onCancel={() => setSelected(null)}
          loading={applying}
        />
      )}
    </CustomerLayout>
  );
}
