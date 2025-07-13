import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProfileSetupLanding from './pages/ProfileSetupLanding';
import TraderProfileSetup from './pages/TraderProfileSetup';
import DashboardLayout from './components/DashboardLayout';
import ProfileGate from './routes/ProfileGate';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<ProfileSetupLanding />} />
        <Route path="/setup/form" element={<TraderProfileSetup />} />
        <Route
          path="/dashboard"
          element={
            <ProfileGate>
              <DashboardLayout />
            </ProfileGate>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}