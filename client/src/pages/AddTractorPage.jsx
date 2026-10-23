import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Tractor, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  IndianRupee, 
  ShieldCheck, 
  MapPin, 
  Sparkles,
  Layers
} from 'lucide-react';

const POPULAR_BRANDS = ['Mahindra', 'John Deere', 'Swaraj', 'Sonalika', 'New Holland', 'Eicher', 'Massey Ferguson', 'Kubota', 'Preet'];
const IMPLEMENT_OPTIONS = ['Rotavator', '7-Tyne Cultivator', 'Disc Plough', 'Hydraulic MB Plough', 'Seed-cum-Fertilizer Drill', '4-Wheel Trolley (Hydraulic)', 'Laser Land Leveller', 'Post Hole Digger'];

export default function AddTractorPage() {
  const { user } = useAuth();
  const [myTractors, setMyTractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    tractorName: 'Mahindra 475 DI Bhoomiputra',
    brand: 'Mahindra',
    modelYear: '2023',
    hp: 42,
    registrationNumber: 'KA-11-TR-7821',
    category: 'Standard Tractor',
    ratePerHour: 800,
    ratePerAcre: 1050,
    village: user?.village || 'Holenarasipura Farm',
    district: user?.district || 'Mandya',
    state: user?.state || 'Karnataka',
    pincode: user?.pincode || '571402',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1c?w=600',
    selectedImplements: ['Rotavator', '7-Tyne Cultivator'],
  });

  useEffect(() => {
    fetchMyTractors();
  }, []);

  const fetchMyTractors = async () => {
    try {
      const { data } = await API.get('/tractors/my-tractors');
      setMyTractors(data);
    } catch (err) {
      console.error('Failed to load my tractors:', err);
    }
  };

  const handleImplementToggle = (imp) => {
    setFormData((prev) => {
      const exists = prev.selectedImplements.includes(imp);
      const newImplements = exists
        ? prev.selectedImplements.filter((i) => i !== imp)
        : [...prev.selectedImplements, imp];
      return { ...prev, selectedImplements: newImplements };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const payload = {
        tractorName: formData.tractorName,
        brand: formData.brand,
        modelYear: formData.modelYear,
        hp: Number(formData.hp),
        registrationNumber: formData.registrationNumber,
        category: formData.category,
        ratePerHour: Number(formData.ratePerHour),
        ratePerAcre: Number(formData.ratePerAcre),
        village: formData.village,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        imageUrl: formData.imageUrl,
        implements: formData.selectedImplements,
      };

      await API.post('/tractors', payload);
      setSuccessMsg('Your tractor has been successfully added to the FarmKart Fleet!');
      fetchMyTractors();
      // Reset form slightly
      setFormData((prev) => ({
        ...prev,
        registrationNumber: '',
      }));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add tractor');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (tractor) => {
    try {
      await API.put(`/tractors/${tractor._id}`, {
        isAvailable: !tractor.isAvailable,
      });
      fetchMyTractors();
    } catch (error) {
      alert('Failed to update availability');
    }
  };

  const handleDeleteTractor = async (tractorId) => {
    if (window.confirm('Are you sure you want to remove this tractor listing?')) {
      try {
        await API.delete(`/tractors/${tractorId}`);
        fetchMyTractors();
      } catch (error) {
        alert('Failed to remove tractor');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Kisan Machinery Partner Program</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            List Your Tractor & Earn Rental Income
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Tractor-owning farmers can register their tractors, rotavators, and harvesters. Connect with nearby farmers in your village and earn ₹800 - ₹2,500/hr during idle seasons!
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
              <Tractor className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Vehicle & Machinery Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tractor Model / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahindra 575 DI Sarpanch"
                    value={formData.tractorName}
                    onChange={(e) => setFormData({ ...formData, tractorName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Manufacturer *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white font-medium"
                  >
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Engine Power (HP) *
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    max="150"
                    placeholder="e.g. 45"
                    value={formData.hp}
                    onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration Plate Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KA-11-TR-4589"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Machine Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white font-medium"
                  >
                    <option value="Standard Tractor">Standard Tractor (40-60 HP)</option>
                    <option value="Mini Tractor">Mini Orchard Tractor (&lt; 40 HP)</option>
                    <option value="Heavy Harvester">Heavy Combine Harvester</option>
                    <option value="Spot Mechanic & Service">Spot Mechanic Mobile Van</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Model Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2023"
                    value={formData.modelYear}
                    onChange={(e) => setFormData({ ...formData, modelYear: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Hourly Rental Rate (₹/hr) *
                  </label>
                  <input
                    type="number"
                    required
                    min="300"
                    placeholder="e.g. 850"
                    value={formData.ratePerHour}
                    onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rate per Acre (₹/acre) *
                  </label>
                  <input
                    type="number"
                    required
                    min="400"
                    placeholder="e.g. 1100"
                    value={formData.ratePerAcre}
                    onChange={(e) => setFormData({ ...formData, ratePerAcre: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white font-bold"
                  />
                </div>
              </div>

              {/* Implements Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Attachable Implements & Accessories Included:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {IMPLEMENT_OPTIONS.map((imp) => {
                    const isChecked = formData.selectedImplements.includes(imp);
                    return (
                      <button
                        type="button"
                        key={imp}
                        onClick={() => handleImplementToggle(imp)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="line-clamp-1">{imp}</span>
                        <span className="text-[10px]">{isChecked ? '✓' : '+'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Village Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Home Village *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Machinery Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Machinery Photo URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <PlusCircle className="w-5 h-5" />
                <span>{loading ? 'Adding Vehicle to Fleet...' : 'Register & List My Tractor'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Farmer Earnings & My Fleet */}
          <div className="space-y-6">
            {/* Earnings Potential Card */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-md space-y-3">
              <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                Earn Regular Income
              </span>
              <h3 className="text-xl font-black leading-snug">
                Earn ₹25,000 - ₹50,000 / month from your idle tractor
              </h3>
              <p className="text-xs text-amber-100 leading-relaxed">
                During tilling, plowing, and harvest seasons, neighbor farmers in your taluk frequently need machinery on-demand.
              </p>
              <div className="pt-2 border-t border-amber-400/40 text-xs flex justify-between">
                <span>Direct Cash / UPI:</span>
                <strong>100% to Tractor Owner</strong>
              </div>
            </div>

            {/* My Listed Tractors */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>My Registered Fleet</span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full">
                  {myTractors.length} active
                </span>
              </h3>

              {myTractors.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  You haven't listed any tractor yet. Fill the form to list your first vehicle!
                </p>
              ) : (
                <div className="space-y-3">
                  {myTractors.map((tr) => (
                    <div
                      key={tr._id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={tr.imageUrl}
                          alt={tr.tractorName}
                          className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {tr.tractorName}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500">
                            {tr.registrationNumber} • {tr.hp} HP
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteTractor(tr._id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                        <span className="font-black text-slate-800">
                          ₹{tr.ratePerHour}/hr
                        </span>
                        <button
                          onClick={() => handleToggleAvailability(tr)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                            tr.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {tr.isAvailable ? '● Available for Hailing' : '○ Busy / Off Duty'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
