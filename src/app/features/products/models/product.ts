export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
  categoryName: string;
  sellerName: string;
  averageRating: number;
  imageUrls: string[];
  badge: 'TECH' | 'LIMITED' | 'NEW' | 'LUXURY';
  badgeColor?: string;
}
