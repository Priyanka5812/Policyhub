import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import AgentLayout from './AgentLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

const NEXT_STATUSES = {
  filed:        ['under_review', 'approved', 'rejected'],
  under_review: ['approved', 'rejected'],
};

function StatusActionModal({ claim, onClose, onSubmit, loading }) {
  const options = NEXT_STATUSES[claim.status] || [];
  const [status, setStatus] = useState(options[0] || '');
  const [remarks, setRemarks] = useState('');

  const btnColor = {
    under_review: 'bg-purple-600 hover:bg-purple-700',
    approved:     'bg-green-600 hover:bg-green-700',
    rejected:     'bg-red-600 hover:bg-red-700',
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1">Update Claim Status</h3>
        <p className="text-sm text-gray-500 mb-4">
          Claimant: <strong>{claim.user?.name}</strong><br />
          Amount: <strong>₹{Number(claim.claimAmount).toLocaleString()}</strong>
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {options.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border capitalize transition-colors ${
                status === s
                  ? `${btnColor[s]} text-white border-transparent`
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remarks <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          placeholder="Add notes for the claimant…"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(claim._id, status, remarks)}
            disabled={loading || !status}
            className={`flex-1 py-2 text-white text-sm rounded-lg disabled:opacity-50 transition-colors ${btnColor[status] || 'bg-indigo-600'}`}
          >
            {loading ? 'Updating…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClaimsQueue() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { addToast } = useToast();

  const fetchClaims = () => {
    setLoading(true);
    api.get('/claims/queue')
      .then(({ data }) => setClaims(data.claims))
      .catch(() => setError('Failed to load claims.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClaims(); }, []);

  const handleUpdate = async (id, status, agentRemarks) => {
    setUpdating(true);
    try {
      await api.put(`/claims/${id}/status`, { status, agentRemarks });
      addToast(`Claim status updated to ${status}`, status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info');
      setSelected(null);
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AgentLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Claims Queue</h1>

        {loading ? (
          <p className="text-gray-400 text-center py-16">Loading…</p>
        ) : error ? (
          <p className="text-red-500 text-center py-16">{error}</p>
        ) : claims.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-400 font-medium">No claims in queue 🎉</p>
            <p className="text-sm text-gray-400 mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => (
              <div key={claim._id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900">{claim.user?.name}</h3>
                      <span className="text-xs text-gray-400">{claim.user?.email}</span>
                      <StatusBadge status={claim.status} />
                    </div>
                    {claim.user?.phone && (
                      <p className="text-xs text-gray-400 mb-1">📞 {claim.user.phone}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Policy:{' '}
                      <span className="font-medium text-gray-800">
                        {claim.application?.policy?.title}
                      </span>
                      <span className="ml-1 text-xs capitalize text-gray-400">
                        ({claim.application?.policy?.type})
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      Claim Amount:{' '}
                      <span className="font-semibold">₹{Number(claim.claimAmount).toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">
                        (coverage: ₹{claim.application?.policy?.coverageAmount?.toLocaleString()})
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1 italic">"{claim.reason}"</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Filed {new Date(claim.filedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {claim.documents?.length > 0 && (
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {claim.documents.map((doc, i) => (
                          <a
                            key={i}
                            href={`http://localhost:5000/${doc}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            Document {i + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {NEXT_STATUSES[claim.status] && (
                    <button
                      onClick={() => setSelected(claim)}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <StatusActionModal
          claim={selected}
          onClose={() => setSelected(null)}
          onSubmit={handleUpdate}
          loading={updating}
        />
      )}
    </AgentLayout>
  );
}
