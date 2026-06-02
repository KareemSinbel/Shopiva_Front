import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ImageGalleryComponent } from '../image-gallery/image-gallery';
import { StarRatingComponent } from '../star-rating/star-rating';
import { QuantitySelectorComponent } from '../../../../shared/components/quantity-selector/quantity-selector';
import { RelatedProductsComponent } from '../related-products/related-products';
import { ProductService } from '../../../../core/services/product-service';
import { Product } from '../../../products/models/product';
import { GradientButton } from "../../../../shared/components/gradient-button/gradient-button";
import { CartService } from '../../../../core/services/cart-service';
import { ProductReview } from '../product-review/product-review';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    ImageGalleryComponent,
    StarRatingComponent,
    QuantitySelectorComponent,
    RelatedProductsComponent,
    GradientButton,
    ProductReview
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private readonly destroy$ = new Subject<void>();


  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  private quantity = 1;

  readonly perks = [
    { icon: 'local_shipping', title: 'Free Shipping', subtitle: 'On all luxury orders' },
    { icon: 'verified_user', title: '2 Year Warranty', subtitle: 'Full coverage protection' },
  ];

  ngOnInit(): void {
    // TODO: get product ID from route params:
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.loadProduct(id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.product.set(null);

    this.productService.getProductById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load product. Please try again.');
        this.isLoading.set(false);
      },
    });
  }



  onQuantityChange(qty: number): void {
    this.quantity = qty;
  }

  addToCart(product: Product): void {
    const unitPrice = product.discountPrice ?? product.price;

    // First get current cart to check if item already exists
    this.cartService.getCart().pipe(takeUntil(this.destroy$)).subscribe({
      next: (cart) => {
        const existing = cart.items.find(i => i.product.id === product.id);

        if (existing) {
          // Item already in cart — update quantity instead of adding new row
          const newQty = existing.quantity + this.quantity;
          this.cartService.updateItemQuantity(product.id, newQty, existing.id).subscribe({
            next: () => console.log('Quantity updated:', newQty),
            error: () => console.error('Failed to update quantity'),
          });
        } else {
          // New item — add it
          this.cartService.addToCart(product.id, this.quantity, unitPrice).subscribe({
            next: () => console.log('Added to cart:', { productId: product.id, quantity: this.quantity }),
            error: () => console.error('Failed to add to cart'),
          });
        }
      },
      error: () => console.error('Failed to fetch cart'),
    });
  }
}
