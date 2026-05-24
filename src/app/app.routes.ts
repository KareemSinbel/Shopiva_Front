import { Routes } from '@angular/router';
import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';
import { ForgetPassword } from './features/auth/components/forget-password/forget-password';
import { OtpForm } from './features/auth/components/otp-form/otp-form';
import { Unauthorized } from './features/auth/components/unauthorized/unauthorized';

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: Login, pathMatch: "full" },
  { path: "register", component: Register, pathMatch: "full" },
  { path: "forget-password", component: ForgetPassword, pathMatch: "full" },
  { path: "otp-confirmation", component: OtpForm, pathMatch: "full" },
  { path: "unauthorized", component: Unauthorized, pathMatch: "full" },

];


//? if we need to add page has authaurization for specific role we will add it like this :
//
// import { authGuard } from './core/guards/auth-guard';
// import { roleGuard } from './core/guards/role-guard';
//
// { path: 'seller/dashboard',
//    loadComponent: () => import('./features/seller/pages/dashboard/dashboard').then(c => c.Dashboard)

//    , canActivate: [authGuard, roleGuard], put these two guards

//     data: { roles: ['Seller'] } must pass role
//   },
