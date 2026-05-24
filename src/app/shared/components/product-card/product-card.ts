import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../features/products/models/product';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private cartService = inject(CartService);
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



  addToCart(): void {
    // TODO: dispatch cart action or call CartService
    this.cartService.addToCart(this.product.id, 1, this.product.discountPrice ?? this.product.price).subscribe(() =>{
      console.log('Added successfully');
    });
  }
}
