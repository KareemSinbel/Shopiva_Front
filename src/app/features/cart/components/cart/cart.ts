import { Component, computed, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CheckoutSteps } from '../checkout-steps/checkout-steps';
import { CartItem } from '../cart-item/cart-item';
import { OrderSummary } from '../order-summary/order-summary';
import { CartService } from '../../../../core/services/cart-service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartItemModel, OrderSummaryModel } from '../../models/cart-model';

const TAX_RATE = 0.0807;

@Component({
  selector: 'app-cart',
  imports: [CheckoutSteps, CartItem,OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit, OnDestroy {

  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // Reference to child for calling setPromoResult
  readonly orderSummaryRef = viewChild<OrderSummary>('orderSummaryRef');

  // ── Signals ────────────────────────────────────────────────────────────
  readonly cartItems = signal<CartItemModel[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly updatingItemId = signal<number | null>(null);
  readonly discountAmount = signal(0);

  // Dummy signals passed to child to avoid creating new signal instances inline
  readonly loadingSignal = signal(true);
  readonly falseSignal = signal(false);

  readonly orderSummary = computed<OrderSummaryModel>(() => {
    const subtotal = this.cartItems().reduce((sum, item) => {
      const unitPrice = item.product.discountPrice ?? item.product.price;
      return sum + unitPrice * item.quantity;
    }, 0);
    const tax = subtotal * TAX_RATE;
    const discount = this.discountAmount();
    return {
      subtotal,
      shipping: null,
      tax: Math.round(tax * 100) / 100,
      discount,
      total: Math.round((subtotal + tax - discount) * 100) / 100,
    };
  });
  // ────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.cartService.getCart().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.cartItems.set(data.items);
        this.discountAmount.set(data.discountAmount ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load your cart. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  onQuantityChanged(productId: number, quantity: number, cartItemId: number): void {
    this.updatingItemId.set(productId);

    this.cartService.updateItemQuantity(productId, quantity, cartItemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cartItems.set(data.items);
          this.discountAmount.set(data.discountAmount ?? 0);
          this.updatingItemId.set(null);
        },
        error: () => {
          // Revert optimistic update on fail — reload cart
          this.updatingItemId.set(null);
          this.loadCart();
        },
      });
  }

  onRemoveItem(cartItemId: number): void {
    // Optimistic removal
    this.cartItems.update(items => items.filter(i => i.id !== cartItemId));

    this.cartService.removeItem(cartItemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({error:() => this.loadCart()});
  }

  // onPromoApplied(code: string): void {
  //   this.cartService.applyPromoCode(code)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (data) => {
  //         this.cartItems.set(data.items);
  //         this.discountAmount.set(data.discountAmount ?? 0);
  //         this.orderSummaryRef()?.setPromoResult(true);
  //       },
  //       error: () => {
  //         this.orderSummaryRef()?.setPromoResult(false, 'Invalid or expired promo code.');
  //       },
  //     });
  // }

  onCheckout(): void {
    // TODO: navigate to shipping step
    this.router.navigate(['/payment']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
