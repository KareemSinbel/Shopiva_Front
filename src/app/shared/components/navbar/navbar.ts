import { Component, HostListener, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private destroy$ = new Subject<void>();

  isDropdownOpen = false;
  readonly cartCount = signal(0);

  ngOnInit(): void {
    // الاستماع للتحديثات الفورية على عدد السلة
    this.cartService.cartCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.cartCount.set(count));

    // تحميل العدد الأولي
    this.loadCartCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCartCount(): void {
    this.cartService.getCart().pipe(takeUntil(this.destroy$)).subscribe({
      next: (cart) => {
        this.cartCount.set(cart.items.length);
      },
    });
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get user() {
    return this.auth.currentUser.value;
  }

  get userRole(): string | null {
    return this.auth.getUserRole();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.isDropdownOpen = false;
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu-wrapper')) {
      this.isDropdownOpen = false;
    }
  }
}
