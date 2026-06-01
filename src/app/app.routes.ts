import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';
import { ForgetPassword } from './features/auth/components/forget-password/forget-password';
import { OtpForm } from './features/auth/components/otp-form/otp-form';
import { Unauthorized } from './features/auth/components/unauthorized/unauthorized';
import { Home } from './features/home/components/home/home';
import { MainLayout } from './layout/main-layout/main-layout';
import { SellerLayout } from './layout/seller-layout/seller-layout';
import { SellerDashboard } from './features/seller-dashboard/seller-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { SellerInventory } from './features/seller-inventory/seller-inventory';
import { SellerOrder } from './features/seller-order/seller-order';
import { SellerAnalytics } from './features/seller-analytics/seller-analytics';
import { ProductForm } from './features/seller-dashboard/components/product-form/product-form';
import { ProductDetailComponent } from './features/product details/components/product-details/product-details';
import { ProductList } from './features/product-list/product-list';
import { Payment } from './features/payment/pages/payment/payment';
import { Cart } from './features/cart/components/cart/cart';

export const routes: Routes = [
  {
    path: "",
    component: MainLayout,
    children:
      [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: "home", component: Home, pathMatch: "full" },
        { path: "product/:id", component: ProductDetailComponent, pathMatch: "full" },
        { path: "productlist", component: ProductList, pathMatch: "full" },
        { path: "cart", component: Cart, pathMatch: "full" },
      ]
  },
  { path: "login", component: Login, pathMatch: "full" },
  { path: "register", component: Register, pathMatch: "full" },
  { path: "forget-password", component: ForgetPassword, pathMatch: "full" },
  { path: "otp-confirmation", component: OtpForm, pathMatch: "full" },
  { path: "unauthorized", component: Unauthorized, pathMatch: "full" },
  { path: 'payment', component: Payment, pathMatch: "full" },


  {
    path: "seller",
    component: SellerLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: "dashboard", component: SellerDashboard, canActivate: [authGuard, roleGuard], data: { roles: ['Seller'] }, pathMatch: "full" },
      { path: "inventory", component: SellerInventory, canActivate: [authGuard, roleGuard], data: { roles: ['Seller'] }, pathMatch: "full" },
      { path: "orders", component: SellerOrder, canActivate: [authGuard, roleGuard], data: { roles: ['Seller'] }, pathMatch: "full" },
      { path: "analytics", component: SellerAnalytics, canActivate: [authGuard, roleGuard], data: { roles: ['Seller'] }, pathMatch: "full" },
      { path: "add-product", component: ProductForm, pathMatch: "full" },
      { path: "edit-product/:id", component: ProductForm, pathMatch: "full" },
    ]
  },

  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  { path: '**', redirectTo: 'home' }
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
