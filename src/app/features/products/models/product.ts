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
  createdAt?: Date | string;
}

export interface ProductCart
{
  id: number;
  name: string;
  price: number;
  stock: number;
  discountPrice?: number;
  imageUrl?: string;
}

export interface ProductFilterDto {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  descending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface Category {
  id: number;
  name: string;
}

export type RelatedProduct = Pick<Product, 'id' | 'name' | 'price' | 'imageUrls'>;
