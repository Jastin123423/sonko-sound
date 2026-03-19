import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProductGrid from './ProductGrid';
import { Product } from '../types';
import { COLORS } from '../constants';

interface AllProductsViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onLoadMore: () => void;
  isLoading: boolean;
}

/**
 * ==========================================================
 * ✅ Helpers
 * ==========================================================
 */
const productImage = (p: any) =>
  String(
    p?.image_url ??
      p?.imageUrl ??
      p?.image ??
      p?.cover_url ??
      p?.coverUrl ??
      p?.thumbnail ??
      p?.thumbnail_url ??
      ''
  ).trim();

const productTitle = (p: any) => String(p?.title ?? p?.name ?? 'Bidhaa').trim();

const productPrice = (p: any) => {
  const v = p?.price ?? p?.amount ?? p?.sale_price ?? p?.salePrice ?? p?.cost ?? 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * ==========================================================
 * ✅ FeaturedSlider - Beautiful classic slider with navigation
 * ==========================================================
 */
const FeaturedSlider: React.FC<{
  items: Product[];
  onClick: (p: Product) => void;
}> = ({ items, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const featured = useMemo(() => items.slice(0, 8), [items]);
  
  useEffect(() => {
    if (featured.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [featured.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  if (featured.length === 0) return null;

  const currentProduct = featured[currentIndex];

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
      </div>

      <div className="relative max-w-[600px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-orange-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">
              Featured Collection
            </p>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Bidhaa Zote
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 font-medium">
              {currentIndex + 1} / {featured.length}
            </span>
          </div>
        </div>

        {/* Main Slider */}
        <div 
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-800 shadow-2xl">
            {/* Product Image */}
            {productImage(currentProduct) ? (
              <img
                src={productImage(currentProduct)}
                alt={productTitle(currentProduct)}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <span className="text-gray-400 text-sm font-bold">No image available</span>
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Product Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-black text-white mb-2 line-clamp-2">
                {productTitle(currentProduct)}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-300 font-medium mb-1">Starting from</p>
                  <p className="text-2xl font-black text-orange-400">
                    TSh {productPrice(currentProduct).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => onClick(currentProduct)}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-colors shadow-lg"
                >
                  View Deal
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows (Desktop) */}
          {featured.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots Navigation */}
        {featured.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all ${
                  idx === currentIndex
                    ? 'w-8 h-2 bg-orange-500 rounded-full'
                    : 'w-2 h-2 bg-gray-600 hover:bg-gray-500 rounded-full'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ==========================================================
 * ✅ CategoryStrip - Beautiful category pills
 * ==========================================================
 */
const CategoryStrip: React.FC<{
  products: Product[];
  onSelect: (category: string) => void;
}> = ({ products, onSelect }) => {
  const categories = useMemo(() => {
    const catSet = new Set<string>();
    products.forEach(p => {
      if ((p as any).category_name) catSet.add((p as any).category_name);
      else if (p.category) catSet.add(p.category);
    });
    return Array.from(catSet).slice(0, 12);
  }, [products]);

  if (categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[600px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-gray-900">Browse by Category</h3>
          <span className="text-xs text-orange-500 font-bold">{categories.length} categories</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(cat)}
              className="px-4 py-2 bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-bold text-xs rounded-full whitespace-nowrap transition-colors border border-gray-200 hover:border-orange-200"
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => onSelect('all')}
            className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-full whitespace-nowrap hover:bg-orange-600 transition-colors"
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ==========================================================
 * ✅ StatsBar - Beautiful stats display
 * ==========================================================
 */
const StatsBar: React.FC<{
  totalProducts: number;
}> = ({ totalProducts }) => {
  const stats = [
    { label: 'Total Products', value: totalProducts.toLocaleString(), icon: '📦' },
    { label: 'Flash Deals', value: Math.min(24, totalProducts).toLocaleString(), icon: '⚡' },
    { label: 'New Arrivals', value: Math.min(12, totalProducts).toLocaleString(), icon: '🆕' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[600px] mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-sm font-black text-gray-900">{stat.value}</div>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ==========================================================
 * ✅ HeroBanner - Beautiful top banner
 * ==========================================================
 */
const HeroBanner: React.FC<{
  onExploreClick: () => void;
}> = ({ onExploreClick }) => {
  return (
    <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-24 translate-y-24" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />

      <div className="relative max-w-[600px] mx-auto px-4 py-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black rounded-full">
                SONKO SOUND
              </span>
              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black rounded-full">
                OFFICIAL
              </span>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 leading-tight">
              Baraka Sonko<br />Electronics
            </h1>
            <p className="text-orange-100 text-sm mb-4 max-w-xs">
              Premium audio gear, electronics, and accessories at the best prices in town.
            </p>
            <button
              onClick={onExploreClick}
              className="px-6 py-3 bg-white text-orange-600 font-black rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
            >
              Explore Collection
            </button>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-white/40 text-7xl font-black">SONKO</div>
            <div className="text-white/20 text-4xl font-black -mt-4">SOUND</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ==========================================================
 * ✅ Main Component
 * ==========================================================
 */
const AllProductsView: React.FC<AllProductsViewProps> = ({
  products,
  onProductClick,
  onLoadMore,
  isLoading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const safeProducts = useMemo(() => (products || []).filter(Boolean), [products]);

  // Filter products by category if selected
  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return safeProducts;
    return safeProducts.filter(p => 
      (p as any).category_name?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      p.category?.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [safeProducts, selectedCategory]);

  // Featured products (first 8)
  const featuredProducts = useMemo(() => safeProducts.slice(0, 8), [safeProducts]);

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Scroll to products section
    setTimeout(() => {
      document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Clear category filter
  const handleClearFilter = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <HeroBanner onExploreClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* Stats Bar */}
      <StatsBar totalProducts={safeProducts.length} />

      {/* Category Strip */}
      <CategoryStrip products={safeProducts} onSelect={handleCategorySelect} />

      {/* Featured Slider */}
      {!selectedCategory && <FeaturedSlider items={featuredProducts} onClick={onProductClick} />}

      {/* Active Filter Indicator */}
      {selectedCategory && selectedCategory !== 'all' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[600px] mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 font-bold text-xs rounded-full">
                  {selectedCategory}
                </span>
              </div>
              <button
                onClick={handleClearFilter}
                className="text-xs text-gray-500 hover:text-orange-600 font-medium transition-colors"
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="max-w-[600px] mx-auto px-4 pt-6 pb-3" id="products-grid">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              {selectedCategory && selectedCategory !== 'all' ? selectedCategory : 'All Products'}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {filteredProducts.length} products available
            </p>
          </div>
          {!selectedCategory && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500 font-medium">In Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        onProductClick={onProductClick}
        onLoadMore={onLoadMore}
        hasMore={true}
        isLoading={isLoading}
      />

      {/* Loading More Indicator */}
      {isLoading && (
        <div className="py-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProductsView;
