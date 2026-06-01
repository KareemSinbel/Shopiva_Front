import {ProductCart } from '../../../features/products/models/product';

// A cart item is a product snapshot + quantity chosen by the user
export interface CartItemModel {
  // quantity: number;
  id: number;
  product: ProductCart;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// What the API sends/receives
export interface CartApiResponse {
  id: string;
  items: CartItemModel[];
  promoCode?: string;
  discountAmount?: number;
}

export interface OrderSummaryModel {
  subtotal: number;
  shipping: number | null;   // null = "calculated at checkout"
  tax: number;
  discount: number;
  total: number;
}

export type CheckoutStep = 'cart' | 'shipping' | 'payment';

export interface Step {
  key: CheckoutStep;
  label: string;
  index: number;
}
