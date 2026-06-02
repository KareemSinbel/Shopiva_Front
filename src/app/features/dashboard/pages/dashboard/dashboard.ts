import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Footer } from "../../../../shared/components/footer/footer";

const API = 'https://localhost:7259/api';

interface StoreOverview {
  totalRevenue: number;
  revenueGrowthPercent: number;
  totalOrders: number;
  ordersGrowthPercent: number;
  newCustomers: number;
  customersGrowthPercent: number;
  conversionRate: number;
  conversionRateStatus: string;
}

interface RecentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  profileImageUrl: string | null;
  joinedAt: string;
}

interface PromoCode {
  id: number;
  code: string;
  description: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt: string | null;
  expiryStatus: string;
}

interface Banner {
  id: number;
  title: string;
  subTitle: string | null;
  imageUrl: string;
  isLive: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  overview: StoreOverview | null = null;
  users: RecentUser[] = [];
  promoCodes: PromoCode[] = [];
  liveBanner: Banner | null = null;

  isLoadingOverview = signal<boolean>(true);
  isLoadingUsers    = signal<boolean>(true);
  isLoadingPromos   = signal<boolean>(true);
  isLoadingBanner   = signal<boolean>(true);

  // ── Promo Modal ──
  showPromoModal = false;
  promoForm = { code: '', description: '', discountPercent: 0, expiresAt: '' };
  isSavingPromo = false;

  // ── Confirm User ──
  confirmingUserId: string | null = null;

  get stats() {
    if (!this.overview) return [];
    return [
      {
        icon: 'payments', label: 'Total Revenue',
        value: '$' + this.overview.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        badge: (this.overview.revenueGrowthPercent > 0 ? '+' : '') + this.overview.revenueGrowthPercent + '%',
        badgeType: 'secondary', iconBg: 'icon-bg-primary',
      },
      {
        icon: 'shopping_cart_checkout', label: 'Total Orders',
        value: this.overview.totalOrders.toLocaleString('en-US'),
        badge: (this.overview.ordersGrowthPercent > 0 ? '+' : '') + this.overview.ordersGrowthPercent + '%',
        badgeType: 'tertiary', iconBg: 'icon-bg-tertiary',
      },
      {
        icon: 'group', label: 'New Customers',
        value: this.overview.newCustomers.toLocaleString('en-US'),
        badge: (this.overview.customersGrowthPercent > 0 ? '+' : '') + this.overview.customersGrowthPercent + '%',
        badgeType: 'secondary', iconBg: 'icon-bg-secondary',
      },
      {
        icon: 'trending_up', label: 'Conversion Rate',
        value: this.overview.conversionRate + '%',
        badge: this.overview.conversionRateStatus,
        badgeType: 'error', iconBg: 'icon-bg-error',
      },
    ];
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOverview();
    this.loadRecentUsers();
    this.loadPromoCodes();
    this.loadLiveBanner();
  }

  loadOverview() {
    this.http.get<StoreOverview>(`${API}/Dashboard/overview`).subscribe({
      next: (d) => { this.overview = d; this.isLoadingOverview.set(false); },
      error: ()  => { this.isLoadingOverview.set(false); }
    });
  }

  loadRecentUsers() {
    this.http.get<{ users: RecentUser[] }>(`${API}/Dashboard/recent-users`).subscribe({
      next: (d) => { this.users = d.users; this.isLoadingUsers.set(false); },
      error: ()  => { this.isLoadingUsers.set(false); }
    });
  }

  loadPromoCodes() {
    this.http.get<PromoCode[]>(`${API}/Dashboard/promo-codes`).subscribe({
      next: (d) => { this.promoCodes = d; this.isLoadingPromos.set(false); },
      error: ()  => { this.isLoadingPromos.set(false); }
    });
  }

  loadLiveBanner() {
    this.http.get<Banner>(`${API}/Dashboard/banners/live`).subscribe({
      next: (d) => { this.liveBanner = d; this.isLoadingBanner.set(false); },
      error: ()  => { this.isLoadingBanner.set(false) ; }
    });
  }

  // ── Promo Modal ──
  openPromoModal() { this.showPromoModal = true; }
  closePromoModal() {
    this.showPromoModal = false;
    this.promoForm = { code: '', description: '', discountPercent: 0, expiresAt: '' };
  }

  savePromo() {
    if (!this.promoForm.code || !this.promoForm.description) return;
    this.isSavingPromo = true;

    const body = {
      code: this.promoForm.code,
      description: this.promoForm.description,
      discountPercent: this.promoForm.discountPercent,
      expiresAt: this.promoForm.expiresAt || null
    };

    this.http.post<PromoCode>(`${API}/Dashboard/promo-codes`, body).subscribe({
      next: (newPromo) => {
        this.promoCodes.unshift(newPromo);
        this.isSavingPromo = false;
        this.closePromoModal();
      },
      error: () => { this.isSavingPromo = false; }
    });
  }

  // ── Confirm User ──
  confirmUser(userId: string) {
    this.confirmingUserId = userId;
    this.http.put(`${API}/Dashboard/users/${userId}/confirm`, {}).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) user.status = 'Active';
        this.confirmingUserId = null;
      },
      error: () => { this.confirmingUserId = null; }
    });
  }

  getStatusType(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':  return 'active';
      case 'pending': return 'pending';
      case 'premium': return 'premium';
      default:        return 'pending';
    }
  }

  getPromoStatusType(expiryStatus: string): string {
    return expiryStatus.toLowerCase() === 'expired' ? 'expired' : 'active';
  }
}
