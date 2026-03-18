import React from 'react';
import { COLORS } from '../constants';

const Footer: React.FC = () => {
  const footerLinks = {
    customer: ['Help Center', 'Shipping Info', 'Returns & Refunds', 'Contact Support'],
    company: ['About Sonko Sound', 'Business Partnership', 'Privacy Policy', 'Terms of Use'],
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#fffaf5] to-white border-t border-orange-100 pt-8 pb-24 overflow-hidden">
      {/* soft background accents */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 bg-orange-100/50 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl" />

      <div className="relative px-5">
        {/* brand card */}
        <div className="rounded-3xl bg-white border border-orange-100 shadow-sm p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                <path d="M5 9v6" />
                <path d="M9 7v10" />
                <path d="M13 10v4" />
                <path d="M17 6v12" />
              </svg>
            </div>

            <div className="min-w-0">
              <h2
                className="text-xl font-black tracking-tight leading-none"
                style={{ color: COLORS.primary }}
              >
                SONKO SOUND
              </h2>
              <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500 font-bold mt-1">
                Professional Audio & Smart Shopping
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-3">
                A modern electronics and sound shopping experience with trusted products,
                clean presentation, and customer-first service.
              </p>
            </div>
          </div>
        </div>

        {/* links */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gray-400 mb-3">
              Customer Service
            </h4>
            <div className="space-y-2.5">
              {footerLinks.customer.map((item) => (
                <p
                  key={item}
                  className="text-[13px] font-medium text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gray-400 mb-3">
              Company
            </h4>
            <div className="space-y-2.5">
              {footerLinks.company.map((item) => (
                <p
                  key={item}
                  className="text-[13px] font-medium text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* trust / support strip */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-sm mb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-black leading-none">24/7</p>
              <p className="text-[11px] text-orange-100 mt-1">Support</p>
            </div>
            <div>
              <p className="text-lg font-black leading-none">Fast</p>
              <p className="text-[11px] text-orange-100 mt-1">Response</p>
            </div>
            <div>
              <p className="text-lg font-black leading-none">Secure</p>
              <p className="text-[11px] text-orange-100 mt-1">Shopping</p>
            </div>
          </div>
        </div>

        {/* bottom line */}
        <div className="border-t border-orange-100 pt-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Sonko Sound
            </span>
            <span className="w-2 h-2 rounded-full bg-orange-200" />
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs">
            Electronics, sound systems, accessories and featured collections in one modern store.
          </p>

          <p className="text-[10px] text-gray-400 mt-3 font-semibold tracking-wide">
            © 2025 SONKO SOUND. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
