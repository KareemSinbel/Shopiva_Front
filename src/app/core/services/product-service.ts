import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product, ProductFilterDto, Category } from '../../features/products/models/product';
import { ApiConfig } from './api-config';
import { API_ENDPOINTS } from '../constants/api-endpoints';

interface ProductApiResponse {
  items: Product[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

interface ProductListResponse {
  items: Product[];
  totalCount: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig) {

  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<ProductApiResponse>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.products.getAll}`).pipe(map(response => response.items));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.products.getById(id)}`);
  }

  getProducts(filter: ProductFilterDto): Observable<ProductListResponse> {
    let params = new HttpParams();

    if (filter.search) params = params.set('search', filter.search);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
    if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.inStock !== undefined) params = params.set('inStock', filter.inStock.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.descending !== undefined) params = params.set('descending', filter.descending.toString());
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());

    return this.http.get<ProductListResponse>(
      `${this.apiConfig.baseUrl}${API_ENDPOINTS.products.getAll}`,
      { params }
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiConfig.baseUrl}/categories`);
  }
}
