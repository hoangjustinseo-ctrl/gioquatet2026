
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">T</div>
          <span className="text-2xl font-bold text-orange-600 tracking-tight hidden md:block">GIỎ QUÀ TẾT 2026</span>
        </div>
        
        <div className="hidden lg:flex space-x-6 text-sm font-semibold uppercase">
          <a href="#" className="hover:text-orange-600 transition-colors">Trang chủ</a>
          <a href="#" className="hover:text-orange-600 transition-colors">Quà tết doanh nghiệp</a>
          <a href="#" className="hover:text-orange-600 transition-colors">Sức khỏe</a>
          <a href="#/admin" className="text-gray-300 hover:text-gray-400">Admin</a>
        </div>

        <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-700 transition-all shadow-md">
          Hotline: 0985 023 463
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
