import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GradientButton } from '../../shared/components/gradient-button/gradient-button';
import { SellerService } from '../seller-dashboard/services/seller.service';
import { SellerDashboardDto } from '../seller-dashboard/models/seller-dashboard.models';

@Component({
  selector: 'app-seller-analytics',
  imports: [CommonModule, GradientButton],
  templateUrl: './seller-analytics.html',
  styleUrl: './seller-analytics.css',
})
export class SellerAnalytics implements OnInit {
  dashboardData = signal<SellerDashboardDto | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private sellerService: SellerService, private router: Router) { }

  ngOnInit(): void {
    this.loadAnalytics();
  }

  private loadAnalytics(): void {
    this.loading.set(true);
    this.error.set(null);

    this.sellerService
      .getDashboard()
      .then((data) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      })
      .catch((err) => {
        this.error.set('Failed to load analytics. Please try again.');
        this.loading.set(false);
        console.error(err);
      });
  }

  onAddProduct(): void {
    this.router.navigate(['/seller/add-product']);
  }
}
