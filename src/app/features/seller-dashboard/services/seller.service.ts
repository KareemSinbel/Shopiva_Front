import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  constructor(private http: HttpClient) { }

  /**
   * Fetch seller dashboard statistics
   */
  getDashboard(): Promise<SellerDashboardDto> {
    return this.http
      .get<SellerDashboardDto>(`${this.baseUrl}/dashboard`)
      .toPromise()
      .then((data) => {
        if (!data) throw new Error('No dashboard data received');
        return data;
      })
      .catch((err) => {
        console.error('Error fetching dashboard:', err);
        throw err;
      });
  }

  /**
   * Fetch categories from API
   */
  getCategories(): Promise<any[]> {
    return this.http
      .get<any[]>('https://localhost:7259/api/Category')
      .toPromise()
      .then((data) => {
        if (!data) throw new Error('No categories received');
        return data;
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        throw err;
      });
  }

  /**
   * Fetch seller's products with filtering and pagination
   */
  getProducts(
    filter: SellerProductFilterDto
  ): Promise<PaginatedResult<SellerProductSummaryDto>> {
    let params = new HttpParams();

    if (filter.search) {
      params = params.set('search', filter.search);
    }
    if (filter.categoryId) {
      params = params.set('categoryId', filter.categoryId.toString());
    }
    if (filter.isActive !== undefined) {
      params = params.set('isActive', filter.isActive.toString());
    }
    if (filter.inStock !== undefined) {
      params = params.set('inStock', filter.inStock.toString());
    }

    params = params.set('sortBy', filter.sortBy);
    params = params.set('descending', filter.descending.toString());
    params = params.set('page', filter.page.toString());
    params = params.set('pageSize', filter.pageSize.toString());

    return this.http
      .get<PaginatedResult<SellerProductSummaryDto>>(
        `${this.baseUrl}/products`,
        { params }
      )
      .toPromise()
      .then((data) => {
        if (!data) throw new Error('No products data received');
        return data;
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        throw err;
      });
  }

  /**
   * Fetch seller's orders with filtering and pagination
   */
  getOrders(
    filter: SellerOrderFilterDto
  ): Promise<PaginatedResult<SellerOrderSummaryDto>> {
    let params = new HttpParams();

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    params = params.set('page', filter.page.toString());
    params = params.set('pageSize', filter.pageSize.toString());

    return this.http
      .get<PaginatedResult<SellerOrderSummaryDto>>(
        `${this.baseUrl}/orders`,
        { params }
      )
      .toPromise()
      .then((data) => {
        if (!data) throw new Error('No orders data received');
        return data;
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        throw err;
      });
  }

  /**
   * Get a single product by ID
   */
  getProductById(id: number): Promise<SellerProductSummaryDto> {
    return this.http
      .get<SellerProductSummaryDto>(`${this.baseUrl}/products/${id}`)
      .toPromise()
      .then((data) => {
        if (!data) throw new Error('No product data received');
        return data;
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        throw err;
      });
  }

  /**
   * Create a new product
   */
  createProduct(formData: FormData): Promise<SellerProductSummaryDto> {
    const baseUrl = 'https://localhost:7259/api/Products';
    return this.http
      .post<SellerProductSummaryDto>(baseUrl, formData)
      .toPromise()
      .then((data) => {
        if (!data) throw new Error('No product data received');
        return data;
      })
      .catch((err) => {
        console.error('Error creating product:', err);
        throw err;
      });
  }

  /**
   * Update an existing product
   */
  updateProduct(id: number, formData: FormData): Promise<SellerProductSummaryDto> {
    const baseUrl = 'https://localhost:7259/api/Products';
    return this.http
      .put<SellerProductSummaryDto>(`${baseUrl}/${id}`, formData)
      .toPromise()
      .then((data) => {
        if (!data) throw new Error('No product data received');
        return data;
      })
      .catch((err) => {
        console.error('Error updating product:', err);
        throw err;
      });
  }

  /**
   * Delete a product
   */
  deleteProduct(id: number): Promise<void> {
    const baseUrl = 'https://localhost:7259/api/Products';
    return this.http
      .delete<void>(`${baseUrl}/${id}`)
      .toPromise()
      .then(() => {
        console.log('Product deleted successfully');
      })
      .catch((err) => {
        console.error('Error deleting product:', err);
        throw err;
      });
  }
}
