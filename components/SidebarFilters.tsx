
import React from 'react';
import { FilterCategory, PriceRange } from '../types';

interface SidebarFiltersProps {
  selectedCategory: string[];
  setSelectedCategory: (categories: string[]) => void;
  selectedPriceRange: PriceRange;
  setSelectedPriceRange: (range: PriceRange) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange
}) => {
  const categories = Object.values(FilterCategory).filter(v => v !== FilterCategory.ALL);
  const priceRanges = Object.values(PriceRange);

  const toggleCategory = (cat: string) => {
    if (selectedCategory.includes(cat)) {
      setSelectedCategory(selectedCategory.filter(c => c !== cat));
    } else {
      setSelectedCategory([...selectedCategory, cat]);
    }
  };

  return (
    <div className="w-full lg:w-64 space-y-8 sticky top-24">
      <section>
        <h3 className="text-xl font-bold border-b-2 border-gray-100 pb-2 mb-4 uppercase tracking-wider">BỘ LỌC</h3>
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Nhóm sản phẩm</h4>
          <div className="space-y-3">
            {categories.map(cat => (
              <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-orange-600 rounded" 
                  checked={selectedCategory.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span className="text-gray-600 group-hover:text-orange-600 transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Giá tiền</h4>
          <div className="space-y-3">
            {priceRanges.map(range => (
              <label key={range} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="price" 
                  className="w-4 h-4 accent-orange-600" 
                  checked={selectedPriceRange === range}
                  onChange={() => setSelectedPriceRange(range)}
                />
                <span className="text-gray-600 group-hover:text-orange-600 transition-colors">{range}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SidebarFilters;
