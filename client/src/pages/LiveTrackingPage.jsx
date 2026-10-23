import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LiveTrackingMap from '../components/LiveTrackingMap';
import { 
  Tractor, 
  MapPin, 
  ArrowLeft, 
  RefreshCw, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  AlertCircle,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function LiveTrackingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingData();
  }, [id]);

  const fetchBookingData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        const { data } = await API.get(`/bookings/${id}`);
        setBooking(data);
      } else {
        // Fetch user's latest active booking
        const { data } = await API.get('/bookings/my-bookings');
        if (data && data.length > 0) {
          setBooking(data[0]);
        } else {
          setError('No active tractor bookings found.');
        }
      }
    } catch (err) {
      console.error('Failed to load tracking data:', err);
      setError(err.response?.data?.message || 'Unable to retrieve booking tracking details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/my-bookings')}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-xs flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>My Bookings</span>
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Real-Time GPS Telematics</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Live Vehicle & Mechanic Radar Tracking
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBookingData}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <Link
              to="/book-tractor"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <Tractor className="w-4 h-4" />
              <span>Book Another</span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm animate-pulse">
            <Tractor className="w-12 h-12 text-emerald-500 animate-bounce mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Connecting to Vehicle Satellite GPS...</h3>
            <p className="text-xs text-slate-400">Fetching live tractor coordinates and telemetry</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">{error}</h3>
            <p className="text-xs text-slate-500">
              Please book a tractor or check your booking history in My Bookings.
            </p>
            <Link
              to="/book-tractor"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              <Tractor className="w-4 h-4" />
              <span>Book a Tractor Now</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* The Live Interactive Map */}
            <LiveTrackingMap booking={booking} />

            {/* Farm & Booking Detailed Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Service Booked
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1">
                  {booking.serviceType}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scheduled for {booking.serviceDate} • {booking.timeSlot}
                </p>
                <div className="mt-2 text-xs font-bold text-emerald-700">
                  Total Fare: ₹{booking.estimatedCost} ({booking.paymentMethod})
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Farm Coordinates & Landmark
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  {booking.farmLocation?.village}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Landmark: {booking.farmLocation?.landmark || 'Village Main Road'}
                </p>
                <p className="text-xs text-slate-500">
                  {booking.farmLocation?.talukDistrict} - {booking.farmLocation?.pincode}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Operational Guidelines
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  🚜 Ensure the field entry bund is clear for tractor wheel clearance.
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  🔑 Keep your 4-digit Security OTP ready when the operator enters your gate.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
