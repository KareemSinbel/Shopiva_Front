import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductFilterDto, Category } from '../products/models/product';
import { ProductService } from '../../core/services/product-service';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private destroy$ = new Subject<void>();

  // State
  products$: Observable<Product[]> | null = null;
  categories: Category[] = [];
  filter: ProductFilterDto = {
    search: '',
    categoryId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
    sortBy: 'createdAt',
    descending: true,
    page: 1,
    pageSize: 10,
  };

  totalPages: number = 1;
  totalCount: number = 0;
  isLoading: boolean = false;

  // Pagination constants
  readonly PAGE_SIZE_OPTIONS = [10, 20, 50];
  readonly SORT_OPTIONS = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'averageRating', label: 'Top Rated' },
  ];

  // Price range constraints
  minPriceInput: number = 0;
  maxPriceInput: number = 5000;

  ngOnInit(): void {
    this.loadCategories();
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load categories for filter dropdown
   */
  private loadCategories(): void {
    this.productService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Failed to load categories:', error);
          // Fallback to empty array - filtering will still work
        },
      });
  }

  /**
   * Fetch products based on current filter
   */
  private fetchProducts(): void {
    this.isLoading = true;
    this.products$ = null;

    this.productService
      .getProducts(this.filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.products$ = new Observable((observer) => {
            observer.next(response.items);
            observer.complete();
          });
          this.totalCount = response.totalCount;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to fetch products:', error);
          this.isLoading = false;
          this.products$ = new Observable((observer) => {
            observer.next([]);
            observer.complete();
          });
        },
      });
  }

  /**
   * Handle search input change
   */
  onSearchChange(searchTerm: string): void {
    this.filter.search = searchTerm;
    this.filter.page = 1;
    this.fetchProducts();
  }

  /**
   * Handle category filter change
   */
  onCategoryChange(categoryId: number | undefined): void {
    this.filter.categoryId = categoryId;
    this.filter.page = 1;
    this.fetchProducts();
  }

  /**
   * Handle price range change
   */
  onPriceRangeChange(min: number, max: number): void {
    this.filter.minPrice = min;
    this.filter.maxPrice = max;
    this.filter.page = 1;
    this.fetchProducts();
  }

  /**
   * Handle in-stock filter change
   */
  onStockFilterChange(inStock: boolean): void {
    this.filter.inStock = inStock ? true : undefined;
    this.filter.page = 1;
    this.fetchProducts();
  }

  /**
   * Handle sort change
   */
  onSortChange(sortBy: string): void {
    this.filter.sortBy = sortBy;
    this.filter.page = 1;
    this.fetchProducts();
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(pageSize: number): void {
    this.filter.pageSize = pageSize;
    this.filter.page = 1;
    this.fetchProducts();
  }

  /**
   * Navigate to specific page
   */
  onPageChange(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.filter.page = pageNumber;
      this.fetchProducts();
    }
  }

  /**
   * Navigate to next page
   */
  nextPage(): void {
    if (this.filter.page && this.filter.page < this.totalPages) {
      this.onPageChange(this.filter.page + 1);
    }
  }

  /**
   * Navigate to previous page
   */
  prevPage(): void {
    if (this.filter.page && this.filter.page > 1) {
      this.onPageChange(this.filter.page - 1);
    }
  }

  /**
   * Get current page number
   */
  get currentPage(): number {
    return this.filter.page || 1;
  }

  /**
   * Get page numbers array for pagination display
   */
  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Check if previous button should be disabled
   */
  get isPrevDisabled(): boolean {
    return !this.filter.page || this.filter.page <= 1;
  }

  /**
   * Check if next button should be disabled
   */
  get isNextDisabled(): boolean {
    return !this.filter.page || this.filter.page >= this.totalPages;
  }

  /**
   * TrackBy function for ngFor
   */
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  /**
   * Check if category is selected
   */
  isCategorySelected(categoryId: number): boolean {
    return this.filter.categoryId === categoryId;
  }

  /**
   * Toggle sort direction (ascending/descending)
   */
  toggleSortDirection(): void {
    this.filter.descending = !this.filter.descending;
    this.filter.page = 1;
    this.fetchProducts();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filter = {
      search: '',
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      sortBy: 'createdAt',
      descending: true,
      page: 1,
      pageSize: 10,
    };
    this.minPriceInput = 0;
    this.maxPriceInput = 5000;
    this.fetchProducts();
  }
}
