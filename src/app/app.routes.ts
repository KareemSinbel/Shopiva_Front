import { Routes } from '@angular/router';
import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';
import { ForgetPassword } from './features/auth/components/forget-password/forget-password';
import { OtpForm } from './features/auth/components/otp-form/otp-form';
import { Home } from './features/home/components/home/home';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: "",
    component: MainLayout,
    children:
    [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: "home", component: Home, pathMatch: "full"},
    ]
  },
  { path: "login", component: Login, pathMatch: "full" },
  { path: "register", component: Register, pathMatch: "full" },
  { path: "forget-password", component: ForgetPassword, pathMatch: "full" },
  { path: "otp-confirmation", component: OtpForm, pathMatch: "full" },
  { path: '**', redirectTo: 'home' }
];
