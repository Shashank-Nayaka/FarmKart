import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  QrCode, 
  IndianRupee, 
  ArrowLeft,
  Lock,
  Smartphone
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, itemsPrice, deliveryPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Ramesh Gowda',
    phone: user?.phone || '9845123456',
    villageFarmAddress: user?.village || 'Gowda Farm, Holenarasipura Road',
    landmark: 'Near Canal Bridge',
    district: user?.district || 'Mandya',
    state: user?.state || 'Karnataka',
    pincode: user?.pincode || '571402',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiProvider, setUpiProvider] = useState('PhonePe');
  const [upiId, setUpiId] = useState('rameshgowda@oksbi');
  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  if (cartItems.length === 0 && !orderConfirmed) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Add products from Krishi Bazaar to proceed to checkout</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Krishi Bazaar
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.villageFarmAddress || !shippingAddress.phone) {
      alert('Please fill in complete village delivery address');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          imageUrl: item.imageUrl,
          unit: item.unit,
        })),
        shippingAddress,
        paymentMethod: paymentMethod === 'UPI' ? 'UPI' : (paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Card / NetBanking'),
        paymentResult: {
          transactionId: paymentMethod === 'UPI' ? `UPI-${Date.now().toString().slice(-8)}` : `COD-${Date.now().toString().slice(-6)}`,
          upiId: paymentMethod === 'UPI' ? upiId : '',
        },
      };

      const { data } = await API.post('/orders', orderData);
      setOrderConfirmed(data);
      clearCart();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order. Check stock availability.');
    } finally {
      setLoading(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-200 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              ORDER CONFIRMED #{orderConfirmed._id.slice(-6).toUpperCase()}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Thank You for Your Order!
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Your agricultural supplies are being packed at our Mandya Krishi warehouse for delivery to <strong>{orderConfirmed.shippingAddress.villageFarmAddress}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <strong className="text-slate-800">{orderConfirmed.paymentMethod} ({orderConfirmed.paymentResult?.status})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <strong className="font-mono text-slate-800">{orderConfirmed.paymentResult?.transactionId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Paid:</span>
              <strong className="text-emerald-700 text-sm font-black">₹{orderConfirmed.totalPrice}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Stock Status:</span>
              <span className="text-emerald-700 font-bold">✓ Deducted from MongoDB dataset</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => navigate('/my-orders')}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Track Order Status
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
          Flipkart-Style Krishi Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Village Delivery Address</h3>
                </div>
                <span className="text-xs text-emerald-700 font-bold">Doorstep Village Delivery</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Farmer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Village Name / Farm Address / Road *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.villageFarmAddress}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, villageFarmAddress: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Landmark / Nearest Irrigation Canal
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.landmark}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
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
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options (UPI & COD) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">Payment Method</h3>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <div className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'UPI' ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-200 bg-white'
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-emerald-600" />
                        <div>
                          <strong className="text-xs text-slate-900 block">Instant UPI (PhonePe / Google Pay / Paytm)</strong>
                          <span className="text-[11px] text-slate-500">Zero transaction charges • Instant order confirmation</span>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>
                  </label>

                  {/* Interactive UPI Simulation */}
                  {paymentMethod === 'UPI' && (
                    <div className="mt-4 pt-4 border-t border-slate-200 pl-7 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {['PhonePe', 'Google Pay', 'Paytm', 'BHIM UPI'].map((prov) => (
                          <button
                            type="button"
                            key={prov}
                            onClick={() => setUpiProvider(prov)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                              upiProvider === prov
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {prov}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                          {/* Simulated QR Code SVG */}
                          <div className="w-24 h-24 bg-slate-900 p-1 flex items-center justify-center text-white text-[9px] font-mono text-center rounded">
                            [ SCAN QR ]<br />₹{totalPrice}<br />FarmKart UPI
                          </div>
                        </div>

                        <div className="flex-1 space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Enter your UPI ID / VPA:</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs w-full font-mono"
                              placeholder="e.g. yourname@oksbi"
                            />
                            <button
                              type="button"
                              onClick={() => alert(`UPI ID ${upiId} verified successfully!`)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300"
                            >
                              Verify
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400">Scan QR from any UPI App or click Place Order to complete payment simulation.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery (COD) */}
                <div className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'Cash on Delivery' ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-200 bg-white'
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div>
                      <strong className="text-xs text-slate-900 block">Cash on Delivery (COD)</strong>
                      <span className="text-[11px] text-slate-500">Pay cash directly when items reach your village farm gate</span>
                    </div>
                  </label>
                </div>

                {/* Card / NetBanking */}
                <div className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'Card / NetBanking' ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-200 bg-white'
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="Card / NetBanking"
                      checked={paymentMethod === 'Card / NetBanking'}
                      onChange={() => setPaymentMethod('Card / NetBanking')}
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div>
                      <strong className="text-xs text-slate-900 block">Kisan Credit Card / NetBanking / Debit Card</strong>
                      <span className="text-[11px] text-slate-500">Supports KCC Rupay Cards, SBI, Canara, Karnataka Bank</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24 space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                Order Items ({cartItems.length})
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-2.5 items-center text-xs">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="font-semibold text-slate-900">₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Village Delivery Charge</span>
                  <span className={`font-semibold ${deliveryPrice === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {deliveryPrice === 0 ? 'FREE' : `₹${deliveryPrice}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-xl text-emerald-700 font-black">₹{totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer text-sm"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Processing Order & Updating Stock...' : `Pay & Place Order (₹${totalPrice})`}</span>
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Safe Checkout • Backend Stock Synced</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
