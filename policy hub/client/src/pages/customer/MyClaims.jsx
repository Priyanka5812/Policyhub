import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import CustomerLayout from './CustomerLayout';
import { StatusBadge } from '../../components/StatusBadge';

const PIPELINE = ['filed', 'under_review', 'approved'];

function ClaimPipeline({ status }) {
  const isRejected = status === 'rejected';
  return (
    <div className="flex items-center gap-1 mt-2">
      {PIPELINE.map((step, i) => {
        const reached = PIPELINE.indexOf(status) >= i && !isRejected;
        return (
          <div key={step} className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${reached ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <span className={`text-xs capitalize ${reached ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              {step.replace('_', ' ')}
            </span>
            {i < PIPELINE.length - 1 && (
              <div className={`h-0.5 w-6 rounded ${PIPELINE.indexOf(status) > i && !isRejected ? 'bg-blue-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <>
          <div className="h-0.5 w-6 rounded bg-gray-200" />
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <span className="text-xs text-red-500 font-medium">Rejected</span>
        </>
      )}
    </div>
  );
}

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/claims/my')
      .then(({ data }) => setClaims(data.claims))
      .catch(() => setError('Failed to load your claims.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Claims</h1>

        {loading ? (
          <p className="text-gray-400 text-center py-16">Loading…</p>
        ) : error ? (
          <p className="text-red-500 text-center py-16">{error}</p>
        ) : claims.length === 0 ? (
          <p className="text-gray-400 text-center py-16">No claims filed yet.</p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim._id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900">
                        {claim.application?.policy?.title}
                      </h3>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {claim.application?.policy?.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Filed {new Date(claim.filedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{Number(claim.claimAmount).toLocaleString()}
                    </p>
                    <StatusBadge status={claim.status} />
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3 mb-2">{claim.reason}</p>

                <ClaimPipeline status={claim.status} />

                {claim.agentRemarks && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
                    <span className="font-medium text-gray-700">Agent Remarks: </span>
                    {claim.agentRemarks}
                  </div>
                )}

                {claim.resolvedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Resolved on {new Date(claim.resolvedAt).toLocaleDateString('en-IN')}
                  </p>
                )}

                {claim.documents?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {claim.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={`http://localhost:5000/${doc}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Document {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
