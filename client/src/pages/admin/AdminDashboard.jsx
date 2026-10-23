import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldAlert, 
  Tractor, 
  ShoppingBag, 
  Package, 
  Users, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  Navigation, 
  PhoneCall, 
  RefreshCw,
  Search,
  Check,
  X,
  ExternalLink,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'overview', 'bookings', 'products', 'tractors', 'orders'

  // Data states
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [tractors, setTractors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [assignModalBooking, setAssignModalBooking] = useState(null);
  const [assignForm, setAssignForm] = useState({
    tractorId: '',
    driverName: 'Suresh Kumar',
    driverPhone: '9845011223',
    vehicleDetails: 'Mahindra 575 DI (KA-11-TR-4589)',
    status: 'Assigned',
    adminNotes: 'Assigned nearest available operator from Mandya Depot.',
  });

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Seeds',
    price: 500,
    originalPrice: 650,
    stock: 25,
    unit: 'Pack',
    brand: 'KrishiGold',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400',
    keyFeatures: 'High Yield, Certified Quality',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes, tRes, oRes] = await Promise.all([
        API.get('/bookings/admin/all'),
        API.get('/products'),
        API.get('/tractors/admin/all'),
        API.get('/orders/admin/all'),
      ]);
      setBookings(bRes.data);
      setProducts(pRes.data);
      setTractors(tRes.data);
      setOrders(oRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- BOOKING DISPATCH OPERATIONS ---
  const handleOpenAssignModal = (booking) => {
    setAssignModalBooking(booking);
    setAssignForm({
      tractorId: booking.assignedTractor?._id || (tractors[0]?._id || ''),
      driverName: booking.assignedDriverName || 'Suresh Kumar',
      driverPhone: booking.assignedDriverPhone || '9845011223',
      vehicleDetails: booking.assignedVehicleDetails || 'Mahindra 575 DI (KA-11-TR-4589)',
      status: booking.status === 'Requested' ? 'Assigned' : booking.status,
      adminNotes: booking.adminNotes || `Dispatched to ${booking.farmLocation.village} location.`,
    });
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignModalBooking) return;

    try {
      await API.put(`/bookings/${assignModalBooking._id}/assign`, assignForm);
      setAssignModalBooking(null);
      fetchAllData();
      alert(`Tractor and operator successfully assigned to farm at ${assignModalBooking.farmLocation.village}!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign tractor');
    }
  };

  const handleQuickBookingStatus = async (bookingId, newStatus) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status: newStatus });
      fetchAllData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  // --- PRODUCT & STOCK OPERATIONS ---
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        unit: product.unit,
        brand: product.brand,
        description: product.description,
        imageUrl: product.imageUrl,
        keyFeatures: product.keyFeatures?.join(', ') || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: 'Seeds',
        price: 500,
        originalPrice: 650,
        stock: 30,
        unit: '25kg Bag',
        brand: 'KrishiGold',
        description: 'Certified agricultural seed for maximum germination and crop output.',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
        keyFeatures: 'High Yield, Disease Tolerant, Certified',
      });
    }
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, productForm);
      } else {
        await API.post('/products', productForm);
      }
      setProductModalOpen(false);
      fetchAllData();
      alert(`Product "${productForm.name}" updated in backend MongoDB dataset.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleUpdateStockInline = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await API.put(`/products/${productId}`, { stock: newStock });
      fetchAllData();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Delete this product permanently from the catalog?')) {
      try {
        await API.delete(`/products/${productId}`);
        fetchAllData();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  // --- ORDER STATUS OPERATIONS ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchAllData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // --- TRACTOR APPROVAL OPERATIONS ---
  const handleToggleTractorApproval = async (tractor) => {
    try {
      await API.put(`/tractors/${tractor._id}`, { isApproved: !tractor.isApproved });
      fetchAllData();
    } catch (err) {
      alert('Failed to toggle approval');
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.totalPrice : 0), 0);
  const activeBookingsCount = bookings.filter((b) => b.status !== 'Completed' && b.status !== 'Cancelled').length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Top Admin Bar */}
      <div className="bg-slate-950 border-b border-slate-800 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide text-white uppercase">
                  FarmKart Central Command & Dispatch Center
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-400/30">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connected to MongoDB Dataset • Live Dispatch & Stock Controller
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Dataset</span>
            </button>
            <Link
              to="/"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Back to Farmer View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: '📊 Overview & Stats' },
            { 
              id: 'bookings', 
              label: '🚜 Tractor Bookings & Dispatch', 
              badge: activeBookingsCount > 0 ? `${activeBookingsCount} Active` : null 
            },
            { 
              id: 'products', 
              label: '📦 Product & Stock Catalog', 
              badge: lowStockProducts.length > 0 ? `${lowStockProducts.length} Low Stock` : null 
            },
            { id: 'tractors', label: '🚜 Machinery Fleet' },
            { id: 'orders', label: '🛍️ Marketplace Orders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-slate-950 text-amber-300' : 'bg-rose-500 text-white animate-pulse'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-200">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Total Sales Revenue</span>
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">✓ Verified UPI & COD receipts</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Active Tractor Bookings</span>
                  <Tractor className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {activeBookingsCount}
                </div>
                <p className="text-[11px] text-amber-300 font-medium">{bookings.length} total bookings on platform</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Marketplace Orders</span>
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {orders.length}
                </div>
                <p className="text-[11px] text-blue-300 font-medium">Shipped directly to rural farms</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <span>Registered Machinery</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {tractors.length}
                </div>
                <p className="text-[11px] text-purple-300 font-medium">Tractors & harvesters in fleet</p>
              </div>
            </div>

            {/* Low Stock Warning Section */}
            {lowStockProducts.length > 0 && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    <span>INVENTORY STOCK ALERTS ({lowStockProducts.length} Products Low in Stock)</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs text-amber-300 underline font-bold"
                  >
                    Manage Products →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {lowStockProducts.map((p) => (
                    <div key={p._id} className="bg-slate-900/80 p-3.5 rounded-xl border border-amber-500/30 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-xs text-white line-clamp-1">{p.name}</h5>
                        <span className="text-[11px] text-amber-400 font-bold">Only {p.stock} units left!</span>
                      </div>
                      <button
                        onClick={() => handleUpdateStockInline(p._id, p.stock, 20)}
                        className="px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold text-[11px] rounded-lg hover:bg-amber-400 cursor-pointer"
                      >
                        +20 Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRACTOR BOOKINGS & DISPATCH CONTROLLER */}
        {activeTab === 'bookings' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-amber-400" />
                  <span>Real-Time Tractor & Spot Service Bookings</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  When a farmer books on-demand, assign the nearest operator, driver and vehicle to their exact farm location
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Farmer Details</th>
                      <th className="py-3 px-4">Booked Farm Location</th>
                      <th className="py-3 px-4">Service & Time</th>
                      <th className="py-3 px-4">Assigned Operator</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-750 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          #{booking._id.slice(-6).toUpperCase()}
                        </td>

                        <td className="py-3.5 px-4">
                          <strong className="text-white block font-bold">{booking.userName}</strong>
                          <span className="text-slate-400 font-mono text-[11px]">{booking.userPhone}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {booking.farmLocation.village}
                            </span>
                            {booking.farmLocation.landmark && (
                              <p className="text-[11px] text-slate-400">{booking.farmLocation.landmark}</p>
                            )}
                            <p className="text-[10px] text-slate-400">{booking.farmLocation.talukDistrict}</p>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-200 block">{booking.serviceType}</span>
                          <span className="text-[11px] text-slate-400">{booking.serviceDate} • {booking.timeSlot}</span>
                          <span className="text-[11px] font-bold text-amber-300 block">₹{booking.estimatedCost} ({booking.paymentMethod})</span>
                        </td>

                        <td className="py-3.5 px-4">
                          {booking.assignedDriverName ? (
                            <div>
                              <strong className="text-white block font-bold">{booking.assignedDriverName}</strong>
                              <span className="text-slate-400 text-[11px] font-mono">{booking.assignedVehicleDetails}</span>
                              {booking.assignedDriverPhone && (
                                <span className="text-emerald-400 text-[10px] block font-mono">📞 {booking.assignedDriverPhone}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-rose-400 font-bold italic">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                            booking.status === 'Completed'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : booking.status === 'Cancelled'
                              ? 'bg-rose-950 text-rose-300 border-rose-700'
                              : booking.status === 'Requested'
                              ? 'bg-amber-950 text-amber-300 border-amber-600 animate-pulse'
                              : 'bg-blue-950 text-blue-300 border-blue-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Link
                            to={`/track-booking/${booking._id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Live Map</span>
                          </Link>
                          <button
                            onClick={() => handleOpenAssignModal(booking)}
                            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black shadow-xs cursor-pointer"
                          >
                            Assign / Dispatch
                          </button>

                          {/* Quick Status Progression */}
                          <select
                            value={booking.status}
                            onChange={(e) => handleQuickBookingStatus(booking._id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-300 px-2 py-1 font-semibold"
                          >
                            <option value="Requested">Requested</option>
                            <option value="Assigned">Assigned</option>
                            <option value="On The Way">On The Way</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT & REAL-TIME STOCK CATALOG */}
        {activeTab === 'products' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  <span>Agricultural Catalog & Real-Time Stock Controller</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update product prices and maintain inventory stock in the backend dataset. Customer checkout verifies stock in real-time.
                </p>
              </div>

              <button
                onClick={() => handleOpenProductModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product to Dataset</span>
              </button>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category & Brand</th>
                      <th className="py-3 px-4">Price & MRP</th>
                      <th className="py-3 px-4">Real-Time Stock Count</th>
                      <th className="py-3 px-4">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {products.map((prod) => (
                      <tr key={prod._id} className="hover:bg-slate-750 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-700 flex-shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-white text-xs">{prod.name}</h4>
                              <span className="text-[11px] text-slate-400">{prod.unit}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {prod.category}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5 font-bold">
                            {prod.brand}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-white font-black text-sm">₹{prod.price}</span>
                            <span className="text-slate-500 line-through text-[11px]">₹{prod.originalPrice}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {/* Stock Quick Adjustment */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStockInline(prod._id, prod.stock, -5)}
                              className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 font-bold flex items-center justify-center cursor-pointer"
                              title="Decrease stock by 5"
                            >
                              -
                            </button>
                            <span className="font-mono font-black text-sm text-white px-2">
                              {prod.stock}
                            </span>
                            <button
                              onClick={() => handleUpdateStockInline(prod._id, prod.stock, 5)}
                              className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 font-bold flex items-center justify-center cursor-pointer"
                              title="Increase stock by 5"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {prod.stock <= 0 ? (
                            <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              Out of Stock
                            </span>
                          ) : prod.stock <= 10 ? (
                            <span className="bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                              Low Stock ({prod.stock})
                            </span>
                          ) : (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              In Stock ({prod.stock})
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenProductModal(prod)}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="p-1.5 bg-slate-700 hover:bg-rose-600 text-slate-200 rounded-lg cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MACHINERY FLEET MANAGER */}
        {activeTab === 'tractors' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Tractor className="w-5 h-5 text-amber-400" />
                <span>Machinery Fleet & Owner Listings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Approve, verify, and monitor tractors registered by rural farmers
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tractors.map((tr) => (
                <div key={tr._id} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={tr.imageUrl}
                      alt={tr.tractorName}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{tr.tractorName}</h4>
                      <p className="text-xs text-amber-300 font-mono font-bold">{tr.registrationNumber}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Owner: {tr.ownerName} ({tr.ownerPhone})</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-700/60">
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <strong className="text-white">₹{tr.ratePerHour}/hr • ₹{tr.ratePerAcre}/acre</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span>{tr.village}, {tr.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{tr.category}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleTractorApproval(tr)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        tr.isApproved
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-amber-500 text-slate-950 font-black'
                      }`}
                    >
                      {tr.isApproved ? '✓ Verified Partner' : 'Click to Approve'}
                    </button>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {tr.isAvailable ? '🟢 Online' : '⚪ Offline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MARKETPLACE ORDERS */}
        {activeTab === 'orders' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <span>Agricultural Marketplace Orders & Deliveries</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage order fulfillment, delivery statuses, and payment receipts
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Farmer Details</th>
                      <th className="py-3 px-4">Delivery Village</th>
                      <th className="py-3 px-4">Items & Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-750 transition-colors">
                        <td className="py-3.5 px-4">
                          <strong className="font-mono text-amber-400 block">#{ord._id.slice(-8).toUpperCase()}</strong>
                          <span className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <strong className="text-white block font-bold">{ord.customerName}</strong>
                          <span className="text-slate-400 font-mono text-[11px]">{ord.customerPhone}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="text-slate-300 font-semibold">{ord.shippingAddress.villageFarmAddress}</p>
                          <span className="text-[11px] text-slate-400">{ord.shippingAddress.district} - {ord.shippingAddress.pincode}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-black text-white text-sm block">₹{ord.totalPrice}</span>
                          <span className="text-[11px] text-slate-400">{ord.orderItems?.length || 0} items purchased</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-slate-200 font-bold block">{ord.paymentMethod}</span>
                          <span className="text-[10px] text-emerald-400 font-mono">{ord.paymentResult?.transactionId}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : ord.orderStatus === 'Cancelled'
                              ? 'bg-rose-950 text-rose-300 border-rose-700'
                              : 'bg-blue-950 text-blue-300 border-blue-700'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 py-1 px-2 font-semibold"
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ASSIGN TRACTOR & OPERATOR TO BOOKED FARM LOCATION */}
      {assignModalBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 text-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Tractor className="w-5 h-5" />
                <span>Assign Tractor to Farm Location</span>
              </div>
              <button
                onClick={() => setAssignModalBooking(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booked Location Summary */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-amber-400 font-bold block uppercase tracking-wider text-[10px]">
                Requested Farm Location
              </span>
              <p className="text-white font-semibold">{assignModalBooking.farmLocation.village}</p>
              <p className="text-slate-400">Landmark: {assignModalBooking.farmLocation.landmark || 'Direct Farm Gate'}</p>
              <p className="text-slate-400">Farmer: {assignModalBooking.userName} ({assignModalBooking.userPhone})</p>
              <p className="text-emerald-400 font-bold pt-1">Operation: {assignModalBooking.serviceType}</p>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Verified Tractor from Fleet</label>
                <select
                  value={assignForm.tractorId}
                  onChange={(e) => {
                    const selected = tractors.find((t) => t._id === e.target.value);
                    if (selected) {
                      setAssignForm({
                        ...assignForm,
                        tractorId: selected._id,
                        driverName: selected.ownerName,
                        driverPhone: selected.ownerPhone,
                        vehicleDetails: `${selected.brand} ${selected.tractorName} (${selected.registrationNumber})`,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="">-- Choose Machine --</option>
                  {tractors.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.brand} {t.tractorName} ({t.registrationNumber}) - {t.village}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Operator / Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={assignForm.driverName}
                    onChange={(e) => setAssignForm({ ...assignForm, driverName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Operator Phone *</label>
                  <input
                    type="tel"
                    required
                    value={assignForm.driverPhone}
                    onChange={(e) => setAssignForm({ ...assignForm, driverPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Vehicle Details & Implements</label>
                <input
                  type="text"
                  value={assignForm.vehicleDetails}
                  onChange={(e) => setAssignForm({ ...assignForm, vehicleDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Dispatch Status</label>
                <select
                  value={assignForm.status}
                  onChange={(e) => setAssignForm({ ...assignForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Assigned">Assigned (Operator Notified)</option>
                  <option value="On The Way">On The Way (Tractor Dispatched to Field)</option>
                  <option value="In Progress">In Progress (Work Ongoing on Farm)</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Admin Dispatch Notes for Farmer</label>
                <input
                  type="text"
                  value={assignForm.adminNotes}
                  onChange={(e) => setAssignForm({ ...assignForm, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl cursor-pointer"
                >
                  Confirm & Dispatch Tractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? 'Edit Product & Stock' : 'Add New Agricultural Product'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Tools & Machinery">Tools & Machinery</option>
                    <option value="Bio-Nutrients">Bio-Nutrients</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-bold text-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Unit Size (e.g. 25kg Bag, 1L)</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl cursor-pointer"
                >
                  Save to MongoDB Dataset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
