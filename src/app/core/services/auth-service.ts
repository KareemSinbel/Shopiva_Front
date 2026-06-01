import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ILogin } from '../../features/auth/models/ILogin';
import { IRegister } from '../../features/auth/models/IRegister';

export type OtpFlow = 'confirm-email' | 'reset-password';

export interface JwtPayload {
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  exp?: number;
  role?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
}

export interface AuthResponse {
  token?: string;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = 'https://localhost:7259/api/Auth';
  private readonly emailStorageKey = 'authEmail';
  private readonly otpFlowStorageKey = 'authOtpFlow';

  private emailSubject = new BehaviorSubject<string>(sessionStorage.getItem(this.emailStorageKey) ?? '');
  private otpFlowSubject = new BehaviorSubject<OtpFlow>(this.getStoredOtpFlow());
  private otpSubject = new BehaviorSubject<string>('');

  currentUser = new BehaviorSubject<JwtPayload | null>(null);

  constructor(private _http: HttpClient) {
    this.saveUserData();
  }

  email$ = this.emailSubject.asObservable();
  otpFlow$ = this.otpFlowSubject.asObservable();


  setOtp(otp: string): void {
    this.otpSubject.next(otp);
  }

  getOtp(): string {
    return this.otpSubject.value;
  }

  clearOtp(): void {
    this.otpSubject.next('');
    this.emailSubject.next('');
    this.otpFlowSubject.next('confirm-email');
    sessionStorage.removeItem(this.emailStorageKey);
    sessionStorage.removeItem(this.otpFlowStorageKey);
  }


  setEmail(email: string): void {
    this.emailSubject.next(email);
    sessionStorage.setItem(this.emailStorageKey, email);
  }

  getEmail(): string {
    return this.emailSubject.value;
  }


  setOtpFlow(flow: OtpFlow): void {
    this.otpFlowSubject.next(flow);
    sessionStorage.setItem(this.otpFlowStorageKey, flow);
  }

  getOtpFlow(): OtpFlow {
    return this.otpFlowSubject.value;
  }


  login(formData: ILogin): Observable<any> {
    return this._http.post(`${this.baseUrl}/login`, formData);
  }

  register(formData: IRegister): Observable<any> {
    return this._http.post(`${this.baseUrl}/register`, formData);
  }

  setSession(response: AuthResponse): boolean {

    if (!response.token) {

      this.logout();
      return false;
    }

    localStorage.setItem('token', response.token);

    if (response.refreshToken) {

      localStorage.setItem('refreshToken', response.refreshToken);
    } else {

      localStorage.removeItem('refreshToken');
    }

    this.saveUserData();

    return !!this.currentUser.value;
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    this.currentUser.next(null);
  }

  saveUserData(): void {

    const decoded = this.getDecodedToken();
    this.currentUser.next(decoded);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser.value && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {

    const decoded = this.getDecodedToken();

    if (!decoded?.exp) return true;

    const isExpired = decoded.exp * 1000 <= Date.now();

    if (isExpired) {

      this.logout();
    }

    return isExpired;
  }

  getUserRole(): string | null {

    const user = this.currentUser.value;

    if (!user) return null;
    return user.role ?? user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
  }


  forgetPassword(email: string): Observable<any> {
    return this._http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  ResetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this._http.post(`${this.baseUrl}/reset-password`, {
      email,
      otp,
      newPassword
    });
  }

  sendEmailOtp(email: string): Observable<any> {
    return this._http.post(`${this.baseUrl}/send-email-otp`, { email });
  }

  confirmEmailOtp(email: string, otp: string): Observable<any> {
    return this._http.post(`${this.baseUrl}/confirm-email`, {
      email,
      otp
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getDecodedToken(): JwtPayload | null {
    const token = this.getToken();

    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      this.logout();
      return null;
    }
  }

  private getStoredOtpFlow(): OtpFlow {
    const flow = sessionStorage.getItem(this.otpFlowStorageKey);

    return flow === 'reset-password' ? 'reset-password' : 'confirm-email';
  }
}
