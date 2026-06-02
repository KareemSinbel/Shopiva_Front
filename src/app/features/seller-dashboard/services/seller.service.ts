import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  SellerDashboardDto,
  SellerProductSummaryDto,
  SellerOrderSummaryDto,
  PaginatedResult,
  SellerProductFilterDto,
  SellerOrderFilterDto,
  CreateProductDto,
  UpdateProductDto,
} from '../models/seller-dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private baseUrl = 'https://localhost:7259/api/seller';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<SellerDashboardDto> {
    return this.http.get<SellerDashboardDto>(`${this.baseUrl}/dashboard`).pipe(
      catchError((err) => {
        console.error('Error fetching dashboard:', err);
        return throwError(() => err);
      })
    );
  }

  getCategories(): Observable<any[]> {
    return this.http
      .get<any[]>('https://localhost:7259/api/Category')
      .pipe(
        catchError((err) => {
          console.error('Error fetching categories:', err);
          return throwError(() => err);
        })
      );
  }

  getProducts(
    filter: SellerProductFilterDto
  ): Observable<PaginatedResult<SellerProductSummaryDto>> {
    let params = new HttpParams();

    if (filter.search) params = params.set('search', filter.search);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
    if (filter.isActive !== undefined) params = params.set('isActive', filter.isActive.toString());
    if (filter.inStock !== undefined) params = params.set('inStock', filter.inStock.toString());

    params = params.set('sortBy', filter.sortBy);
    params = params.set('descending', filter.descending.toString());
    params = params.set('page', filter.page.toString());
    params = params.set('pageSize', filter.pageSize.toString());

    return this.http
      .get<PaginatedResult<SellerProductSummaryDto>>(`${this.baseUrl}/products`, { params })
      .pipe(
        catchError((err) => {
          console.error('Error fetching products:', err);
          return throwError(() => err);
        })
      );
  }

  getOrders(
    filter: SellerOrderFilterDto
  ): Observable<PaginatedResult<SellerOrderSummaryDto>> {
    let params = new HttpParams();

    if (filter.status) params = params.set('status', filter.status);
    params = params.set('page', filter.page.toString());
    params = params.set('pageSize', filter.pageSize.toString());

    return this.http
      .get<PaginatedResult<SellerOrderSummaryDto>>(`${this.baseUrl}/orders`, { params })
      .pipe(
        catchError((err) => {
          console.error('Error fetching orders:', err);
          return throwError(() => err);
        })
      );
  }

  getProductById(id: number): Observable<SellerProductSummaryDto> {
    return this.http
      .get<SellerProductSummaryDto>(`https://localhost:7259/api/products/${id}`)
      .pipe(
        catchError((err) => {
          console.error('Error fetching product:', err);
          return throwError(() => err);
        })
      );
  }

  createProduct(formData: FormData): Observable<SellerProductSummaryDto> {
    return this.http
      .post<SellerProductSummaryDto>('https://localhost:7259/api/Products', formData)
      .pipe(
        catchError((err) => {
          console.error('Error creating product:', err);
          return throwError(() => err);
        })
      );
  }

  updateProduct(id: number, formData: FormData): Observable<SellerProductSummaryDto> {
    return this.http
      .put<SellerProductSummaryDto>(`https://localhost:7259/api/Products/${id}`, formData)
      .pipe(
        catchError((err) => {
          console.error('Error updating product:', err);
          return throwError(() => err);
        })
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`https://localhost:7259/api/Products/${id}`)
      .pipe(
        tap(() => console.log('Product deleted successfully')),
        catchError((err) => {
          console.error('Error deleting product:', err);
          return throwError(() => err);
        })
      );
  }
}
