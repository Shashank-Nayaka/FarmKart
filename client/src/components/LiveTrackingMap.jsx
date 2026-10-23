import React, { useState, useEffect } from 'react';
import { 
  Tractor, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Layers, 
  Gauge, 
  Compass, 
  CheckCircle2, 
  Copy, 
  Share2, 
  RotateCcw, 
  FastForward, 
  AlertCircle,
  Sparkles,
  Wrench,
  Fuel
} from 'lucide-react';

export default function LiveTrackingMap({ booking, onClose }) {
  if (!booking) return null;

  // View modes: 'satellite' | 'roadmap' | 'radar'
  const [viewMode, setViewMode] = useState('radar');
  const [copied, setCopied] = useState(false);

  // Simulated live progress along route (0% to 100%)
  const [tripProgress, setTripProgress] = useState(25);
  const [isSimulating, setIsSimulating] = useState(true);

  // Fallback driver details
  const driverName = booking.assignedDriverName || 'Suresh Kumar (Certified Tractor Pilot)';
  const driverPhone = booking.assignedDriverPhone || '9845011223';
  const vehicleDetails = booking.assignedVehicleDetails || 'Mahindra 575 DI Sarpanch (KA-11-TR-4589)';
  const serviceOtp = booking.serviceOtp || '4829';

  // Format destination query for Google Maps
  const village = booking.farmLocation?.village || 'Mandya Rural Farm';
  const landmark = booking.farmLocation?.landmark || '';
  const district = booking.farmLocation?.talukDistrict || 'Mandya District';
  const destinationQuery = `${village}, ${landmark ? landmark + ', ' : ''}${district}, Karnataka, India`;
  const originQuery = `Agri Equipment Depot, ${district}, Karnataka`;

  // Google Maps Embed URL
  // t=k is Satellite/Hybrid, t=m is Standard Roadmap
  const mapTypeParam = viewMode === 'satellite' ? 'k' : 'm';
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destinationQuery)}&t=${mapTypeParam}&z=14&ie=UTF8&iwloc=&output=embed`;

  // External turn-by-turn directions link in official Google Maps
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originQuery)}&destination=${encodeURIComponent(destinationQuery)}&travelmode=driving`;

  // Dynamic route simulation effect
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTripProgress((prev) => {
        if (prev >= 100) return 100;
        return Number((prev + 0.8).toFixed(1));
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Derived telemetry metrics based on tripProgress
  const totalDistanceKm = 4.2;
  const remainingDistanceKm = Math.max(0, Number((totalDistanceKm * (1 - tripProgress / 100)).toFixed(1)));
  const remainingMinutes = Math.max(1, Math.round(remainingDistanceKm * 3.5));
  const currentSpeed = tripProgress >= 100 ? 0 : 24 + Math.round((tripProgress % 5) * 1.5);

  // Checkpoints
  const getCheckpointStatus = () => {
    if (tripProgress >= 100) return { title: 'Tractor Arrived at Farm Gate!', sub: 'Share your 4-digit OTP with the pilot to begin field plowing.' };
    if (tripProgress >= 75) return { title: 'Entering Village Canal Bund Road', sub: 'Approaching nearest landmark: ' + (landmark || 'Primary School') };
    if (tripProgress >= 50) return { title: 'Cruising on Rural Road MDR-42', sub: 'Crossing Village Lake Bridge at 28 km/h' };
    if (tripProgress >= 25) return { title: 'Departed Central Equipment Hub', sub: 'En route along Taluk Highway with implements attached' };
    return { title: 'Operator Pre-Trip Inspection Complete', sub: 'Fuel filled & hydraulic gear connected' };
  };

  const checkpoint = getCheckpointStatus();

  // Copy tracking link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/track-booking/${booking._id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Jump simulation ahead (convenient for presentations / viva)
  const handleFastForward = () => {
    setTripProgress((prev) => {
      if (prev < 50) return 65;
      if (prev < 90) return 92;
      return 100;
    });
  };

  const handleReset = () => {
    setTripProgress(15);
  };

  // Coordinates on simulated SVG radar map
  // Start point (Depot): (60, 260)
  // End point (Farm): (440, 70)
  // Curve points: (160, 220), (220, 140), (320, 160), (380, 100)
  const calculateVehiclePosition = (pct) => {
    const t = pct / 100;
    // Cubic bezier interpolation approximation
    const p0 = { x: 70, y: 250 };
    const p1 = { x: 180, y: 220 };
    const p2 = { x: 260, y: 120 };
    const p3 = { x: 440, y: 70 };

    const x = Math.round(
      Math.pow(1 - t, 3) * p0.x +
      3 * Math.pow(1 - t, 2) * t * p1.x +
      3 * (1 - t) * Math.pow(t, 2) * p2.x +
      Math.pow(t, 3) * p3.x
    );

    const y = Math.round(
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * p1.y +
      3 * (1 - t) * Math.pow(t, 2) * p2.y +
      Math.pow(t, 3) * p3.y
    );

    return { x, y };
  };

  const vehiclePos = calculateVehiclePosition(tripProgress);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all animate-in fade-in duration-300">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Navigation className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight">
                Live Google Maps Vehicle Dispatch
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                GPS LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Booking #{booking._id?.slice(-6).toUpperCase()} • {booking.serviceType}
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'radar'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            📡 Live Radar HUD
          </button>
          <button
            onClick={() => setViewMode('satellite')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'satellite'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🛰️ Google Satellite
          </button>
          <button
            onClick={() => setViewMode('roadmap')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'roadmap'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🗺️ Google Roadmap
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-950 overflow-hidden">
        {viewMode === 'radar' ? (
          /* Animated Vector GPS Radar View */
          <div className="relative w-full h-full select-none flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950">
            {/* Grid Pattern overlay */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                backgroundSize: '28px 28px'
              }}
            />

            {/* Simulated Geographic Landscape (Canal river, field contours) */}
            <svg 
              viewBox="0 0 500 320" 
              className="w-full h-full object-cover pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Farm Fields representation */}
              <rect x="30" y="40" width="110" height="70" rx="8" fill="#064e3b" fillOpacity="0.3" stroke="#047857" strokeWidth="0.8" strokeDasharray="3 3" />
              <text x="40" y="65" fill="#6ee7b7" fontSize="9" fontWeight="bold">Sugarcane Plot</text>

              <rect x="290" y="160" width="130" height="90" rx="8" fill="#064e3b" fillOpacity="0.25" stroke="#047857" strokeWidth="0.8" strokeDasharray="3 3" />
              <text x="305" y="185" fill="#6ee7b7" fontSize="9" fontWeight="bold">Paddy Field Block A</text>

              {/* Water Canal */}
              <path 
                d="M 0,180 Q 150,160 250,210 T 500,190" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="7" 
                strokeOpacity="0.35" 
              />
              <text x="210" y="175" fill="#38bdf8" fontSize="8" fontStyle="italic">Irrigation Canal</text>

              {/* Rural Secondary Roads */}
              <path d="M 70,0 L 70,320" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" strokeOpacity="0.6" />
              <path d="M 0,250 L 500,250" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" strokeOpacity="0.6" />

              {/* Live Driving Route Polyline */}
              <path
                d="M 70,250 C 180,220 260,120 440,70"
                fill="none"
                stroke="#0f766e"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 70,250 C 180,220 260,120 440,70"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="6 4"
                filter="url(#glow)"
              />

              {/* Origin Marker: Central Equipment Depot */}
              <g transform="translate(70, 250)">
                <circle r="16" fill="#047857" fillOpacity="0.3" className="animate-ping" />
                <circle r="9" fill="#065f46" stroke="#10b981" strokeWidth="2" />
                <text x="-40" y="24" fill="#a7f3d0" fontSize="9" fontWeight="bold">Agri Depot</text>
              </g>

              {/* Destination Marker: Customer's Booked Farm */}
              <g transform="translate(440, 70)">
                <circle r="22" fill="#eab308" fillOpacity="0.25" className="animate-ping" />
                <circle r="12" fill="#854d0e" stroke="#facc15" strokeWidth="2.5" />
                <circle r="4" fill="#ffffff" />
                <text x="-65" y="-18" fill="#fde047" fontSize="10" fontWeight="extrabold">
                  📍 {village}
                </text>
                <text x="-50" y="-6" fill="#cbd5e1" fontSize="8">
                  (Your Farm Gate)
                </text>
              </g>

              {/* Moving Vehicle Marker (Tractor) */}
              <g transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`}>
                <circle r="20" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
                <circle r="14" fill="#059669" stroke="#ffffff" strokeWidth="2.5" filter="url(#glow)" />
              </g>
            </svg>

            {/* DOM Element on top of SVG for Tractor Icon with Rotation and Label */}
            <div
              className="absolute transition-all duration-700 ease-out flex flex-col items-center pointer-events-none"
              style={{
                left: `${(vehiclePos.x / 500) * 100}%`,
                top: `${(vehiclePos.y / 320) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 border-2 border-white animate-bounce-gentle">
                <Tractor className="w-5 h-5" />
              </div>
              <div className="bg-slate-900/90 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 mt-1 whitespace-nowrap shadow-md">
                🚜 {vehicleDetails.split(' ')[0]} • {currentSpeed} km/h
              </div>
            </div>

            {/* Radar Simulation Controls (Floating pill on bottom-right) */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700">
              <button
                onClick={handleFastForward}
                title="Fast forward simulation to next checkpoint"
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FastForward className="w-3 h-3 text-amber-400" />
                <span>Fast-Forward ⏩</span>
              </button>
              <button
                onClick={handleReset}
                title="Reset simulation to depot"
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Official Google Maps Embed Iframe (Satellite or Roadmap) */
          <div className="relative w-full h-full">
            <iframe
              title="Google Maps Live Tractor Tracking"
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />

            {/* Map Mode indicator tag */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>
                {viewMode === 'satellite' ? 'Google Satellite Hybrid View' : 'Google Roadmap View'}
              </span>
            </div>
          </div>
        )}

        {/* Top-Right Floating Telemetry Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-4">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" /> ETA Arrival
            </div>
            <div className="text-sm font-black text-emerald-400">
              {tripProgress >= 100 ? 'Arrived!' : `${remainingMinutes} mins`}
            </div>
          </div>
          <div className="h-7 w-[1px] bg-slate-700"></div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" /> Distance
            </div>
            <div className="text-sm font-black text-slate-200">
              {tripProgress >= 100 ? '0 km' : `${remainingDistanceKm} km`}
            </div>
          </div>
        </div>

        {/* Floating Checkpoint Status Banner */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white p-3 rounded-2xl shadow-xl flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            tripProgress >= 100 ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {tripProgress >= 100 ? <CheckCircle2 className="w-5 h-5" /> : <Tractor className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">
              {checkpoint.title}
            </h4>
            <p className="text-[10px] text-slate-300 truncate">
              {checkpoint.sub}
            </p>
          </div>
        </div>
      </div>

      {/* Ride Progress Bar */}
      <div className="bg-slate-100 h-2 w-full overflow-hidden flex">
        <div 
          className="bg-emerald-500 h-full transition-all duration-700 ease-out"
          style={{ width: `${tripProgress}%` }}
        />
      </div>

      {/* Driver, Equipment & OTP Control Center */}
      <div className="p-6 bg-white space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Operator Profile */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center text-lg font-black shadow-md shadow-emerald-600/20 shrink-0">
              {driverName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 truncate">
                  {driverName}
                </h4>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  ★ 4.9
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                {vehicleDetails}
              </p>
              <div className="mt-2">
                <a
                  href={`tel:${driverPhone}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Operator ({driverPhone})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Service Security OTP Card */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Service Start PIN
                </span>
                <span className="bg-amber-200/80 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Confidential
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono tracking-widest text-slate-900">
                  {serviceOtp}
                </span>
                <span className="text-[11px] text-amber-800">
                  (Single-Use OTP)
                </span>
              </div>
            </div>
            <p className="text-[10px] text-amber-700 mt-2">
              ⚠️ Share this 4-digit code with the tractor driver only when they arrive at your field.
            </p>
          </div>

          {/* Booked Location & Direct Google Maps Navigation */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Target Farm Destination
              </span>
              <h5 className="text-xs font-bold text-slate-900 mt-1 truncate">
                {village}
              </h5>
              <p className="text-[11px] text-slate-500 truncate">
                {landmark ? `Near ${landmark}, ` : ''}{district}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Maps App</span>
              </a>
              <button
                onClick={handleCopyLink}
                title="Copy live tracking link"
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action strip */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            <span>Payment: <strong>{booking.paymentMethod}</strong> (₹{booking.estimatedCost})</span>
            <span>•</span>
            <span>Status: <strong className="text-emerald-700">{booking.status}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">
              Need Help? Kisan Emergency Helpline:
            </span>
            <a
              href="tel:18004253276"
              className="text-emerald-700 font-black hover:underline"
            >
              1800-425-FARM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
