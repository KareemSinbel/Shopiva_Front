import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
export class SellerInventory implements OnInit {

  products = signal<SellerProductSummaryDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  totalCount = signal(0);
  filter = signal(new SellerProductFilterDto());
  sortBy = signal<'price' | 'name' | 'stock' | 'createdAt'>('createdAt');
  searchQuery = signal('');

  constructor(private sellerService: SellerService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {

    this.loading.set(true);
    this.error.set(null);

    const currentFilter = { ...this.filter() };

    currentFilter.sortBy = this.sortBy();

    this.sellerService
      .getProducts(currentFilter)
      .then((data: PaginatedResult<SellerProductSummaryDto>) => {

        this.products.set(data.items);
        this.totalCount.set(data.totalCount);

        this.loading.set(false);
      })
      .catch((err) => {

        this.error.set('Failed to load products. Please try again.');

        this.loading.set(false);

        console.error(err);
      });
  }

  onSearch(query: string): void {

    const newFilter = { ...this.filter() };

    newFilter.search = query || undefined;
    newFilter.page = 1;

    this.filter.set(newFilter);

    this.loadProducts();
  }

  onFilterChange(): void {

    const newFilter = { ...this.filter() };

    newFilter.page = 1;

    this.filter.set(newFilter);

    this.loadProducts();
  }

  onPageChange(page: number): void {

    const newFilter = { ...this.filter() };

    newFilter.page = page;

    this.filter.set(newFilter);

    this.loadProducts();
  }

  onSortChange(
    sortBy: 'price' | 'name' | 'stock' | 'createdAt'
  ): void {

    const newFilter = { ...this.filter() };

    newFilter.sortBy = sortBy;

    newFilter.descending =
      this.sortBy() === sortBy
        ? !newFilter.descending
        : true;

    newFilter.page = 1;

    this.filter.set(newFilter);

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
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    );

    if (confirmed) {
      this.loading.set(true);
      this.error.set(null);

      this.sellerService
        .deleteProduct(id)
        .then(() => {
          this.loadProducts();
          this.error.set(null);
        })
        .catch((err) => {
          this.error.set('Failed to delete product. Please try again.');
          this.loading.set(false);
          console.error(err);
        });
    }
  }

  getPageCount(): number {

    return Math.ceil(
      this.totalCount() / this.filter().pageSize
    );
  }

  pages(): number[] {

    return Array.from(
      { length: this.getPageCount() },
      (_, i) => i + 1
    );
  }
}
``
