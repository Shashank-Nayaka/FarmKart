import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { 
  Search, 
  Filter, 
  Sprout, 
  FlaskConical, 
  ShieldAlert, 
  Wrench, 
  Leaf, 
  Sparkles, 
  Tag, 
  ChevronRight,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'All', icon: Layers },
  { name: 'Seeds', icon: Sprout },
  { name: 'Fertilizers', icon: FlaskConical },
  { name: 'Pesticides', icon: ShieldAlert },
  { name: 'Tools & Machinery', icon: Wrench },
  { name: 'Bio-Nutrients', icon: Leaf },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (keyword.trim()) params.keyword = keyword.trim();
      if (sort) params.sort = sort;

      const { data } = await API.get('/products', { params });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Flipkart-Style Category Navigation Strip */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-emerald-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Promotional Banner (Flipkart / AgriTech Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white p-6 sm:p-10 shadow-lg">
          <div className="max-w-xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-yellow-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kharif & Rabi Season Subsidy Festival</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Certified Seeds, Fertilizers & Spot Tractor Service at Village Doorstep
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Buy 100% genuine agricultural inputs with verified batch certificates. Or book on-spot tractors and farm machinery on hourly/acre basis.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/book-tractor"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🚜 Book Tractor / Spot Service</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setSelectedCategory('Fertilizers')}
                className="bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-500/40 transition-colors"
              >
                Explore Subsidized Fertilizers
              </button>
            </div>
          </div>
          {/* Decorative Pattern */}
          <div className="absolute right-0 bottom-0 top-0 opacity-15 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=700"
              alt="Farm"
              className="h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search, Filter & Sorting Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between mb-6">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search seeds (Paddy, Wheat), Urea, Sprayers..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-emerald-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Sort By Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 py-2 px-3 focus:outline-emerald-500"
            >
              <option value="">Featured / Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Farmer Rating</option>
            </select>
          </div>
        </div>

        {/* Product Count & Category Heading */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{selectedCategory === 'All' ? 'All Agricultural Products' : selectedCategory}</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {products.length} Items Available
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time stock synced directly from Mandya agricultural warehouse
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="h-44 bg-slate-200 rounded-lg"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">No agricultural products found</h3>
            <p className="text-xs text-slate-400">Try clearing your search query or choosing another category</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setKeyword('');
              }}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
