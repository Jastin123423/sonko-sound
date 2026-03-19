import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import ProductGrid from './ProductGrid';
import WatermarkedImage from './WatermarkedImage';

interface BarakasonkoProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  WatermarkedImage: React.FC<any>;
}

/**
 * ==========================================================
 * ✅ Horizontal Scrollable Section with Alibaba Background Sheds
 * ==========================================================
 */
const HorizontalScrollSection: React.FC<{
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  WatermarkedImage: React.FC<any>;
}> = ({ title, products, onProductClick, WatermarkedImage }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="relative py-8 overflow-hidden">
      {/* Alibaba-style background sheds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-amber-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-yellow-200/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-100/20 via-amber-100/20 to-orange-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[600px] mx-auto px-4">
        {/* Header with Alibaba style */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-7 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full" />
              <div className="w-1.5 h-5 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full ml-0.5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">{title}</h2>
              <p className="text-[10px] text-gray-500 mt-0.5">Premium selection for you</p>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-orange-100/50 flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-orange-100/50 flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Grid */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar gap-4 pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="flex-shrink-0 w-[140px] group cursor-pointer"
            >
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-orange-100/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-active:scale-[0.98]">
                {/* Background shed for each card */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-amber-50/0 group-hover:from-orange-50/60 group-hover:to-amber-50/60 transition-all duration-500" />
                
                {/* Top rank indicator */}
                {index < 3 && (
                  <div className="absolute top-2 left-2 z-20">
                    <div className="relative">
                      <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-[9px] text-white font-black">#{index + 1}</span>
                      </div>
                      <div className="absolute inset-0 bg-orange-400 rounded-full blur-sm animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Discount badge */}
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg">
                      <span className="text-[8px] text-white font-black">-{product.discount}%</span>
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative w-full h-[140px] bg-gradient-to-br from-gray-50 to-gray-100">
                  <WatermarkedImage
                    src={product.image || product.images?.[0] || ''}
                    alt={product.title || product.name}
                    containerClass="w-full h-full"
                    productId={product.id}
                  />
                  
                  {/* Quick view overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-3 relative z-10">
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-2 mb-2 min-h-[32px] group-hover:text-orange-600 transition-colors">
                    {product.title || product.name}
                  </h3>
                  
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-black text-orange-600">
                        TSh {product.price?.toLocaleString()}
                      </span>
                      {product.original_price && (
                        <span className="text-[9px] text-gray-400 line-through ml-1">
                          TSh {product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Add to cart icon */}
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="flex items-center justify-center gap-1 mt-2">
          <div className="w-12 h-1 bg-orange-200 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-pulse" />
          </div>
          <div className="w-1 h-1 bg-orange-200 rounded-full" />
          <div className="w-1 h-1 bg-orange-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

/**
 * ==========================================================
 * ✅ Main Barakasonko Component
 * ==========================================================
 */
const Barakasonko: React.FC<BarakasonkoProps> = ({
  products,
  onProductClick,
  WatermarkedImage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category_name) cats.add(p.category_name);
      else if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category_name === selectedCategory || p.category === selectedCategory
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        (p.title || p.name || '').toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        // Assume newer products have higher IDs or add a date field
        filtered.sort((a, b) => String(b.id).localeCompare(String(a.id)));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        // Randomize for demo - in real app would use views/popularity
        filtered.sort(() => Math.random() - 0.5);
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy, searchTerm]);

  // Get products for horizontal scroll section (first 15)
  const scrollProducts = useMemo(() => {
    return filteredProducts.slice(0, 15);
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/10 to-amber-50/10">
      {/* Background sheds for entire page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-100/10 via-amber-100/10 to-orange-100/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[600px] mx-auto">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 px-6 py-8 overflow-hidden">
          {/* Background sheds for header */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Baraka Sonko</h1>
                <p className="text-sm text-orange-100">Your Trusted Electronics Store</p>
              </div>
            </div>

            <p className="text-white/90 text-sm max-w-md leading-relaxed">
              Discover amazing deals on electronics, audio equipment, and accessories. 
              Quality products at the best prices in town.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-5">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                <p className="text-2xl font-black text-white">{products.length}</p>
                <p className="text-[10px] text-orange-100">Products</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                <p className="text-2xl font-black text-white">{categories.length}</p>
                <p className="text-[10px] text-orange-100">Categories</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-[10px] text-orange-100">Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 -mt-5 mb-5">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in Baraka Sonko..."
              className="w-full px-5 py-4 pr-12 bg-white/90 backdrop-blur-sm border border-orange-100/50 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Horizontal Scroll Section - 5 products grid */}
        <HorizontalScrollSection
          title="Featured Products"
          products={scrollProducts}
          onProductClick={onProductClick}
          WatermarkedImage={WatermarkedImage}
        />

        {/* Filters and Sort */}
        <div className="px-4 py-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100/50 shadow-lg">
            {/* Category Filter */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  All Products
                </button>
                {categories.slice(0, 5).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort By</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    sortBy === 'newest'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('price-low')}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    sortBy === 'price-low'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  Price: Low
                </button>
                <button
                  onClick={() => setSortBy('price-high')}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    sortBy === 'price-high'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  Price: High
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-4 pb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-gray-900">All Products</h3>
            <p className="text-xs text-gray-500">{filteredProducts.length} items</p>
          </div>
          <ProductGrid
            products={filteredProducts}
            onProductClick={onProductClick}
            WatermarkedImage={WatermarkedImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Barakasonko;
