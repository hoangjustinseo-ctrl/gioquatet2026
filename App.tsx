
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import SidebarFilters from './components/SidebarFilters';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AdminPanel from './components/AdminPanel';
import { Product, PriceRange, FilterCategory } from './types';
import { INITIAL_PRODUCTS, HOTLINE } from './constants';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>(PriceRange.ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);

  // Cơ chế mã hóa đơn giản để che mắt người dùng thông thường
  const obscureData = (data: any) => btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const deobscureData = (data: string) => JSON.parse(decodeURIComponent(escape(atob(data))));

  useEffect(() => {
    const localData = localStorage.getItem('_qt26_secure_storage_v4');
    let custom: Product[] = [];
    if (localData) {
      try {
        custom = deobscureData(localData);
      } catch (e) {
        console.error("Lỗi dữ liệu bảo mật");
      }
    }
    setProducts([...INITIAL_PRODUCTS, ...custom]);
  }, []);

  const handleSecretClick = () => {
    setSecretClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setIsAdminOpen(true);
        return 0;
      }
      return newCount;
    });
    
    const timer = setTimeout(() => setSecretClickCount(0), 3000);
    return () => clearTimeout(timer);
  };

  const saveToLocal = (allProds: Product[]) => {
    const custom = allProds.filter(p => p.id.startsWith('custom-'));
    localStorage.setItem('_qt26_secure_storage_v4', obscureData(custom));
  };

  const addProduct = (newProd: Product) => {
    const updated = [...products, newProd];
    setProducts(updated);
    saveToLocal(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveToLocal(updated);
  };

  const importProducts = (newProds: Product[]) => {
    const updated = [...products, ...newProds];
    setProducts(updated);
    saveToLocal(updated);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] selection:bg-orange-100">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <section className="mb-10">
          <div className="flex flex-wrap gap-2 mb-8">
            <button 
              onClick={() => setSelectedCategory([])}
              className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all
                ${selectedCategory.length === 0 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-200'}`}
            >
              {FilterCategory.ALL}
            </button>
            {Object.values(FilterCategory).filter(v => v !== FilterCategory.ALL).map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all
                  ${selectedCategory.includes(cat)
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                    : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-64 flex-shrink-0">
            <SidebarFilters 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
            />
          </aside>

          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium italic">Không tìm thấy sản phẩm yêu cầu...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 border-b border-gray-800 pb-20">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-xl">G</div>
              <span className="text-2xl font-black tracking-tighter">GIỎ QUÀ TẾT 2026</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Hệ thống cung cấp quà tặng Tết cao cấp cho doanh nghiệp và cá nhân. Mỗi sản phẩm là một lời chúc bình an, phú quý gửi gắm đến người thân, đối tác.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-orange-500 mb-6 uppercase text-xs tracking-widest">Hỗ trợ khách hàng</h5>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Đổi trả sản phẩm</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-orange-500 mb-6 uppercase text-xs tracking-widest">Văn phòng</h5>
            <div className="space-y-4 text-sm text-gray-400">
              <p>📍 Số 123 Đường Láng, Hà Nội</p>
              <p>📍 Số 456 Nguyễn Huệ, Quận 1, HCM</p>
              <p>📞 Hotline: {HOTLINE}</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-10 flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          <span>© 2026 GIỎ QUÀ TẾT VIỆT</span>
          <span 
            className="cursor-pointer hover:text-gray-400 transition-all select-none opacity-50"
            onClick={handleSecretClick}
          >
            Được thiết kế bởi World-Class Team
          </span>
        </div>
      </footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      
      {isAdminOpen && (
        <AdminPanel 
          products={products}
          onAddProduct={addProduct} 
          onDeleteProduct={deleteProduct}
          onImportProducts={importProducts}
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
