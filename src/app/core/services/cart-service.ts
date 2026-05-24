import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from './api-config';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig) { }

  addToCart(productId: number, quantity: number, unitPrice: number): Observable<void>{
    const payload = { productId, quantity, unitPrice };
    return this.http.post<void>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.cart.addToCart}`, payload);
  }
}
