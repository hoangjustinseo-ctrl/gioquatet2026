
import React from 'react';
import { HOTLINE } from '../constants';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">T</div>
          <span className="text-2xl font-bold text-orange-600 tracking-tight hidden md:block uppercase">GIỎ QUÀ TẾT 2026</span>
        </div>
        
        <div className="hidden lg:flex space-x-8 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="text-gray-900 hover:text-orange-600 transition-colors">Trang chủ</a>
          <a href="#" className="text-gray-900 hover:text-orange-600 transition-colors">Quà tết doanh nghiệp</a>
          <a href="#" className="text-gray-900 hover:text-orange-600 transition-colors">Sản phẩm sức khỏe</a>
          <a href="#" className="text-gray-900 hover:text-orange-600 transition-colors">Về chúng tôi</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden sm:block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-bold hover:bg-orange-200 transition-all text-sm">
            Tư vấn: {HOTLINE}
          </button>
          <button className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-all shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
