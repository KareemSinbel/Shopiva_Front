import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfig } from './api-config';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ChangePasswordDto, ProfileResponseDto, UpdateProfileDto } from '../../features/profile/profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  constructor(private http: HttpClient , private apiConfig: ApiConfig) {}

  getProfile(): Observable<ProfileResponseDto> {
    return this.http.get<ProfileResponseDto>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.profile.get}`).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  updateProfile(dto: UpdateProfileDto): Observable<ProfileResponseDto> {
    return this.http.patch<ProfileResponseDto>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.profile.update}`, dto).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  changePassword(dto: ChangePasswordDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.profile.changePassword}`, dto).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  updateProfileImage(formData: FormData): Observable<ProfileResponseDto> {
    return this.http.patch<ProfileResponseDto>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.profile.updateImage}`, formData).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  removeProfileImage(): Observable<ProfileResponseDto> {
    const formData = new FormData();
    formData.append('RemoveImage', 'true');
    return this.http.patch<ProfileResponseDto>(`${this.apiConfig.baseUrl}${API_ENDPOINTS.profile.removeImage}`, formData).pipe(
      catchError((err) => throwError(() => err))
    );
  }
}
