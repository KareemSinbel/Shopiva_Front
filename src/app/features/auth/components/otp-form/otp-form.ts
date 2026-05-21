import { AfterViewInit, Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-form',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './otp-form.html',
  styleUrl: './otp-form.css',
})
export class OtpForm implements OnInit, AfterViewInit, OnDestroy {

  expirationTime = 10 * 60;
  formattedTime: WritableSignal<string> = signal('10:00');
  isResetMode: boolean = false;
  private intervalId: any;




  constructor(private _authService: AuthService, private _router: Router) { }


  otpForm: FormGroup = new FormGroup({
    otp1: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp2: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp3: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp4: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp5: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp6: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
  });



  ngOnInit(): void {
    this.isResetMode = this._authService.getOtpFlow() === 'reset-password';

    if (this.isResetMode) {
      this.otpForm.addControl(
        'newPassword',
        new FormControl('', [Validators.required, Validators.minLength(8)])
      );
    }
  }

  ngAfterViewInit(): void {
    this.startCountdown();
    this.setupAutoFocus();
  }

  get otp(): string {
    const v = this.otpForm.value;
    return `${v.otp1}${v.otp2}${v.otp3}${v.otp4}${v.otp5}${v.otp6}`;

  }


  verifyOtp(): void {
    const email = this._authService.getEmail();
    if (!email) return;

    const otp = this.otp;

    if (this.isResetMode) {
      this._authService.setOtp(otp);
      this._authService.ResetPassword(email, otp, this.otpForm.value.newPassword).subscribe({
        next: (res) => {
          this._router.navigate(['/login']);
        },
        error: (err) => console.error('Error resetting password:', err),
      });
    } else {
      this._authService.confirmEmailOtp(email, otp).subscribe({
        next: (res) => {
          this._router.navigate(['/login']);
        },
        error: (err) => console.error('Error verifying OTP:', err),
      });
    }
  }
  setupAutoFocus(): void {
    const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          inputs[index - 1].focus();
        }
      });
    });
  }

  startCountdown(): void {
    this.updateFormattedTime();
    this.intervalId = setInterval(() => {
      if (this.expirationTime > 0) {
        this.expirationTime--;
        this.updateFormattedTime();
      } else {
        clearInterval(this.intervalId);
        this.formattedTime.set('00:00');
      }
    }, 1000);
  }

  updateFormattedTime(): void {
    const minutes = Math.floor(this.expirationTime / 60);
    const seconds = this.expirationTime % 60;
    this.formattedTime.set(`${this.padZero(minutes)}:${this.padZero(seconds)}`);
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
