import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { GradientButton } from "../../../../shared/components/gradient-button/gradient-button";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass, RouterLink, GradientButton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  errorMessage: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  returnUrl: string = '/';



  constructor(private _authService: AuthService, private _router: Router, private route:ActivatedRoute)
  {
    if (this._authService.isLoggedIn()) {
      this._router.navigate(['/']);
    }
  }


  loginForm: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

  });

  submitForm(): void {

    if (this.loginForm.valid) {

      this.isLoading.set(true);

      this._authService.login(this.loginForm.value).subscribe({

        next: (response) => {

          this.isLoading.set(false);

          const isSessionSaved = this._authService.setSession(response);

          if (!isSessionSaved) {

            this.errorMessage.set('Login response did not include a valid token');
            return;
          }

          const role = this._authService.getUserRole();

          if (role === 'Admin') {

            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';

          } else if (role === 'Seller') {

            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/seller/dashboard';

          } else {

            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          }

          this._router.navigateByUrl(this.returnUrl);
        },

        error: (error) => {

          this.isLoading.set(false);

          this.errorMessage.set(
            error?.error?.errors?.description ||
            'Something went wrong'
          );
        }
      });

    } else {

      this.loginForm.markAllAsTouched();
    }
  }

  onSignUpClick()
  {
    this._router.navigate(['/register']);
  }

}

