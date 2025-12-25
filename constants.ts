
import { Product, FilterCategory } from './types';

export const FANPAGE_URL = "https://www.facebook.com/profile.php?id=61584802095138&locale=vi_VN";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'GIỎ QUÀ HAPPY TẾT 1 (HẾT HÀNG)',
    price: 605000,
    category: FilterCategory.COMBO,
    images: ['https://picsum.photos/seed/tet1/800/800', 'https://picsum.photos/seed/tet1-2/800/800'],
    description: 'Bao gồm: Rượu vang, Bánh quy Majestic, Chocolate Draft, Hạt điều, Táo đỏ...',
    isSoldOut: true
  },
  {
    id: '2',
    name: 'GIỎ QUÀ HAPPY TẾT 2 (HẾT HÀNG)',
    price: 950000,
    category: FilterCategory.COMBO,
    images: ['https://picsum.photos/seed/tet2/800/800', 'https://picsum.photos/seed/tet2-2/800/800'],
    description: 'Sự kết hợp hoàn hảo giữa các loại hạt dinh dưỡng và rượu vang thượng hạng.',
    isSoldOut: true
  },
  {
    id: '3',
    name: 'GIỎ QUÀ HAPPY TẾT 3 (HẾT HÀNG)',
    price: 1150000,
    category: FilterCategory.COMBO,
    images: ['https://picsum.photos/seed/tet3/800/800', 'https://picsum.photos/seed/tet3-2/800/800'],
    description: 'Rượu vang Sol De Chile Rose Syrah, Bánh quy, Táo đỏ, Kẹo C&H, Chocolate Tiramisu...',
    isSoldOut: true
  },
  {
    id: '4',
    name: 'GIỎ QUÀ HAPPY TẾT 4 (HẾT HÀNG)',
    price: 1650000,
    category: FilterCategory.COMBO,
    images: ['https://picsum.photos/seed/tet4/800/800'],
    description: 'Dòng sản phẩm cao cấp dành cho đối tác doanh nghiệp.',
    isSoldOut: true
  },
  {
    id: '5',
    name: 'Hạt Điều Nguyên Vị Cao Cấp',
    price: 250000,
    category: FilterCategory.ORIGINAL_NUTS,
    images: ['https://picsum.photos/seed/nuts1/800/800'],
    description: 'Hạt điều rang muối vỏ lụa, giòn tan, vị ngọt tự nhiên.'
  },
  {
    id: '6',
    name: 'Hộp Quà Sức Khỏe Healthy',
    price: 480000,
    category: FilterCategory.HEALTHY_SNACK,
    images: ['https://picsum.photos/seed/healthy1/800/800'],
    description: 'Gồm các loại hạt mix và trái cây sấy dẻo không đường.'
  },
  {
    id: '7',
    name: 'Rượu Vang Đỏ Sang Trọng',
    price: 1200000,
    category: FilterCategory.ASSEMBLY,
    images: ['https://picsum.photos/seed/wine1/800/800'],
    description: 'Rượu vang nhập khẩu chính ngạch, phù hợp biếu tặng.'
  }
];
