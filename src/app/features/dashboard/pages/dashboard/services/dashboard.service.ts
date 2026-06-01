import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environments';

// ── Interfaces ──
export interface StoreOverview {
  totalRevenue: number;
  revenueGrowthPercent: number;
  totalOrders: number;
  ordersGrowthPercent: number;
  newCustomers: number;
  customersGrowthPercent: number;
  conversionRate: number;
  conversionRateStatus: string;
}

export interface RecentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  profileImageUrl: string | null;
  joinedAt: string;
}

export interface RecentUsersResponse {
  totalCount: number;
  users: RecentUser[];
}

export interface PromoCode {
  id: number;
  code: string;
  description: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt: string | null;
  expiryStatus: string;
  createdAt: string;
}

export interface Banner {
  id: number;
  title: string;
  subTitle: string | null;
  imageUrl: string;
  isLive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api = environment.api.baseUrl;

  constructor(private http: HttpClient) {}

  getOverview(): Observable<StoreOverview> {
    return this.http.get<StoreOverview>(`${this.api}/Dashboard/overview`);
  }

  getRecentUsers(count: number = 10): Observable<RecentUsersResponse> {
    return this.http.get<RecentUsersResponse>(`${this.api}/Dashboard/recent-users?count=${count}`);
  }

  getPromoCodes(): Observable<PromoCode[]> {
    return this.http.get<PromoCode[]>(`${this.api}/Dashboard/promo-codes`);
  }

  getLiveBanner(): Observable<Banner> {
    return this.http.get<Banner>(`${this.api}/Dashboard/banners/live`);
  }
}
