import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { GradientButton } from '../../shared/components/gradient-button/gradient-button';
import { SellerService } from '../seller-dashboard/services/seller.service';
import {
  SellerProductSummaryDto,
  SellerProductFilterDto,
  PaginatedResult,
} from '../seller-dashboard/models/seller-dashboard.models';

@Component({
  selector: 'app-seller-inventory',
  imports: [CommonModule, FormsModule, GradientButton],
  templateUrl: './seller-inventory.html',
  styleUrl: './seller-inventory.css',
})
export class SellerInventory implements OnInit, OnDestroy {
  products = signal<SellerProductSummaryDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  totalCount = signal(0);
  filter = signal(new SellerProductFilterDto());
  sortBy = signal<'price' | 'name' | 'stock' | 'createdAt'>('createdAt');
  searchQuery = '';  // plain string, not signal

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private sellerService: SellerService, private router: Router) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((query) => {
      this.filter.set({ ...this.filter(), search: query || undefined, page: 1 });
      this.loadProducts();
    });

    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    const currentFilter = { ...this.filter(), sortBy: this.sortBy() };

    this.sellerService.getProducts(currentFilter).subscribe({
      next: (data: PaginatedResult<SellerProductSummaryDto>) => {
        this.products.set(data.items);
        this.totalCount.set(data.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products. Please try again.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);  // debounced, won't reload on every keystroke
  }

  onFilterChange(): void {
    this.filter.set({ ...this.filter(), page: 1 });
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.filter.set({ ...this.filter(), page });
    this.loadProducts();
  }

  onSortChange(sortBy: 'price' | 'name' | 'stock' | 'createdAt'): void {
    const descending = this.sortBy() === sortBy ? !this.filter().descending : true;
    this.filter.set({ ...this.filter(), sortBy, descending, page: 1 });
    this.sortBy.set(sortBy);
    this.loadProducts();
  }

  onAddProduct(): void {
    this.router.navigate(['/seller/add-product']);
  }

  onEditProduct(id: number): void {
    this.router.navigate(['/seller/edit-product', id]);
  }

  onDeleteProduct(id: number, name: string): void {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    this.loading.set(true);
    this.error.set(null);

    this.sellerService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        this.error.set('Failed to delete product. Please try again.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  getPageCount(): number {
    return Math.ceil(this.totalCount() / this.filter().pageSize);
  }

  pages(): number[] {
    return Array.from({ length: this.getPageCount() }, (_, i) => i + 1);
  }
}
