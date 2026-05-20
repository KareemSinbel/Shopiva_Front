import { Routes } from '@angular/router';
import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';

export const routes: Routes = [
  {path:"login",component:Login , pathMatch:"full"},
  {path:"register",component:Register , pathMatch:"full"},

];
