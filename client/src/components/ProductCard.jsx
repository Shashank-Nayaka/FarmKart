import React from 'react';
import { Star, ShoppingCart, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col group relative">
      {/* Discount Pill */}
      {discountPercent > 0 && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-emerald-600 text-white font-black text-[11px] px-2 py-0.5 rounded shadow-sm">
          {discountPercent}% OFF
        </div>
      )}

      {/* Stock status badge */}
      <div className="absolute top-2.5 right-2.5 z-10">
        {isOutOfStock ? (
          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
            🔥 Only {product.stock} left!
          </span>
        ) : (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock ({product.stock})
          </span>
        )}
      </div>

      {/* Image container */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="w-full h-48 bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center p-3 relative"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Assured badge Flipkart style */}
        <div className="absolute bottom-2 left-2 bg-blue-600/90 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded italic">
          Krishi Assured ✓
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-emerald-700">{product.brand}</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView && onQuickView(product)}
            className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span>{product.rating || 4.5}</span>
              <Star className="w-2.5 h-2.5 fill-white text-white" />
            </div>
            <span className="text-xs text-slate-500">({product.numReviews || 24} reviews)</span>
          </div>

          {/* Price Strip */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-[11px] text-slate-500 font-medium">/ {product.unit}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={() => {
              const added = addToCart(product, 1);
              if (added) {
                // Cart drawer opens automatically
              }
            }}
            disabled={isOutOfStock}
            className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
