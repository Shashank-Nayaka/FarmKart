import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    itemsCount,
    itemsPrice,
    deliveryPrice,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Your Krishi Cart</h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {itemsCount} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <Truck className="w-4 h-4 text-emerald-600" />
            {itemsPrice >= 500 ? (
              <span className="font-bold text-emerald-700">Eligible for FREE Village Delivery! 🎉</span>
            ) : (
              <span>Add ₹{500 - itemsPrice} more for <strong>FREE Village Delivery</strong></span>
            )}
          </div>
          <span className="text-[11px] font-bold">Orders &gt; ₹500</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Your agricultural cart is empty</p>
              <p className="text-xs text-slate-400">Add certified seeds, fertilizers or farming tools to order</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/');
                }}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
              >
                Browse Krishi Bazaar
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl relative group"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-white border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {item.unit} • ₹{item.price} each
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => updateQuantity(item._id, item.qty - 1, item.stock)}
                        className="px-2 py-0.5 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-bold text-slate-800">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.qty + 1, item.stock)}
                        disabled={item.qty >= item.stock}
                        className="px-2 py-0.5 hover:bg-slate-100 font-bold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        ₹{item.price * item.qty}
                      </span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white space-y-3 shadow-lg">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Village Delivery Charge</span>
                <span className={`font-semibold ${deliveryPrice === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {deliveryPrice === 0 ? 'FREE' : `₹${deliveryPrice}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-base text-emerald-700 font-black">₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure UPI / Cash on Delivery payment</span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
