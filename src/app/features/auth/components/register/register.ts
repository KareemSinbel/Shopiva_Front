import { Component, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  errorMessage: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  constructor(private _authService: AuthService, private _router: Router) { }

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),

  }, { validators: this.checkConfirmPassword });



  checkConfirmPassword(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return ({ mismatch: true });
    } else {
      return null;
    }

  }


  submitForm() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this._authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading.set(false);

          localStorage.setItem('token', JSON.stringify(response.token));
          localStorage.setItem("refreshToken", JSON.stringify(response.refreshToken));
          this._authService.setEmail(this.registerForm.value.email);
          this._authService.setOtpFlow('confirm-email');

          this._router.navigate(['/otp-confirmation']);


        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error.errors.description);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }




}
