import { Component, signal } from '@angular/core';
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
    { label: 'Dashboard',         icon: 'dashboard',        route: '/dashboard' },
    { label: 'User Management',   icon: 'person_outline',   route: '/users' },
    { label: 'Product Management',icon: 'inventory_2',      route: '/products' },
    { label: 'Orders Management', icon: 'shopping_bag',     route: '/orders' },
    { label: 'Banner Management', icon: 'view_carousel',    route: '/banners' },
    { label: 'Analytics',         icon: 'analytics',        route: '/analytics' },
    { label: 'Settings',          icon: 'settings',         route: '/settings' },
  ];
}
