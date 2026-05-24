import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type OtpFlow = 'confirm-email' | 'reset-password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private emailSubject = new BehaviorSubject<string>('');
  private otpFlowSubject = new BehaviorSubject<OtpFlow>('confirm-email');
  private otpSubject = new BehaviorSubject<string>('');

  constructor(private _http: HttpClient) { }

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
  }


  setEmail(email: string): void {
    this.emailSubject.next(email);
  }

  getEmail(): string {
    return this.emailSubject.value;
  }

  setOtpFlow(flow: OtpFlow): void {
    this.otpFlowSubject.next(flow);
  }

  getOtpFlow(): OtpFlow {
    return this.otpFlowSubject.value;
  }

  login(formData: ILogin): Observable<any> {
    return this._http.post('https://localhost:7259/api/Auth/login', formData);
  }

  register(formData: IRegister): Observable<any> {
    return this._http.post('https://localhost:7259/api/Auth/register', formData);
  }

  forgetPassword(email: string): Observable<any> {
    return this._http.post('https://localhost:7259/api/Auth/forgot-password', { email });
  }

  ResetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this._http.post('https://localhost:7259/api/Auth/reset-password', { email, otp, newPassword });
  }

  sendEmailOtp(email: string): Observable<any> {
    return this._http.post('https://localhost:7259/api/Auth/send-email-otp', { email });
  }

  confirmEmailOtp(email: string, otp: string): Observable<any> {
    return this._http.post('https://localhost:7259/api/Auth/confirm-email', { email, otp });
  }
}
