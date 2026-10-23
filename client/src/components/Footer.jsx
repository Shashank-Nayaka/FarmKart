import React from 'react';
import { Tractor, ShieldCheck, Truck, Clock, Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      {/* 4 Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/60">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">On-Demand Spot Tractors</h4>
              <p className="text-xs text-slate-400 mt-0.5">Book nearby tractors and field mechanics within minutes.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/60">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Direct Farm Gate Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Certified seeds, fertilizers & tools shipped to your village.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/60">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Genuine & Subsidized</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct from certified ICAR, IFFCO & authorized dealers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/60">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Emergency Field Service</h4>
              <p className="text-xs text-slate-400 mt-0.5">On-spot breakdown mechanic dispatched on the field.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Tractor className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white">Farm<span className="text-emerald-500">Kart</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering rural farmers with seamless tractor hiring, on-spot breakdown assistance, and an agricultural marketplace for quality farming inputs.
          </p>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">On-Demand Services</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>🚜 Tractor Plowing & Tilling</li>
            <li>🌾 Combine Harvester Booking</li>
            <li>🌱 Precision Sowing & Seed Drilling</li>
            <li>🚜 Rotavator & Land Leveling</li>
            <li>🔧 On-Spot Tractor Breakdown Repair</li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Krishi Market</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>🌾 Certified High Yield Seeds</li>
            <li>🧪 Fertilizers & Organic Manure</li>
            <li>🛡️ Bio-Pesticides & Crop Protection</li>
            <li>⚡ Battery Sprayers & Farm Tools</li>
            <li>💧 Drip Irrigation & Pipes</li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Kisan Support & Hub</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Toll Free: 1800-425-FARM</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>support@farmkart.krishi.in</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Krishi Bhavan, Mandya District</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 FarmKart AgriTech. CSE Final Year Major Project by pair programming.</p>
      </div>
    </footer>
  );
}
