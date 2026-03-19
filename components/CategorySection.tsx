import React, { useState, useEffect } from 'react';
import { Category } from '../types';

interface CategorySectionProps {
  onCategorySelect: (category: Category) => void;
  onMore: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ onCategorySelect, onMore }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories?app=sound', {
          headers: { Accept: 'application/json' }
        });
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          // Transform API data to match Category type
          const fetchedCategories = data.data.map((cat: any) => ({
            id: String(cat.id || cat._id),
            name: String(cat.name || cat.category_name || cat.title || ''),
            icon: cat.icon || cat.icon_name || cat.icon_emoji || getDefaultIcon(cat.name || ''),
          }));
          
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Default icon helper (fallback if API doesn't provide icons)
  const getDefaultIcon = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('elect')) return '⚡';
    if (n.includes('phone')) return '📱';
    if (n.includes('tv')) return '📺';
    if (n.includes('sound') || n.includes('audio')) return '🔊';
    if (n.includes('access')) return '🎧';
    if (n.includes('home')) return '🏠';
    return '📦';
  };

  // Show first 10 categories for home section (Alibaba typically shows 10-12)
  const displayCategories = categories.slice(0, 10);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50/50 py-6">
        <div className="px-4 mb-3">
          <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-5 px-4 pb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-shrink-0 w-[76px]">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse shadow-sm" />
              <div className="mt-2 w-12 h-3 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no categories
  if (categories.length === 0) return null;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50/50 py-6 border-b border-gray-100/80">
      {/* Section Header - Alibaba style */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full" />
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Shop by Category
          </h2>
          <span className="text-[10px] font-medium text-gray-400 bg-gray-100/80 px-2 py-0.5 rounded-full">
            {categories.length}
          </span>
        </div>
        <button
          onClick={onMore}
          className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
        >
          View All
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Categories Grid - Horizontal Scroll (Alibaba style) */}
      <div className="relative">
        {/* Gradient fade edges for scroll indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex overflow-x-auto no-scrollbar space-x-5 px-4 pb-2">
          {displayCategories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category)}
              className="flex flex-col items-center flex-shrink-0 w-[76px] group cursor-pointer"
            >
              {/* Icon Container - Modern card style */}
              <div className="relative w-[72px] h-[72px] bg-gradient-to-br from-gray-50 to-white rounded-2xl flex items-center justify-center mb-2 border border-gray-100/80 shadow-sm group-hover:shadow-md group-hover:border-orange-100 transition-all duration-200 group-active:scale-95">
                {/* Icon */}
                <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">
                  {category.icon || '📦'}
                </span>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 rounded-2xl transition-colors" />
                
                {/* Top brands indicator (Alibaba style) */}
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[8px] text-white font-black">TOP</span>
                  </div>
                )}
              </div>

              {/* Category Name */}
              <span className="text-[11px] font-medium text-gray-700 text-center line-clamp-2 leading-tight px-1 group-hover:text-orange-500 transition-colors">
                {category.name}
              </span>
            </div>
          ))}

          {/* More Button - Alibaba style */}
          <button
            onClick={onMore}
            className="flex flex-col items-center flex-shrink-0 w-[76px] group"
          >
            <div className="w-[72px] h-[72px] bg-gradient-to-br from-orange-50 to-orange-100/80 rounded-2xl flex items-center justify-center mb-2 border border-orange-100/80 shadow-sm group-hover:shadow-md group-hover:border-orange-200 transition-all group-active:scale-95">
              <div className="relative">
                <span className="text-2xl font-black text-orange-400 group-hover:text-orange-500 transition-colors">
                  +
                </span>
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-black">{categories.length - 10}</span>
                </span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-500 group-hover:text-orange-500 transition-colors">
              More
            </span>
          </button>
        </div>
      </div>

      {/* Quick Stats Row - Alibaba style */}
      <div className="px-4 mt-4 flex items-center gap-3 text-[10px] text-gray-400">
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 bg-green-500 rounded-full" />
          <span>Fast Shipping</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 bg-orange-500 rounded-full" />
          <span>Official Store</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 bg-blue-500 rounded-full" />
          <span>Best Prices</span>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
