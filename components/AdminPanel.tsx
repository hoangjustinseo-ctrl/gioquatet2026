
import React, { useState, useEffect, useRef } from 'react';
import { Product, FilterCategory } from '../types';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onImportProducts: (products: Product[]) => void;
  onClose: () => void;
}

// Thông tin đăng nhập đã được xử lý (Conceptual Hashing)
const AUTH_CONFIG = {
  u: "SG9hbmdWeUdpb3F1YXRldA==", // HoangVyGioquatet (Base64)
  p: "R2lvcXVhdGV0MjAyN0AxMjg=", // Gioquatet2026@128 (Base64)
  sessionKey: "_secure_admin_session_v3"
};

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onAddProduct, onDeleteProduct, onImportProducts, onClose }) => {
  const [view, setView] = useState<'login' | 'dashboard' | 'add' | 'list' | 'import'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: FilterCategory.COMBO,
    description: '',
    imageUrls: ''
  });

  useEffect(() => {
    const session = sessionStorage.getItem(AUTH_CONFIG.sessionKey);
    if (session === 'active') setView('dashboard');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (btoa(username) === AUTH_CONFIG.u && btoa(password) === AUTH_CONFIG.p) {
      sessionStorage.setItem(AUTH_CONFIG.sessionKey, 'active');
      setView('dashboard');
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeout(() => { setIsLocked(false); setAttempts(0); }, 30000);
        alert('Sai quá nhiều lần! Hệ thống tạm khóa 30 giây.');
      } else {
        alert(`Thông tin không chính xác! Còn ${3 - newAttempts} lần thử.`);
      }
    }
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newProducts: Product[] = [];
      
      // Bỏ qua dòng header nếu có: Tên,Giá,Danh mục,Mô tả,Ảnh(phân cách |)
      lines.slice(1).forEach(line => {
        const [name, price, category, desc, imgs] = line.split(',');
        if (name && price) {
          newProducts.push({
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: name.trim(),
            price: parseInt(price.trim()),
            category: (category?.trim() as FilterCategory) || FilterCategory.COMBO,
            description: desc?.trim() || '',
            images: imgs ? imgs.split('|').map(i => i.trim()) : [],
            isSoldOut: false
          });
        }
      });
      
      if (newProducts.length > 0) {
        onImportProducts(newProducts);
        alert(`Đã nhập thành công ${newProducts.length} sản phẩm!`);
        setView('dashboard');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
    setView('login');
    onClose();
  };

  if (view === 'login') {
    return (
      <div className="fixed inset-0 z-[120] bg-black/98 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-900 p-8 rounded-[2rem] border border-gray-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-orange-600/10 rounded-2xl mb-4">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Hệ thống quản trị</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" placeholder="Tên đăng nhập" 
              className="w-full bg-gray-800 border-none rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-orange-600"
              value={username} onChange={e => setUsername(e.target.value)}
            />
            <input 
              type="password" placeholder="Mật khẩu" 
              className="w-full bg-gray-800 border-none rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-orange-600"
              value={password} onChange={e => setPassword(e.target.value)}
            />
            <button 
              disabled={isLocked}
              className={`w-full py-4 rounded-xl font-black transition-all ${isLocked ? 'bg-gray-700 text-gray-500' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
            >
              {isLocked ? 'ĐANG KHÓA...' : 'ĐĂNG NHẬP'}
            </button>
            <button type="button" onClick={onClose} className="w-full text-gray-500 text-xs font-bold hover:text-gray-300">THOÁT</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] bg-gray-950 text-white overflow-hidden flex flex-col">
      {/* Admin Header */}
      <div className="bg-gray-900 px-8 py-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-black">A</div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-tighter">Admin Dashboard</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Giỏ Quà Tết 2026</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-lg text-xs font-bold ${view === 'dashboard' ? 'bg-gray-800 text-orange-500' : 'text-gray-400'}`}>Tổng quan</button>
          <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-xs font-bold ${view === 'list' ? 'bg-gray-800 text-orange-500' : 'text-gray-400'}`}>Danh sách</button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-600/20">Đăng xuất</button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
        {view === 'dashboard' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 text-center">
              <p className="text-gray-500 text-xs font-bold uppercase mb-2">Tổng sản phẩm</p>
              <h3 className="text-5xl font-black text-orange-600">{products.length}</h3>
            </div>
            <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 flex flex-col justify-center cursor-pointer hover:border-orange-600 transition-all" onClick={() => setView('add')}>
              <div className="mx-auto mb-2 text-orange-600"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg></div>
              <p className="text-center font-bold text-sm">Thêm sản phẩm mới</p>
            </div>
            <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 flex flex-col justify-center cursor-pointer hover:border-orange-600 transition-all" onClick={() => setView('import')}>
              <div className="mx-auto mb-2 text-orange-600"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></div>
              <p className="text-center font-bold text-sm">Nhập từ CSV</p>
            </div>
          </div>
        )}

        {view === 'add' && (
          <div className="max-w-2xl mx-auto bg-gray-900 p-10 rounded-3xl border border-gray-800">
            <h3 className="text-xl font-black mb-8 border-b border-gray-800 pb-4">TẠO SẢN PHẨM MỚI</h3>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              onAddProduct({
                id: `custom-${Date.now()}`,
                name: formData.name,
                price: parseInt(formData.price),
                category: formData.category,
                description: formData.description,
                images: formData.imageUrls.split(',').map(u => u.trim()),
                isSoldOut: false
              });
              alert('Thành công!');
              setView('dashboard');
            }}>
              <input type="text" placeholder="Tên sản phẩm *" className="w-full bg-gray-800 rounded-xl p-4 outline-none border border-transparent focus:border-orange-600" required onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Giá tiền *" className="w-full bg-gray-800 rounded-xl p-4 outline-none border border-transparent focus:border-orange-600" required onChange={e => setFormData({...formData, price: e.target.value})} />
                <select className="w-full bg-gray-800 rounded-xl p-4 outline-none border border-transparent focus:border-orange-600" onChange={e => setFormData({...formData, category: e.target.value as FilterCategory})}>
                  {Object.values(FilterCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <textarea placeholder="URL Ảnh (cách nhau dấu phẩy) *" className="w-full bg-gray-800 rounded-xl p-4 outline-none border border-transparent focus:border-orange-600 h-24" required onChange={e => setFormData({...formData, imageUrls: e.target.value})} />
              <textarea placeholder="Mô tả" className="w-full bg-gray-800 rounded-xl p-4 outline-none border border-transparent focus:border-orange-600 h-32" onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="flex gap-4">
                <button type="button" onClick={() => setView('dashboard')} className="flex-1 py-4 text-gray-500 font-bold">HỦY</button>
                <button type="submit" className="flex-1 bg-orange-600 py-4 rounded-xl font-black">XÁC NHẬN LƯU</button>
              </div>
            </form>
          </div>
        )}

        {view === 'list' && (
          <div className="max-w-5xl mx-auto">
             <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-800/50 text-xs font-black uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Sản phẩm</th>
                      <th className="px-6 py-4">Giá</th>
                      <th className="px-6 py-4">Loại</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <img src={p.images[0]} className="w-10 h-10 rounded object-cover" />
                          <span className="font-bold text-sm">{p.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-orange-500">{p.price.toLocaleString()}đ</td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">{p.category}</td>
                        <td className="px-6 py-4 text-right">
                          {p.id.startsWith('custom-') ? (
                            <button onClick={() => { if(confirm('Xóa sản phẩm này?')) onDeleteProduct(p.id); }} className="text-red-500 hover:text-red-400 text-xs font-black uppercase tracking-tighter">Xóa bỏ</button>
                          ) : (
                            <span className="text-gray-700 text-[10px] uppercase font-black">Hệ thống</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {view === 'import' && (
          <div className="max-w-xl mx-auto text-center space-y-8 bg-gray-900 p-12 rounded-3xl border border-gray-800">
            <h3 className="text-2xl font-black">NHẬP DỮ LIỆU CSV</h3>
            <p className="text-gray-400 text-sm italic">File CSV cấu trúc: Tên, Giá, Danh mục, Mô tả, Ảnh1|Ảnh2</p>
            <div className="border-2 border-dashed border-gray-700 rounded-3xl p-10 hover:border-orange-600 transition-colors cursor-pointer relative">
              <input type="file" accept=".csv" onChange={handleCsvImport} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="text-gray-500 space-y-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="font-bold">Nhấn để chọn file hoặc kéo thả</p>
              </div>
            </div>
            <button onClick={() => setView('dashboard')} className="text-gray-500 font-bold text-sm">Quay lại</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
