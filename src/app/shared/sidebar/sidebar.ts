import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  navLinks = [
    { label: 'Dashboard',         icon: 'dashboard',        route: '/admin/dashboard' },
    { label: 'User Management',   icon: 'person_outline',   route: '/admin/users' },
    // { label: 'Product Management',icon: 'inventory_2',      route: 'admin/products' },
    // { label: 'Orders Management', icon: 'shopping_bag',     route: 'admin/orders' },
    // { label: 'Banner Management', icon: 'view_carousel',    route: 'admin/banners' },
    // { label: 'Analytics',         icon: 'analytics',        route: 'admin/analytics' },
    // { label: 'Settings',          icon: 'settings',         route: '/settings' },
  ];
}
