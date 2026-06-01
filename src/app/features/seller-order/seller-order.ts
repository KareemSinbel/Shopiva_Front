import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../seller-dashboard/services/seller.service';
import {
  SellerOrderSummaryDto,
  SellerDashboardDto,
  SellerOrderFilterDto,
  PaginatedResult,
} from '../seller-dashboard/models/seller-dashboard.models';

@Component({
  selector: 'app-seller-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-order.html',
  styleUrl: './seller-order.css',
})
export class SellerOrder implements OnInit {
  Array = Array;
  orders = signal<SellerOrderSummaryDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  totalCount = signal(0);
  filter = signal(new SellerOrderFilterDto());
  dashboardData = signal<SellerDashboardDto | null>(null);
  selectedStatus = signal<string>('');

  orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadDashboard();
  }

  private loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.sellerService.getOrders(this.filter()).subscribe({
      next: (data: PaginatedResult<SellerOrderSummaryDto>) => {
        this.orders.set(data.items);
        this.totalCount.set(data.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load orders. Please try again.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private loadDashboard(): void {
    this.sellerService.getDashboard().subscribe({
      next: (data) => this.dashboardData.set(data),
      error: (err) => console.error('Failed to load dashboard:', err),
    });
  }

  onStatusFilter(status: string): void {
    const newFilter = { ...this.filter() };
    newFilter.status = status || undefined;
    newFilter.page = 1;
    this.filter.set(newFilter);
    this.selectedStatus.set(status);
    this.loadOrders();
  }

  onPageChange(page: number): void {
    const newFilter = { ...this.filter() };
    newFilter.page = page;
    this.filter.set(newFilter);
    this.loadOrders();
  }

  getPageCount(): number {
    return Math.ceil(this.totalCount() / this.filter().pageSize);
  }

  getStatusBadgeClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-700';
    if (statusLower.includes('processing')) return 'bg-blue-100 text-blue-700';
    if (statusLower.includes('shipped')) return 'bg-purple-100 text-purple-700';
    if (statusLower.includes('delivered')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  }
}
