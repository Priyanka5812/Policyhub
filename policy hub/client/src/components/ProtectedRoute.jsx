import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * @param {string[]} roles - allowed roles for this route (e.g. ['customer'])
 * @param {JSX.Element} children
 *
 * Behaviour:
 *   - Not logged in  → redirect to /login
 *   - Wrong role     → show inline "Unauthorized" message
 *   - Correct role   → render children
 */
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Unauthorized</h2>
          <p className="text-gray-500">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
