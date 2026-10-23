import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  MapPin, 
  XCircle,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ORDER_STEPS = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders/my-orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Cancel this order? Items will be automatically returned to inventory stock.')) {
      try {
        await API.put(`/orders/${orderId}/cancel`);
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
              <span>Flipkart-Style Krishi Orders</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Orders & Input Delivery Tracking
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track warehouse packing, dispatch and village door delivery for seeds and fertilizers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop More Inputs</span>
            </Link>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <Package className="w-14 h-14 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">No orders placed yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't ordered seeds or fertilizers yet. Explore our Krishi Bazaar with genuine subsidized rates!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Go to Krishi Bazaar</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIdx = ORDER_STEPS.indexOf(order.orderStatus);
              const isCancelled = order.orderStatus === 'Cancelled';

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Top Bar */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Order ID: </span>
                      <strong className="font-mono text-slate-900">#{order._id.slice(-8).toUpperCase()}</strong>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="text-slate-500">Placed on: </span>
                      <strong className="text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">Total: </span>
                      <span className="text-sm font-black text-slate-900">₹{order.totalPrice}</span>
                      <span
                        className={`font-extrabold px-2.5 py-0.5 rounded-full border text-[11px] ${
                          isCancelled
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : order.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6">
                    {/* Flipkart Delivery Stepper */}
                    {!isCancelled && (
                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-2">
                          {ORDER_STEPS.map((step, idx) => (
                            <span
                              key={step}
                              className={idx <= currentStepIdx ? 'text-emerald-700' : 'text-slate-400'}
                            >
                              {step}
                            </span>
                          ))}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                          {ORDER_STEPS.map((step, idx) => (
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

                    {/* Ordered Items List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Purchased Agricultural Supplies
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.orderItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-slate-900 truncate">
                                {item.name}
                              </h5>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Qty: {item.qty} {item.unit} • ₹{item.price} each
                              </p>
                              <p className="text-xs font-extrabold text-slate-800">
                                Total: ₹{item.qty * item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Payment Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Village Delivery Address:
                        </span>
                        <p className="text-slate-800 font-semibold">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
                        <p className="text-slate-600">{order.shippingAddress.villageFarmAddress}</p>
                        <p className="text-slate-500">{order.shippingAddress.district}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Payment & Receipt:
                        </span>
                        <p className="text-slate-800 font-semibold">Method: {order.paymentMethod}</p>
                        <p className="text-slate-600 font-mono">Ref: {order.paymentResult?.transactionId}</p>
                        <p className="text-emerald-700 font-bold mt-1">Status: {order.paymentResult?.status || 'Completed'}</p>
                      </div>
                    </div>

                    {/* Bottom Strip: Cancel option */}
                    {!isCancelled && order.orderStatus === 'Ordered' && (
                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Order & Restock Items
                        </button>
                      </div>
                    )}
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
