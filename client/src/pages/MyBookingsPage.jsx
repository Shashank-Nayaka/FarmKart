import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Tractor, 
  MapPin, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Navigation,
  Wrench,
  Calendar,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LiveTrackingMap from '../components/LiveTrackingMap';

const STATUS_STEPS = ['Requested', 'Assigned', 'On The Way', 'In Progress', 'Completed'];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrackingId, setActiveTrackingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this tractor booking request?')) {
      try {
        await API.put(`/bookings/${id}/cancel`);
        fetchBookings();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Real-Time Hailing History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Tractor & Spot Service Bookings
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track assigned tractors, driver contact numbers, arrival ETA and service progress
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBookings}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <Link
              to="/book-tractor"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <Tractor className="w-4 h-4" />
              <span>Book New Tractor</span>
            </Link>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-12 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <Tractor className="w-14 h-14 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">No tractor bookings found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't requested any tractors or spot repair service yet. Need plowing, harvesting or breakdown help?
            </p>
            <Link
              to="/book-tractor"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors"
            >
              <Tractor className="w-4 h-4" />
              <span>Book a Tractor Now</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const currentStepIdx = STATUS_STEPS.indexOf(booking.status);
              const isCancelled = booking.status === 'Cancelled';

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Top Bar */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Tractor className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">
                            {booking.serviceType}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            #{booking._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Requested for <strong>{booking.serviceDate}</strong> • {booking.timeSlot}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill & Tracking Actions */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                          isCancelled
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : booking.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : booking.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {booking.status === 'Requested' ? '⏳ Dispatching Operator...' : booking.status}
                      </span>

                      {!isCancelled && (
                        <>
                          <button
                            onClick={() => setActiveTrackingId(activeTrackingId === booking._id ? null : booking._id)}
                            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          >
                            <span>{activeTrackingId === booking._id ? 'Close Map' : '🗺️ Quick Map'}</span>
                          </button>
                          <Link
                            to={`/track-booking/${booking._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Live Map</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-6">
                    {/* Inline Live Map View when toggled */}
                    {activeTrackingId === booking._id && (
                      <div className="pb-2 animate-in fade-in duration-200">
                        <LiveTrackingMap booking={booking} />
                      </div>
                    )}
                    {/* Live Progress Bar (Ride-Hailing style) */}
                    {!isCancelled && (
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-2">
                          {STATUS_STEPS.map((step, idx) => (
                            <span
                              key={step}
                              className={idx <= currentStepIdx ? 'text-emerald-700' : 'text-slate-400'}
                            >
                              {step}
                            </span>
                          ))}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                          {STATUS_STEPS.map((step, idx) => (
                            <div
                              key={step}
                              className={`flex-1 h-full border-r border-white ${
                                idx <= currentStepIdx
                                  ? 'bg-emerald-600'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2-Column Info: Farm Location & Assigned Machine */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Farm Location Details */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          Booked Farm Location
                        </h4>
                        <p className="text-xs text-slate-700 font-semibold">
                          {booking.farmLocation.village}
                        </p>
                        {booking.farmLocation.landmark && (
                          <p className="text-xs text-slate-500">
                            Landmark: {booking.farmLocation.landmark}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">
                          {booking.farmLocation.talukDistrict} - {booking.farmLocation.pincode}
                        </p>
                        <p className="text-xs text-emerald-700 font-bold pt-1 border-t border-slate-200">
                          Duration/Area: {booking.farmLocation.approxAcreOrHours} {booking.farmLocation.pricingUnit}
                        </p>
                      </div>

                      {/* Assigned Driver & Machine Details */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                          Assigned Operator / Machine
                        </h4>

                        {booking.assignedDriverName ? (
                          <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-900">
                              {booking.assignedDriverName}
                            </p>
                            {booking.assignedVehicleDetails && (
                              <p className="text-xs text-slate-600 font-mono">
                                🚜 {booking.assignedVehicleDetails}
                              </p>
                            )}
                            {booking.assignedDriverPhone && (
                              <div className="pt-2 flex items-center gap-2">
                                <a
                                  href={`tel:${booking.assignedDriverPhone}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Call Operator ({booking.assignedDriverPhone})</span>
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            Waiting for Admin Dispatcher to assign nearest verified operator...
                          </p>
                        )}

                        {booking.adminNotes && (
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
                            <strong>Dispatcher Note:</strong> {booking.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom strip: Payment & Cancel option */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-slate-500">Total Estimated Fare: </span>
                          <span className="font-black text-slate-900 text-sm">
                            ₹{booking.estimatedCost}
                          </span>
                        </div>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                          {booking.paymentMethod} • {booking.paymentStatus}
                        </span>
                      </div>

                      {!isCancelled && booking.status !== 'Completed' && booking.status !== 'In Progress' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
