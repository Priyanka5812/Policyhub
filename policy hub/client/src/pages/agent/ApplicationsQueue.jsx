import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import AgentLayout from './AgentLayout';
import { useToast } from '../../context/ToastContext';

function DecisionModal({ application, onClose, onSubmit, loading }) {
  const [status, setStatus] = useState('approved');
  const [remarks, setRemarks] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1">
          Decision for {application.user?.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Policy: <strong>{application.policy?.title}</strong>
        </p>

        {/* Status toggle */}
        <div className="flex gap-2 mb-4">
          {['approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                status === s
                  ? s === 'approved'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-red-600 text-white border-red-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
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
          placeholder="Add notes for the applicant…"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(application._id, status, remarks)}
            disabled={loading}
            className={`flex-1 py-2 text-white text-sm rounded-lg disabled:opacity-50 transition-colors ${
              status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Submitting…' : `Confirm ${status}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsQueue() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [deciding, setDeciding] = useState(false);
  const { addToast } = useToast();

  const fetchApps = () => {
    setLoading(true);
    api.get('/applications/pending')
      .then(({ data }) => setApplications(data.applications))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const handleDecision = async (id, status, agentRemarks) => {
    setDeciding(true);
    try {
      await api.put(`/applications/${id}/decision`, { status, agentRemarks });
      addToast(`Application ${status} successfully`, status === 'approved' ? 'success' : 'error');
      setSelected(null);
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || 'Decision failed.');
    } finally {
      setDeciding(false);
    }
  };

  return (
    <AgentLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Applications</h1>

        {loading ? (
          <p className="text-gray-400 text-center py-16">Loading…</p>
        ) : error ? (
          <p className="text-red-500 text-center py-16">{error}</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-400 font-medium">No pending applications 🎉</p>
            <p className="text-sm text-gray-400 mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900">{app.user?.name}</h3>
                      <span className="text-xs text-gray-400">{app.user?.email}</span>
                    </div>
                    {app.user?.phone && (
                      <p className="text-xs text-gray-400 mb-1">📞 {app.user.phone}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Applied for:{' '}
                      <span className="font-medium text-gray-800">{app.policy?.title}</span>
                      <span className="ml-1 text-xs capitalize text-gray-400">({app.policy?.type})</span>
                    </p>
                    <div className="mt-1 flex gap-4 text-xs text-gray-400">
                      <span>Premium: ₹{app.policy?.premium?.toLocaleString()}/mo</span>
                      <span>Coverage: ₹{app.policy?.coverageAmount?.toLocaleString()}</span>
                      <span>Duration: {app.policy?.durationMonths}mo</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(app)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                  >
                    Decide
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <DecisionModal
          application={selected}
          onClose={() => setSelected(null)}
          onSubmit={handleDecision}
          loading={deciding}
        />
      )}
    </AgentLayout>
  );
}
