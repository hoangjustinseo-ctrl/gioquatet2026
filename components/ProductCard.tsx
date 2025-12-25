
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
      onClick={() => onClick(product)}
    >
      <div className="aspect-square bg-orange-50 overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isSoldOut && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            HẾT HÀNG
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-sm leading-snug line-clamp-2 h-10 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-orange-600 font-bold text-lg">
          {product.price.toLocaleString('vi-VN')} đ
        </p>
        <div className="pt-2">
          <button className="w-full border border-orange-600 text-orange-600 py-2 rounded font-bold text-xs uppercase hover:bg-orange-600 hover:text-white transition-all">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
