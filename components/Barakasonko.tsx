import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '../types';

// Define props interface
interface BarakasonkoProps {
  onProductClick: (product: Product) => void;
  WatermarkedImage: React.FC<any>;
}

// Simple WatermarkedImage wrapper in case it's not passed correctly
const DefaultWatermarkedImage: React.FC<any> = ({ src, alt, containerClass, onClick, productId }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${containerClass || ''}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt || 'Product'}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
        }}
      />
    </div>
  );
};

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  if (!products || products.length === 0) {
    return (
      <div className="py-8 px-4 text-center">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div className="relative py-8 overflow-hidden">
      {/* Alibaba-style background sheds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-yellow-200/20 rounded-full blur-3xl" />
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
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-orange-100/50 flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl"
              aria-label="Scroll right"
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
          {products.slice(0, 15).map((product, index) => {
            // Safely get image URL
            const imageUrl = product.image || 
                           (product.images && product.images.length > 0 ? product.images[0] : '') || 
                           'https://via.placeholder.com/300?text=Product';
            
            // Safely get price
            const price = product.price || product.sellingPrice || 0;
            const originalPrice = product.original_price || (product.discount ? price * (100/(100-product.discount)) : null);
            
            return (
              <div
                key={product.id || index}
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
                      src={imageUrl}
                      alt={product.title || product.name || 'Product'}
                      containerClass="w-full h-full"
                      productId={product.id}
                    />
                    
                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 relative z-10">
                    <h3 className="text-xs font-bold text-gray-800 line-clamp-2 mb-2 min-h-[32px] group-hover:text-orange-600 transition-colors">
                      {product.title || product.name || 'Product Name'}
                    </h3>
                    
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-sm font-black text-orange-600">
                          TSh {price.toLocaleString()}
                        </span>
                        {originalPrice && (
                          <span className="text-[9px] text-gray-400 line-through ml-1">
                            TSh {originalPrice.toLocaleString()}
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
            );
          })}
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
 * ✅ Product Grid Component (Simplified)
 * ==========================================================
 */
const SimpleProductGrid: React.FC<{
  products: Product[];
  onProductClick: (product: Product) => void;
  WatermarkedImage: React.FC<any>;
}> = ({ products, onProductClick, WatermarkedImage }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => {
        const imageUrl = product.image || 
                        (product.images && product.images.length > 0 ? product.images[0] : '') || 
                        'https://via.placeholder.com/300?text=Product';
        const price = product.price || product.sellingPrice || 0;
        
        return (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="relative aspect-square bg-gray-100">
              <WatermarkedImage
                src={imageUrl}
                alt={product.title || product.name || 'Product'}
                containerClass="w-full h-full"
                productId={product.id}
              />
              {product.discount && product.discount > 0 && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 rounded-full">
                  <span className="text-[10px] text-white font-bold">-{product.discount}%</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-xs font-bold text-gray-800 line-clamp-2 mb-2">
                {product.title || product.name || 'Product Name'}
              </h3>
              <p className="text-sm font-black text-orange-600">
                TSh {price.toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * ==========================================================
 * ✅ Main Barakasonko Component - NOW FETCHES ITS OWN PRODUCTS
 * ==========================================================
 */
const Barakasonko: React.FC<BarakasonkoProps> = ({
  onProductClick,
  WatermarkedImage = DefaultWatermarkedImage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Barakasonko: Fetching products from /api/products');
        const response = await fetch('/api/products', {
          headers: { Accept: 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          console.log(`Barakasonko: Loaded ${data.data.length} products`);
          setProducts(data.data);
        } else {
          throw new Error(data?.error || 'Invalid response format');
        }
      } catch (error: any) {
        console.error('Barakasonko: Failed to fetch products', error);
        setError(error.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Ensure products is an array
  const safeProducts = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set<string>();
    safeProducts.forEach(p => {
      if (p.category_name) cats.add(p.category_name);
      else if (p.category) cats.add(p.category);
    });
    return Array.from(cats).slice(0, 8);
  }, [safeProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...safeProducts];

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
        // Sort by ID (assuming newer products have higher IDs)
        filtered.sort((a, b) => String(b.id || '').localeCompare(String(a.id || '')));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        // Randomize for demo
        filtered.sort(() => Math.random() - 0.5);
        break;
    }

    return filtered;
  }, [safeProducts, selectedCategory, sortBy, searchTerm]);

  // Get products for horizontal scroll section
  const scrollProducts = useMemo(() => {
    return filteredProducts.slice(0, 15);
  }, [filteredProducts]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/10 to-amber-50/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Baraka Sonko products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/10 to-amber-50/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Failed to load products</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No products state
  if (!safeProducts.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/10 to-amber-50/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No products available</h3>
          <p className="text-sm text-gray-500">Check back later for new arrivals</p>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-black text-white">{safeProducts.length}</p>
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
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Scroll Section - 5+ products grid */}
        {scrollProducts.length > 0 && (
          <HorizontalScrollSection
            title="Featured Products"
            products={scrollProducts}
            onProductClick={onProductClick}
            WatermarkedImage={WatermarkedImage}
          />
        )}

        {/* Filters and Sort */}
        <div className="px-4 py-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100/50 shadow-lg">
            {/* Category Filter */}
            {categories.length > 0 && (
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
            )}

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
          <SimpleProductGrid
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
