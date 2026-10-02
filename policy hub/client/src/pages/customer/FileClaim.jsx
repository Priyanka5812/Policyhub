import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import CustomerLayout from './CustomerLayout';
import { useToast } from '../../context/ToastContext';

export default function FileClaim() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [approvedApps, setApprovedApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const { addToast } = useToast();
  const [form, setForm] = useState({
    applicationId: searchParams.get('applicationId') || '',
    claimAmount: '',
    reason: '',
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/applications/my')
      .then(({ data }) => {
        const approved = data.applications.filter((a) => a.status === 'approved');
        setApprovedApps(approved);
      })
      .finally(() => setLoadingApps(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.applicationId) return setError('Please select a policy.');
    if (!form.claimAmount || Number(form.claimAmount) <= 0) return setError('Enter a valid claim amount.');
    if (!form.reason.trim()) return setError('Please describe the reason for your claim.');

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('applicationId', form.applicationId);
      formData.append('claimAmount', form.claimAmount);
      formData.append('reason', form.reason);
      files.forEach((f) => formData.append('documents', f));

      await api.post('/claims', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      addToast('Claim filed successfully!', 'success');
      navigate('/customer/my-claims');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">File a Claim</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Policy selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Approved Policy
              </label>
              {loadingApps ? (
                <p className="text-sm text-gray-400">Loading your policies…</p>
              ) : approvedApps.length === 0 ? (
                <p className="text-sm text-yellow-600">No approved policies found.</p>
              ) : (
                <select
                  name="applicationId"
                  value={form.applicationId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a policy --</option>
                  {approvedApps.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.policy?.title} ({a.policy?.type})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Claim amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim Amount (₹)
              </label>
              <input
                type="number"
                name="claimAmount"
                value={form.claimAmount}
                onChange={handleChange}
                min="1"
                required
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Claim
              </label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the incident or reason for filing this claim…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* File upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Documents{' '}
                <span className="text-gray-400 font-normal">(PDF, JPG, PNG — max 5 files, 5 MB each)</span>
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:border file:border-gray-300 file:rounded-lg file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
              {files.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">{files.length} file(s) selected</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/customer/my-policies')}
                className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || approvedApps.length === 0}
                className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting…' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}
