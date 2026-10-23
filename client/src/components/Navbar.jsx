import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Tractor, 
  ShoppingBag, 
  ShoppingCart, 
  Calendar, 
  PlusCircle, 
  User, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X, 
  Wrench,
  Sparkles,
  PhoneCall,
  Navigation
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, quickSwitchRole, isAdmin } = useAuth();
  const { itemsCount, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-sm">
      {/* Top Rural Farmer Assistance Strip */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-yellow-300 font-semibold px-2 py-0.5 rounded text-[11px] tracking-wide">
              KRISHI SEVA
            </span>
            <span>⚡ Instant On-Spot Tractor Booking & Express Agri Input Delivery to Village Farms</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-yellow-400" />
              Kisan Helpline: <strong className="text-white font-mono">1800-425-FARM</strong>
            </span>
            <div className="hidden md:flex items-center gap-2 border-l border-emerald-700 pl-3">
              <button
                onClick={() => quickSwitchRole(user?.role === 'admin' ? 'farmer' : 'admin')}
                className="text-yellow-300 hover:text-white underline font-medium text-[11px] transition-colors cursor-pointer"
                title="Quickly switch between Demo Farmer and Admin for presentation testing"
              >
                Switch to {user?.role === 'admin' ? '🌾 Farmer View' : '⚙️ Admin View'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Farm<span className="text-emerald-600">Kart</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide border border-amber-200">
                  SMART AGRI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5">
                On-Demand Tractors & Krishi Bazaar
              </p>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/') 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Krishi Bazaar
            </Link>

            <Link
              to="/book-tractor"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/book-tractor') 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Tractor className="w-4 h-4 text-emerald-600" />
              Book Tractor & Spot Service
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                LIVE
              </span>
            </Link>

            <Link
              to="/add-tractor"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/add-tractor') 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              List My Tractor
            </Link>

            <Link
              to="/my-bookings"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/my-bookings') 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              My Bookings
            </Link>

            <Link
              to="/track-booking"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/track-booking') 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Live GPS Tracking</span>
            </Link>

            <Link
              to="/my-orders"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/my-orders') 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              My Orders
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <Link
              to="/admin"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isAdmin || location.pathname.startsWith('/admin')
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </Link>

            {/* User Account Pill */}
            {user ? (
              <div className="relative group">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                    {user.role}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            Krishi Bazaar (Seeds & Fertilizers)
          </Link>
          <Link
            to="/book-tractor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Tractor className="w-4 h-4 text-emerald-600" />
            Book Tractor & Spot Service (Live On-Demand)
          </Link>
          <Link
            to="/add-tractor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <PlusCircle className="w-4 h-4 text-amber-600" />
            Add / List My Tractor
          </Link>
          <Link
            to="/my-bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            My Tractor Bookings
          </Link>
          <Link
            to="/track-booking"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
            Live GPS Map Tracking
          </Link>
          <Link
            to="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            My Orders & Tracking
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <User className="w-4 h-4 text-slate-600" />
            Farmer Profile & Settings
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Go to Admin Control Center
          </Link>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                quickSwitchRole(user?.role === 'admin' ? 'farmer' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-emerald-700 font-semibold underline"
            >
              Switch Demo Role: ({user?.role === 'admin' ? 'Farmer' : 'Admin'})
            </button>
            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="text-xs text-rose-600 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
