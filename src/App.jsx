import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DisclaimerModal from './components/DisclaimerModal';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import DashboardOverview from './pages/DashboardOverview';
import ApplianceInsights from './pages/ApplianceInsights';
import BillingPrediction from './pages/BillingPrediction';
import NetMeteringSummary from './pages/NetMeteringSummary';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-semibold text-white">Loading your workspace...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="appliances" element={<ApplianceInsights />} />
            <Route path="billing" element={<BillingPrediction />} />
            <Route path="net-metering" element={<NetMeteringSummary />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <DisclaimerModal />
      </Router>
    </AuthProvider>
  );
}

export default App;
