import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from './api-config';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Observable } from 'rxjs';
import { CartApiResponse } from '../../features/cart/models/cart-model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig) { }

  addToCart(productId: number, quantity: number, unitPrice: number): Observable<void>{
    const payload = { productId, quantity, unitPrice };
    return this.http.post<void>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.addToCart}`, payload);
  }

  getCart(): Observable<CartApiResponse> {
    return this.http.get<CartApiResponse>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.get}`);
  }

  updateItemQuantity(productId: number, quantity: number, cartItemId: number): Observable<CartApiResponse> {
    return this.http.put<CartApiResponse>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.updateItemQuantity}`, { cartItemId,quantity });
  }

  removeItem(productId: number): Observable<CartApiResponse> {
    return this.http.delete<CartApiResponse>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.removeItem(productId)}`);
  }
}
