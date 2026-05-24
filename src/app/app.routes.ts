import { Routes } from '@angular/router';
import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';
import { ForgetPassword } from './features/auth/components/forget-password/forget-password';
import { OtpForm } from './features/auth/components/otp-form/otp-form';

export const routes: Routes = [

  { path: "login", component: Login, pathMatch: "full" },
  { path: "register", component: Register, pathMatch: "full" },
  { path: "forget-password", component: ForgetPassword, pathMatch: "full" },
  { path: "otp-confirmation", component: OtpForm, pathMatch: "full" },

];
