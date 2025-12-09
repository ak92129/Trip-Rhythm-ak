import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { GuestItineraryPage } from './pages/GuestItineraryPage';
import { HomePage } from './pages/HomePage';
import { NewTripPage } from './pages/NewTripPage';
import { TripDetailPage } from './pages/TripDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="guest-itinerary" element={<GuestItineraryPage />} />
            <Route path="home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="new-trip" element={<ProtectedRoute><NewTripPage /></ProtectedRoute>} />
            <Route path="trip/:tripId" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
