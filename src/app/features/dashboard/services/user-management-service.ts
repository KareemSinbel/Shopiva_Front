import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../../core/services/api-config';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { UserApiResponse, UserInsights } from '../models/user';


@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfig);

  getUsers(page: number, pageSize: number, search = ''): Observable<UserApiResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search.trim()) params = params.set('search', search.trim());

    return this.http.get<UserApiResponse>(
      `${this.apiConfig.baseUrl}${API_ENDPOINTS.admin.users.getAll}`,
      { params }
    );
  }

  restrictUser(userId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiConfig.baseUrl}${API_ENDPOINTS.admin.users.restrict(userId)}`,
      { restrict: true }
    );
  }

  unrestrictUser(userId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiConfig.baseUrl}${API_ENDPOINTS.admin.users.restrict(userId)}`,
      { restrict: false }
    );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiConfig.baseUrl}${API_ENDPOINTS.admin.users.delete(userId)}`
    );
  }
}
