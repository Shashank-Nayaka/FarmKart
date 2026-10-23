import React, { useState } from 'react';
import { X, Star, ShoppingCart, Zap, CheckCircle2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Badges */}
          <div className="bg-slate-50 p-6 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-slate-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-h-72 object-cover rounded-xl shadow-md"
            />
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 100% Certified Input
              </span>
              <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-200">
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> Fast Village Delivery
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                  {product.category}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{product.brand}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white text-white" />
                </div>
                <span className="text-xs text-slate-500">
                  {product.numReviews} Verified Farmer Ratings
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">₹{product.originalPrice}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-emerald-700">
                      {discountPercent}% OFF Special Subsidy
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Unit size: <strong>{product.unit}</strong> (Inclusive of all taxes)</p>

                {/* Stock Indicator */}
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Stock Availability:</span>
                  {isOutOfStock ? (
                    <span className="text-rose-600 font-bold">Out of Stock</span>
                  ) : product.stock <= 10 ? (
                    <span className="text-amber-600 font-extrabold animate-pulse">
                      Only {product.stock} units left in warehouse!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} units ready)
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Product Overview
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Key Agronomic Benefits
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {product.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={isOutOfStock}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold text-slate-800">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    disabled={isOutOfStock || qty >= product.stock}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addToCart(product, qty);
                    onClose();
                  }}
                  disabled={isOutOfStock}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(product, qty);
                    onClose();
                  }}
                  disabled={isOutOfStock}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
