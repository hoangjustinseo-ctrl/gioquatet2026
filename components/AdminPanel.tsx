
import React, { useState, useEffect, useRef } from 'react';
import { Product, FilterCategory } from '../types';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onImportProducts: (products: Product[]) => void;
  onClose: () => void;
}

// Thông tin đăng nhập đã được xử lý (Base64)
const AUTH_CONFIG = {
  u: "SG9hbmdWeUdpb3F1YXRldA==", // HoangVyGioquatet
  p: "R2lvcXVhdGV0MjAyNkAxMjg=", // Gioquatet2026@128 (Đã sửa từ 2027 thành 2026)
  sessionKey: "_secure_admin_session_v4"
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

    // Chống hack: So sánh bằng cách mã hóa input đầu vào rồi đối chiếu với chuỗi bảo mật
    const encodedU = btoa(username);
    const encodedP = btoa(password);

    if (encodedU === AUTH_CONFIG.u && encodedP === AUTH_CONFIG.p) {
      sessionStorage.setItem(AUTH_CONFIG.sessionKey, 'active');
      setView('dashboard');
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeout(() => { setIsLocked(false); setAttempts(0); }, 30000);
        alert('Thông tin không chính xác. Tài khoản tạm khóa 30 giây để bảo mật!');
      } else {
        alert(`Tên đăng nhập hoặc mật khẩu không đúng! Bạn còn ${3 - newAttempts} lần thử.`);
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
      
      lines.slice(1).forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const [name, price, category, desc, imgs] = parts;
          newProducts.push({
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: name?.trim(),
            price: parseInt(price?.trim() || '0'),
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
      <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
        <div className="max-w-md w-full bg-gray-900 p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex p-5 bg-orange-600/10 rounded-full mb-6">
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Xác thực Admin</h2>
            <p className="text-gray-500 text-xs mt-2 font-bold uppercase tracking-widest">Truy cập hệ thống quản trị</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Tên người dùng</label>
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all"
                value={username} 
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Mật khẩu bảo mật</label>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all"
                value={password} 
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              disabled={isLocked}
              className={`w-full py-5 rounded-2xl font-black transition-all shadow-xl ${isLocked ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'}`}
            >
              {isLocked ? 'ĐANG KHÓA TRUY CẬP...' : 'VÀO HỆ THỐNG'}
            </button>
            <button type="button" onClick={onClose} className="w-full text-gray-500 text-[10px] font-black hover:text-gray-300 uppercase tracking-widest mt-4">Quay về trang chủ</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] bg-gray-950 text-white overflow-hidden flex flex-col font-sans">
      <div className="bg-gray-900 px-8 py-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-orange-600/20">A</div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-tighter">Hệ thống Quản Trị</h2>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Admin Session Active</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}>Tổng quan</button>
          <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}>Sản phẩm</button>
          <div className="w-[1px] h-6 bg-gray-800 mx-2"></div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Đăng xuất</button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-12 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
        {view === 'dashboard' && (
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-800 text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-orange-600/10 transition-all"></div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Tổng số sản phẩm</p>
                <h3 className="text-6xl font-black text-orange-600">{products.length}</h3>
              </div>
              <div onClick={() => setView('add')} className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-orange-600/50 hover:bg-gray-800/40 transition-all group shadow-2xl">
                <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <p className="font-black text-xs uppercase tracking-widest">Thêm sản phẩm mới</p>
              </div>
              <div onClick={() => setView('import')} className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-orange-600/50 hover:bg-gray-800/40 transition-all group shadow-2xl">
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <p className="font-black text-xs uppercase tracking-widest">Nhập dữ liệu CSV</p>
              </div>
            </div>
          </div>
        )}

        {view === 'add' && (
          <div className="max-w-2xl mx-auto bg-gray-900 p-12 rounded-[3rem] border border-gray-800 shadow-2xl">
            <h3 className="text-2xl font-black mb-10 border-b border-gray-800 pb-6 uppercase tracking-widest">Tạo sản phẩm mới</h3>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              onAddProduct({
                id: `custom-${Date.now()}`,
                name: formData.name,
                price: parseInt(formData.price),
                category: formData.category,
                description: formData.description,
                images: formData.imageUrls.split(',').map(u => u.trim()).filter(u => u),
                isSoldOut: false
              });
              alert('Thêm sản phẩm thành công!');
              setView('dashboard');
            }}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Tên hiển thị *</label>
                <input type="text" placeholder="Nhập tên sản phẩm..." className="w-full bg-gray-800 rounded-2xl p-4 outline-none border border-transparent focus:border-orange-600 transition-all" required onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Giá tiền (VNĐ) *</label>
                  <input type="number" placeholder="Ví dụ: 500000" className="w-full bg-gray-800 rounded-2xl p-4 outline-none border border-transparent focus:border-orange-600 transition-all" required onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Phân loại *</label>
                  <select className="w-full bg-gray-800 rounded-2xl p-4 outline-none border border-transparent focus:border-orange-600 transition-all appearance-none cursor-pointer" onChange={e => setFormData({...formData, category: e.target.value as FilterCategory})}>
                    {Object.values(FilterCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Link ảnh (phân cách bằng dấu phẩy) *</label>
                <textarea placeholder="https://anh1.jpg, https://anh2.jpg" className="w-full bg-gray-800 rounded-2xl p-4 outline-none border border-transparent focus:border-orange-600 transition-all h-24 resize-none" required onChange={e => setFormData({...formData, imageUrls: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Mô tả chi tiết</label>
                <textarea placeholder="Nội dung mô tả sản phẩm..." className="w-full bg-gray-800 rounded-2xl p-4 outline-none border border-transparent focus:border-orange-600 transition-all h-40 resize-none" onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setView('dashboard')} className="flex-1 py-4 text-gray-500 font-black uppercase tracking-widest text-xs hover:text-white transition-all">Hủy bỏ</button>
                <button type="submit" className="flex-1 bg-orange-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-600/20 active:scale-95 transition-all">Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        )}

        {view === 'list' && (
          <div className="max-w-6xl mx-auto">
             <div className="flex justify-between items-end mb-8">
               <div>
                 <h3 className="text-3xl font-black uppercase tracking-tighter">Danh sách sản phẩm</h3>
                 <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Quản lý và chỉnh sửa kho hàng</p>
               </div>
               <button onClick={() => setView('add')} className="bg-orange-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">Thêm mới +</button>
             </div>
             <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <tr>
                      <th className="px-8 py-6">Thông tin sản phẩm</th>
                      <th className="px-8 py-6">Giá niêm yết</th>
                      <th className="px-8 py-6">Phân loại</th>
                      <th className="px-8 py-6 text-right">Quản lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-8 py-5 flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                            <img src={p.images[0]} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-bold text-sm tracking-tight">{p.name}</span>
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-orange-500">{p.price.toLocaleString()}đ</td>
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-800 px-3 py-1 rounded-full">{p.category}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {p.id.startsWith('custom-') ? (
                            <button onClick={() => { if(confirm('Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này?')) onDeleteProduct(p.id); }} className="text-red-500 hover:text-white hover:bg-red-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Xóa</button>
                          ) : (
                            <span className="text-gray-700 text-[9px] uppercase font-black tracking-widest border border-gray-800 px-3 py-1 rounded-md">Mặc định</span>
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
          <div className="max-w-xl mx-auto text-center space-y-10 bg-gray-900 p-16 rounded-[3.5rem] border border-gray-800 shadow-2xl">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Nhập dữ liệu lớn</h3>
              <p className="text-gray-500 text-xs font-medium leading-relaxed">Vui lòng sử dụng file CSV chuẩn. Cấu trúc: <br/><code className="text-orange-500 bg-gray-800 px-2 py-1 rounded mt-2 inline-block">Tên, Giá, Danh mục, Mô tả, Ảnh1|Ảnh2</code></p>
            </div>
            <div className="border-4 border-dashed border-gray-800 rounded-[2.5rem] p-16 hover:border-orange-600/50 transition-all cursor-pointer relative group bg-gray-950/30">
              <input type="file" accept=".csv" onChange={handleCsvImport} className="absolute inset-0 opacity-0 cursor-pointer z-10" title="" />
              <div className="text-gray-500 space-y-6 group-hover:text-gray-300 transition-all">
                <svg className="w-16 h-16 mx-auto opacity-20 group-hover:opacity-100 group-hover:text-orange-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <div className="space-y-2">
                   <p className="font-black text-sm uppercase tracking-widest">Kéo thả file .csv vào đây</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Hoặc click để duyệt file từ máy tính</p>
                </div>
              </div>
            </div>
            <button onClick={() => setView('dashboard')} className="text-gray-600 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-all">Quay lại Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
