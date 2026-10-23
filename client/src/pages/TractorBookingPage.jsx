import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LiveTrackingMap from '../components/LiveTrackingMap';
import { 
  Tractor, 
  MapPin, 
  Wrench, 
  Clock, 
  IndianRupee, 
  CheckCircle, 
  ShieldCheck, 
  Navigation, 
  Calendar,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  Flame,
  ArrowRight
} from 'lucide-react';

const SERVICES = [
  {
    id: 'plow',
    name: 'Tractor Plowing / Tilling',
    description: 'Deep furrow plowing and soil preparation with 7-9 tyne cultivators',
    unit: 'Hours',
    baseRate: 850,
    icon: Tractor,
    badge: 'Popular',
  },
  {
    id: 'rotavator',
    name: 'Rotavator Field Leveling',
    description: 'Fine soil pulverization, clod crushing & weed eradication',
    unit: 'Hours',
    baseRate: 900,
    icon: Sparkles,
    badge: 'High Demand',
  },
  {
    id: 'sowing',
    name: 'Crop Sowing / Seeding',
    description: 'Precision seed drilling with fertilizer placement attachment',
    unit: 'Acres',
    baseRate: 1100,
    icon: Sparkles,
  },
  {
    id: 'harvest',
    name: 'Crop Harvesting',
    description: 'Multi-crop self-propelled combine harvester for Paddy & Wheat',
    unit: 'Acres',
    baseRate: 2200,
    icon: Flame,
    badge: 'Seasonal',
  },
  {
    id: 'trolley',
    name: 'Trolley Agri-Transport',
    description: 'Hydraulic tipping trolley for crop transport to APMC Mandi or storage',
    unit: 'Hours',
    baseRate: 750,
    icon: Navigation,
  },
  {
    id: 'repair',
    name: 'On-Spot Tractor Breakdown Repair & Mechanic',
    description: '🚨 Mobile mechanic dispatched to your exact field with tools & genuine spares for breakdown',
    unit: 'Fixed Service Visit',
    baseRate: 450,
    icon: Wrench,
    badge: 'Emergency Spot Service',
    isEmergency: true,
  },
];

export default function TractorBookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [availableTractors, setAvailableTractors] = useState([]);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [workSize, setWorkSize] = useState(2); // hours or acres
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash After Service');
  const [serviceDate, setServiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('Immediate / Next Available Slot (Spot)');

  // Farm Location
  const [location, setLocation] = useState({
    village: user?.village || 'Holenarasipura Farm',
    landmark: 'Near Canal Irrigation Gate',
    talukDistrict: user?.district || 'Mandya District',
    pincode: user?.pincode || '571402',
  });

  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    fetchTractors();
  }, []);

  const fetchTractors = async () => {
    try {
      const { data } = await API.get('/tractors');
      setAvailableTractors(data);
      if (data.length > 0) {
        setSelectedTractor(data[0]);
      }
    } catch (err) {
      console.error('Failed to load tractors:', err);
    }
  };

  // Autofill with logged-in user profile
  const handleAutofillProfile = () => {
    if (user) {
      setLocation({
        village: user.village || 'Mandya Rural Farm',
        landmark: 'Gowda Farm Plot #4',
        talukDistrict: user.district || 'Mandya District',
        pincode: user.pincode || '571401',
      });
    }
  };

  // Calculate estimated total cost
  const rateToUse = selectedTractor
    ? selectedService.unit === 'Acres'
      ? selectedTractor.ratePerAcre
      : selectedTractor.ratePerHour
    : selectedService.baseRate;

  const totalCost = selectedService.isEmergency
    ? selectedService.baseRate
    : rateToUse * workSize;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!location.village || !location.talukDistrict) {
      alert('Please fill in your farm village and district.');
      return;
    }

    setLoading(true);

    try {
      const bookingPayload = {
        serviceType: selectedService.name,
        farmLocation: {
          village: location.village,
          landmark: location.landmark,
          talukDistrict: location.talukDistrict,
          pincode: location.pincode,
          approxAcreOrHours: selectedService.isEmergency ? 1 : Number(workSize),
          pricingUnit: selectedService.unit,
        },
        serviceDate,
        timeSlot,
        estimatedCost: totalCost,
        paymentMethod,
        assignedTractor: selectedTractor?._id,
      };

      const { data } = await API.post('/bookings', bookingPayload);
      setBookingSuccess(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Success Banner */}
          <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="bg-emerald-800 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700">
                  BOOKING CONFIRMED • #{bookingSuccess._id.slice(-6).toUpperCase()}
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2">
                  Tractor Dispatched to Your Farm!
                </h2>
                <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                  Your request for <strong>{bookingSuccess.serviceType}</strong> at <strong>{bookingSuccess.farmLocation?.village}</strong> is confirmed. Track your operator live on Google Maps below.
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => navigate(`/track-booking/${bookingSuccess._id}`)}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-white hover:bg-slate-100 text-emerald-800 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full-Screen Radar</span>
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>My Bookings History</span>
              </button>
            </div>
          </div>

          {/* Live Google Map Tracking Component */}
          <LiveTrackingMap booking={bookingSuccess} />

          {/* Quick Footer Action strip */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setBookingSuccess(null);
                navigate('/book-tractor');
              }}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              ← Book Another Tractor Service
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Return to Krishi Bazaar Store →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Tractor className="w-3.5 h-3.5" />
            <span>On-Demand Rural Machinery Hailing System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Book Tractor & Spot Mechanic to Your Farm
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Choose farm operations, select verified nearby tractors, or call an emergency spot mechanic for sudden field breakdowns with live dispatching.
          </p>
        </div>

        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Booking Options Wizard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Farm Location */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Farm & Village Location</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillProfile}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                >
                  Use My Profile Location
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Village / Farm Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Holenarasipura Farm Gate #2"
                      value={location.village}
                      onChange={(e) => setLocation({ ...location, village: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Landmark / Irrigation Canal / Gate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Big Banyan Tree or Primary School"
                    value={location.landmark}
                    onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Taluk / District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mandya District"
                    value={location.talukDistrict}
                    onChange={(e) => setLocation({ ...location, talukDistrict: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 571401"
                    value={location.pincode}
                    onChange={(e) => setLocation({ ...location, pincode: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Select Agricultural Service */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">Select Farm Operation or Spot Service</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = selectedService.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? srv.isEmergency
                            ? 'border-rose-500 bg-rose-50/50'
                            : 'border-emerald-600 bg-emerald-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {srv.badge && (
                        <span className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
                          srv.isEmergency 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {srv.badge}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`p-2 rounded-lg ${srv.isEmergency ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">
                            {srv.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {srv.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          ₹{srv.baseRate} <span className="text-[10px] font-normal text-slate-500">/ {srv.unit}</span>
                        </span>
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {isSelected ? '✓ Selected' : 'Choose'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Work Duration / Land Size & Schedule */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">Duration, Land Size & Schedule</h3>
              </div>

              {!selectedService.isEmergency && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Estimated Work Size ({selectedService.unit})
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 6, 8].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setWorkSize(val)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          workSize === val
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {val} {selectedService.unit}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white font-medium"
                  >
                    <option value="Immediate / Next Available Slot (Spot)">⚡ Immediate / Spot Booking</option>
                    <option value="Early Morning (06:00 AM - 10:00 AM)">Early Morning (06:00 AM - 10:00 AM)</option>
                    <option value="Afternoon (11:00 AM - 03:00 PM)">Afternoon (11:00 AM - 03:00 PM)</option>
                    <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Available Local Fleet / Select Machine */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Select Preferred Tractor / Fleet</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {availableTractors.length} verified machines active nearby
                </span>
              </div>

              <div className="space-y-3">
                {availableTractors.map((tractor) => {
                  const isSelected = selectedTractor?._id === tractor._id;
                  return (
                    <div
                      key={tractor._id}
                      onClick={() => setSelectedTractor(tractor)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={tractor.imageUrl}
                          alt={tractor.tractorName}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">
                              {tractor.tractorName}
                            </h4>
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {tractor.hp > 0 ? `${tractor.hp} HP` : 'Mobile Van'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Owner: <strong>{tractor.ownerName}</strong> • {tractor.village}, {tractor.district}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {tractor.implements.slice(0, 3).map((imp, idx) => (
                              <span key={idx} className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                + {imp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div>
                          <span className="text-base font-black text-slate-900">
                            ₹{tractor.ratePerHour}
                          </span>
                          <span className="text-[11px] text-slate-500">/hr</span>
                        </div>
                        <span className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {isSelected ? '✓ Selected Machine' : 'Click to Pick'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Fare Estimate & Instant Dispatch Card (Ride-Hailing Style) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md sticky top-24 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  Estimated Fare Summary
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Transparent Rate
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Selected Service</span>
                  <span className="font-semibold text-slate-900">{selectedService.name}</span>
                </div>

                {!selectedService.isEmergency && (
                  <>
                    <div className="flex justify-between">
                      <span>Rate per {selectedService.unit}</span>
                      <span className="font-semibold text-slate-900">₹{rateToUse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Duration / Area</span>
                      <span className="font-semibold text-slate-900">{workSize} {selectedService.unit}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span>Operator & Diesel Allowance</span>
                  <span className="font-semibold text-emerald-700">Included (Free)</span>
                </div>

                <div className="flex justify-between">
                  <span>Village Gate Dispatch Fee</span>
                  <span className="font-semibold text-emerald-700">₹0 (Zero Surge)</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                  <span>Total Estimated Cost</span>
                  <span className="text-xl text-emerald-700 font-black">₹{totalCost}</span>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Payment Preference
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash After Service"
                      checked={paymentMethod === 'Cash After Service'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <strong className="text-slate-800">Cash After Work / On-Spot</strong>
                      <p className="text-[11px] text-slate-500">Pay the tractor driver after inspection in your farm</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI Payment"
                      checked={paymentMethod === 'UPI Payment'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <strong className="text-slate-800">UPI / QR Code (PhonePe, GPay)</strong>
                      <p className="text-[11px] text-slate-500">Scan & pay operator directly via UPI</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Booking CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer text-sm"
              >
                {loading ? (
                  <span>Locating & Dispatching Nearest Operator...</span>
                ) : (
                  <>
                    <Tractor className="w-5 h-5" />
                    <span>Confirm & Book Tractor Now</span>
                  </>
                )}
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-tight">
                <strong>⚡ How it works:</strong> Once you click book, your farm location is sent to our central Admin Dispatcher. The admin assigns the nearest tractor and operator details appear in your booking timeline!
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
