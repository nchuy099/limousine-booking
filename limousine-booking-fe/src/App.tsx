import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage';
import OTPPage from './pages/OTPPage';
import RegisterPage from './pages/RegisterPage';
import PasswordPage from './pages/PasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast';
import AboutPage from './pages/AboutPage';
import LookUpPage from './pages/LookUpPage';
import MyBooking from './pages/MyBooking';
import MyProfile from './pages/MyProfile';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Authentication pages without MainLayout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password" element={<PasswordPage />} />

          {/* Main pages with MainLayout */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="lookup" element={<LookUpPage />} />
            <Route path="my-booking" element={<MyBooking />} />
            <Route path="my-profile" element={<MyProfile />} />
          </Route>

          {/* 404 page - catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
