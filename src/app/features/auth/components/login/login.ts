import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { ForgetPassword } from "../forget-password/forget-password";
import { GradientButton } from "../../../../shared/components/gradient-button/gradient-button";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass, RouterLink, ForgetPassword, GradientButton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  errorMessage: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);


  constructor(private _authService: AuthService, private _router: Router) { }


  loginForm: FormGroup = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),

  });

  submitForm() {


    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this._authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading.set(false);


          localStorage.setItem('token', JSON.stringify(response.token));
          localStorage.setItem("refreshToken", JSON.stringify(response.refreshToken));

        },
        error: (error) => {

          this.isLoading.set(false);
          this.errorMessage.set(error.error.errors.description);

        }
      });
    } else {
      this.isLoading.set(false);
      this.loginForm.markAllAsTouched();
    }
  }

  onSignUpClick()
  {
    this._router.navigate(['/register']);
  }

}
