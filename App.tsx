
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import SidebarFilters from './components/SidebarFilters';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AdminPanel from './components/AdminPanel';
import { Product, PriceRange, FilterCategory } from './types';
import { INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>(PriceRange.ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Load local storage products if any
    const localProds = localStorage.getItem('custom_products');
    const custom = localProds ? JSON.parse(localProds) : [];
    setProducts([...INITIAL_PRODUCTS, ...custom]);

    // Handle hidden admin route via hash
    const handleHash = () => {
      if (window.location.hash === '#/admin') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };
    
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const addProduct = (newProd: Product) => {
    const updated = [...products, newProd];
    setProducts(updated);
    
    // Persist only custom products
    const custom = updated.filter(p => !INITIAL_PRODUCTS.find(i => i.id === p.id));
    localStorage.setItem('custom_products', JSON.stringify(custom));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCat = selectedCategory.length === 0 || selectedCategory.includes(product.category);
      
      let matchPrice = true;
      if (selectedPriceRange !== PriceRange.ALL) {
        const p = product.price;
        switch (selectedPriceRange) {
          case PriceRange.UNDER_500: matchPrice = p < 500000; break;
          case PriceRange.FROM_500_TO_1000: matchPrice = p >= 500000 && p <= 1000000; break;
          case PriceRange.FROM_1000_TO_2000: matchPrice = p >= 1000000 && p <= 2000000; break;
          case PriceRange.OVER_2000: matchPrice = p > 2000000; break;
        }
      }
      
      return matchCat && matchPrice;
    });
  }, [products, selectedCategory, selectedPriceRange]);

  const closeAdmin = () => {
    window.location.hash = '';
    setIsAdminOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Banner Section */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-4 mb-8">
            {Object.values(FilterCategory).map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm
                  ${selectedCategory.includes(cat) || (selectedCategory.length === 0 && cat === FilterCategory.ALL)
                    ? 'bg-orange-600 text-white' 
                    : 'bg-white text-orange-600 border border-orange-100 hover:border-orange-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <SidebarFilters 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
            />
          </aside>

          {/* Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={setSelectedProduct} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-xl">Không tìm thấy sản phẩm phù hợp</p>
                <button 
                  onClick={() => { setSelectedCategory([]); setSelectedPriceRange(PriceRange.ALL); }}
                  className="mt-4 text-orange-600 font-bold underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="font-black text-xl text-orange-600">GIỎ QUÀ TẾT 2026</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Chúng tôi cung cấp các giải pháp quà tặng Tết chuyên nghiệp, đẳng cấp cho cá nhân và doanh nghiệp. Tinh hoa nông sản Việt hội tụ trong từng giỏ quà.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Liên kết</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-orange-600 transition-colors">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Hướng dẫn đặt hàng</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Liên hệ</h5>
            <p className="text-sm text-gray-600 mb-2">📍 Hà Nội & TP. Hồ Chí Minh</p>
            <p className="text-sm text-gray-600 mb-2">📞 Hotline: 0985 023 463</p>
            <p className="text-sm text-gray-600">📧 Email: contact@gioquatet2026.vn</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
          © 2025 Giỏ Quà Tết 2026. Design by World-Class Engineer.
        </div>
      </footer>

      {/* Popups */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
      
      {isAdminOpen && (
        <AdminPanel 
          onAddProduct={addProduct} 
          onClose={closeAdmin} 
        />
      )}
    </div>
  );
};

export default App;
