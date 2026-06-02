import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../features/products/models/product';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart-service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private cartService = inject(CartService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  isCardActive = false;
  @Input({ required: true }) product!: Product;



  get badgeClass(): string {
    const map: Record<Product['badge'], string> = {
      TECH: 'bg-primary text-white',
      LIMITED: 'bg-secondary text-white',
      NEW: 'bg-tertiary-container text-on-tertiary-container',
      LUXURY: 'bg-surface-container-highest text-on-surface',
    };
    return map[this.product.badge];
  }



  addToCart(event: MouseEvent): void {
    //PREVENT CARD CLICK NAVIGATION
    event.stopPropagation();
    this.cartService.addToCart(this.product.id, 1, this.product.discountPrice ?? this.product.price).subscribe({
      next: () => {
        this.toastService.success(`${this.product.name} added to cart!`);
      },
      error: () => {
        this.toastService.error('Failed to add to cart. Please try again.');
      }
    });
  }

  onCardClick(): void {
    this.router.navigate(['/product', this.product.id]);
  }

  onButtonMouseDown(event: MouseEvent): void
  {
    // Prevents the card's mousedown from setting isCardActive = true, which would trigger the active scale effect
    event.stopPropagation(); // prevents card's mousedown from setting isCardActive = true
  }
}
