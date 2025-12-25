
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  isSoldOut?: boolean;
}

export enum FilterCategory {
  ALL = 'Tất cả',
  COMBO = 'Combo quà tặng',
  ORIGINAL_NUTS = 'Hạt nguyên vị',
  SEASONED_NUTS = 'Hạt tẩm vị',
  HEALTHY_SNACK = 'Healthy Snack',
  ASSEMBLY = 'Sản phẩm phối hộp quà'
}

export enum PriceRange {
  ALL = 'Tất cả',
  UNDER_500 = 'Dưới 500.000đ',
  FROM_500_TO_1000 = '500.000đ - 1.000.000đ',
  FROM_1000_TO_2000 = '1.000.000đ - 2.000.000đ',
  OVER_2000 = 'Trên 2.000.000đ'
}
