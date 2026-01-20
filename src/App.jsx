import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ApplianceInsights from './pages/ApplianceInsights';
import BillingPrediction from './pages/BillingPrediction';
import NetMeteringSummary from './pages/NetMeteringSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="appliances" element={<ApplianceInsights />} />
          <Route path="billing" element={<BillingPrediction />} />
          <Route path="net-metering" element={<NetMeteringSummary />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
