import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from './api-config';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { BehaviorSubject, Observable, tap, timeout } from 'rxjs';
import { CartApiResponse } from '../../features/cart/models/cart-model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  readonly cartCount$ = this.cartCountSubject.asObservable();

  constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig) { }

  addToCart(productId: number, quantity: number, unitPrice: number): Observable<void>{
    const payload = { productId, quantity, unitPrice };
    return this.http.post<void>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.addToCart}`, payload).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  getCart(): Observable<CartApiResponse> {
    return this.http.get<CartApiResponse>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.get}`).pipe(
      tap((cart) => this.cartCountSubject.next(cart.items.length))
    );
  }

  updateItemQuantity(productId: number, quantity: number, cartItemId: number): Observable<CartApiResponse> {
    return this.http.put<CartApiResponse>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.updateItemQuantity}`, { cartItemId, quantity}).pipe(
      tap((cart) => this.cartCountSubject.next(cart.items.length))
    );
  }

  removeItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.removeItem(cartItemId)}`).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  applyPromoCode(code: string): Observable<CartApiResponse> {
    const payload = { code };
    return this.http.post<CartApiResponse>(`${this.apiConfig.baseUrl}/cart/apply-promo`, payload)
      .pipe(
        timeout(10000), // 10s timeout
        tap((cart) => {
          console.log('Promo applied successfully:', cart); // DEBUG
          this.cartCountSubject.next(cart.items.length);
        })
      );
  }

  private refreshCartCount(): void {
    this.getCart().subscribe();
  }
}
