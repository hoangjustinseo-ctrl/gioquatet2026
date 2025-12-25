
import React, { useState } from 'react';
import { Product, FilterCategory } from '../types';

interface AdminPanelProps {
  onAddProduct: (product: Product) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddProduct, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: FilterCategory.COMBO,
    description: '',
    imageUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.imageUrl) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      description: formData.description,
      images: [formData.imageUrl],
      isSoldOut: false
    };

    onAddProduct(newProduct);
    setFormData({
      name: '',
      price: '',
      category: FilterCategory.COMBO,
      description: '',
      imageUrl: ''
    });
    alert('Đã thêm sản phẩm thành công!');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-gray-900 flex items-center justify-center p-6 text-white overflow-y-auto">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-2xl shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">Đóng [X]</button>
        <h2 className="text-2xl font-bold mb-6 text-orange-500">QUẢN TRỊ VIÊN - THÊM SẢN PHẨM</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
            <input 
              type="text" 
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
              <input 
                type="number" 
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select 
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as FilterCategory})}
              >
                {Object.values(FilterCategory).filter(v => v !== FilterCategory.ALL).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL Hình ảnh</label>
            <input 
              type="text" 
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
            <textarea 
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-2 focus:ring-orange-500 outline-none h-32"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-bold text-white transition-colors"
          >
            LƯU SẢN PHẨM
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
