import { Component, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {

  isSended: WritableSignal<boolean> = signal(false);

  constructor(private _authService: AuthService , private _router: Router) { }

  forgetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });



  SendEmailWithOtp() {

    if (this.forgetPasswordForm.valid ) {

      const email = this.forgetPasswordForm.value.email!;
      this._authService.forgetPassword(email).subscribe({
        next: (response) => {
          this.isSended.set(true);
          this._authService.setEmail(email);
          this._authService.setOtpFlow('reset-password');
          this._router.navigate(['/otp-confirmation']);
        },
        error: (error) => {
          this.isSended.set(false);
          console.error('Error sending password reset email:', error);
        }
      }
      );

    } else {
      this.forgetPasswordForm.markAllAsTouched();
    }
  }
}
