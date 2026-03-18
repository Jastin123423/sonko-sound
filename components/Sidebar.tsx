import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { Category } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: Category) => void;
}

type SidebarPage = 'menu' | 'about' | 'privacy' | 'terms';

// Default icons fallback
const getDefaultIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();

  if (name.includes('phone') || name.includes('simu')) return '◉';
  if (name.includes('tv') || name.includes('television')) return '▣';
  if (name.includes('sound') || name.includes('sauti')) return '◌';
  if (name.includes('camera') || name.includes('kamera')) return '◍';
  if (name.includes('laptop') || name.includes('kompyuta')) return '▤';
  if (name.includes('game') || name.includes('mchezo')) return '✦';
  if (name.includes('watch') || name.includes('saa')) return '◐';
  if (name.includes('home') || name.includes('nyumba')) return '⌂';
  if (name.includes('kitchen') || name.includes('jikoni')) return '◈';
  if (name.includes('car') || name.includes('gari')) return '▭';
  if (name.includes('health') || name.includes('afya')) return '✚';
  if (name.includes('book') || name.includes('kitabu')) return '▥';
  if (name.includes('fashion') || name.includes('mitindo')) return '◇';
  if (name.includes('all') || name.includes('zote')) return '◎';
  if (name.includes('electronics') || name.includes('umeme')) return '⎓';
  if (name.includes('accessories') || name.includes('vifaa')) return '◔';

  return '◎';
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onCategorySelect
}) => {
  const [currentPage, setCurrentPage] = useState<SidebarPage>('menu');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen || categories.length > 0) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/categories');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data?.success) {
          const fetchedCategories = data.data || [];

          const transformedCategories = fetchedCategories.map((cat: any) => {
            const backendIcon = cat.icon || cat.icon_name || cat.icon_emoji;

            return {
              id: String(cat.id || cat._id || ''),
              name: String(cat.name || cat.category_name || 'Unnamed'),
              icon: backendIcon || getDefaultIcon(cat.name || ''),
              ...cat
            } as Category;
          });

          setCategories(transformedCategories);
        } else {
          throw new Error(data?.error || 'Invalid response format from backend');
        }
      } catch (error: any) {
        console.error('Sidebar error:', error);
        setError(error.message || 'Failed to load categories from server');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isOpen, categories.length]);

  const handlePageChange = (page: SidebarPage) => {
    setCurrentPage(page);
  };

  const closeSidebar = () => {
    setCurrentPage('menu');
    onClose();
  };

  const renderMenu = () => (
    <div className="animate-fadeIn">
      {/* Category section */}
      <div className="px-5 pt-5 pb-3">
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-orange-100">
            Sonko Sound Menu
          </p>
          <h3 className="text-lg font-extrabold mt-1">Browse Categories</h3>
          <p className="text-xs text-orange-100 mt-1">
            Audio, electronics and featured collections
          </p>
        </div>
      </div>

      <div className="px-5 py-3 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
        Shop Categories
      </div>

      {isLoading ? (
        <div className="px-4 py-12 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-semibold text-gray-500">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="px-4 py-8 text-center">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
            !
          </div>
          <p className="text-xs font-bold text-gray-700 mb-2">Failed to load categories</p>
          <p className="text-xs text-gray-400">{error}</p>
          <button
            onClick={() => {
              setCategories([]);
              setError(null);
            }}
            className="mt-4 px-4 py-2 text-xs font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
            ○
          </div>
          <p className="text-xs font-bold text-gray-700">No categories available</p>
          <p className="text-xs text-gray-400 mt-1">Please check backend connection</p>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-3 gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-gray-100 shadow-sm active:scale-95 transition-all hover:border-orange-200 hover:bg-orange-50"
            >
              <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-lg font-bold mb-2">
                {cat.icon || getDefaultIcon(cat.name)}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight line-clamp-2">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Info section */}
      <div className="px-5 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] border-t border-gray-100">
        Information
      </div>

      <ul className="px-4 space-y-3 pb-6">
        <li
          onClick={() => handlePageChange('about')}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-orange-200 hover:bg-orange-50/40 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">About Sonko Sound</p>
            <p className="text-xs text-gray-400">Store profile and brand details</p>
          </div>
        </li>

        <li
          onClick={() => handlePageChange('privacy')}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-orange-200 hover:bg-orange-50/40 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Privacy Policy</p>
            <p className="text-xs text-gray-400">How customer information is handled</p>
          </div>
        </li>

        <li
          onClick={() => handlePageChange('terms')}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-orange-200 hover:bg-orange-50/40 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Terms of Service</p>
            <p className="text-xs text-gray-400">Rules for orders, payments and returns</p>
          </div>
        </li>
      </ul>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-fadeIn p-6">
      <h3 className="text-xl font-black text-gray-900 mb-4">About Sonko Sound</h3>
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p className="font-medium">
          Welcome to <span className="text-orange-600 font-bold">Sonko Sound</span>. We focus on audio equipment,
          electronics, and reliable products for customers in Tanzania and beyond.
        </p>
        <p>
          Our goal is to provide quality devices with a modern shopping experience, professional presentation,
          and trusted service.
        </p>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-orange-500 mb-1">
            Brand Focus
          </p>
          <p className="text-sm font-semibold text-gray-800">
            Sound systems, electronics, accessories and featured collections
          </p>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="animate-fadeIn p-6">
      <h3 className="text-xl font-black text-gray-900 mb-4">Privacy Policy</h3>
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p>At Sonko Sound, we value your privacy and handle customer information with care.</p>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">1. Data Collection</h4>
          <p>We collect only the information needed for orders, delivery, and communication.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">2. Information Usage</h4>
          <p>Your information is used to process purchases, provide updates, and improve customer experience.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">3. Data Protection</h4>
          <p>We apply reasonable security measures to protect personal and order-related information.</p>
        </div>
        <p className="text-[10px] text-gray-400 italic pt-2">Last updated: May 2025</p>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="animate-fadeIn p-6">
      <h3 className="text-xl font-black text-gray-900 mb-4">Terms of Service</h3>
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p>By using Sonko Sound, you agree to the terms and conditions below.</p>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">1. Ordering</h4>
          <p>All orders are subject to product availability and confirmation.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">2. Payment</h4>
          <p>Orders are processed after payment is confirmed through the available payment methods.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">3. Delivery</h4>
          <p>Delivery timelines are estimates and may vary depending on location and logistics.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">4. Returns</h4>
          <p>Customers should report defective or incorrect items within the allowed return period.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/45 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[310px] bg-[#fffaf5] z-[70] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="relative px-5 pt-5 pb-4 bg-white border-b border-orange-100">
          {currentPage !== 'menu' && (
            <button
              onClick={() => handlePageChange('menu')}
              className="mb-4 w-9 h-9 flex items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-600 active:scale-95 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                    <path d="M5 9v6" />
                    <path d="M9 7v10" />
                    <path d="M13 10v4" />
                    <path d="M17 6v12" />
                  </svg>
                </div>

                <div>
                  <div
                    className="text-xl font-black tracking-tight leading-none"
                    style={{ color: COLORS.primary }}
                  >
                    {currentPage === 'menu' ? 'SONKO SOUND' : 'SONKO INFO'}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 block">
                    {currentPage === 'menu' ? `${categories.length} Categories` : 'Details'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={closeSidebar}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 text-gray-400 text-2xl font-light active:scale-95 transition-transform"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-grow overflow-y-auto no-scrollbar bg-[#fffaf5]">
          {currentPage === 'menu' && renderMenu()}
          {currentPage === 'about' && renderAbout()}
          {currentPage === 'privacy' && renderPrivacy()}
          {currentPage === 'terms' && renderTerms()}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-orange-100 bg-white">
          <div className="text-center">
            <p className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-gray-700">
              Sonko Sound
            </p>
            <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider font-semibold">
              Professional audio and electronics experience
            </p>
            <p className="text-[9px] text-gray-400 mt-4 uppercase font-bold tracking-tight">
              © 2025 Sonko Sound
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
