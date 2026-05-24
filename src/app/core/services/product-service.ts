import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../../features/products/models/product';
import { ApiConfig } from './api-config';
import { API_ENDPOINTS } from '../constants/api-endpoints';

interface ProductApiResponse {
  items: Product[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig)
  {

  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<ProductApiResponse>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.products.getAll}`).pipe(map(response=> response.items));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.products.getById(id)}`);
  }
}
