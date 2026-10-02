import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PortalRegisterPage from './pages/PortalRegisterPage';

// Portal auth pages
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import AgentLogin from './pages/auth/AgentLogin';
import AgentRegister from './pages/auth/AgentRegister';
import AdminLogin from './pages/auth/AdminLogin';
import AdminRegister from './pages/auth/AdminRegister';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import PolicyCatalog from './pages/customer/PolicyCatalog';
import MyPolicies from './pages/customer/MyPolicies';
import FileClaim from './pages/customer/FileClaim';
import MyClaims from './pages/customer/MyClaims';
// Agent pages
import AgentDashboard from './pages/agent/AgentDashboard';
import ApplicationsQueue from './pages/agent/ApplicationsQueue';
import ClaimsQueue from './pages/agent/ClaimsQueue';
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portal-register" element={<PortalRegisterPage />} />

          {/* Portal-specific auth pages (public, declared before protected blocks) */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/agent/login" element={<AgentLogin />} />
          <Route path="/agent/register" element={<AgentRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Customer protected routes */}
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute roles={['customer']}>
                <Routes>
                  <Route path="dashboard" element={<CustomerDashboard />} />
                  <Route path="policies" element={<PolicyCatalog />} />
                  <Route path="my-policies" element={<MyPolicies />} />
                  <Route path="file-claim" element={<FileClaim />} />
                  <Route path="my-claims" element={<MyClaims />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Agent protected routes */}
          <Route
            path="/agent/*"
            element={
              <ProtectedRoute roles={['agent']}>
                <Routes>
                  <Route path="dashboard" element={<AgentDashboard />} />
                  <Route path="applications" element={<ApplicationsQueue />} />
                  <Route path="claims" element={<ClaimsQueue />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Admin protected routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
