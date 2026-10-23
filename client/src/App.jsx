import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Pages
import MarketplacePage from './pages/MarketplacePage';
import TractorBookingPage from './pages/TractorBookingPage';
import AddTractorPage from './pages/AddTractorPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Admin Route Guard
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    // If logged in as farmer, prompt or auto-switch for demo evaluation
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-amber-400">Admin Authentication Required</h2>
          <p className="text-xs text-slate-300">
            You are currently logged in as a Farmer (<strong>{user.name}</strong>). To test the Admin Portal features (assigning tractors to booked locations and stock maintenance), switch to the Admin Officer account.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
            >
              Go to Login Screen (Click "Admin Account")
            </Link>
            <Link to="/" className="text-xs text-slate-400 underline">
              Back to Farmer Store
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return children;
}

function MainLayout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hide standard navbar on Admin Portal to give full console experience */}
      {!isAdminPath && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/book-tractor" element={<TractorBookingPage />} />
          <Route path="/add-tractor" element={<AddTractorPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/track-booking/:id" element={<LiveTrackingPage />} />
          <Route path="/track-booking" element={<LiveTrackingPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Control Center */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
