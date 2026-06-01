import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  inject,
  signal,
  computed,
  viewChild,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { ApiConfig } from '../../../../core/services/api-config';
import { CartService } from '../../../../core/services/cart-service';
import { CheckoutSteps } from '../../../cart/components/checkout-steps/checkout-steps';
import { Footer } from '../../../../shared/components/footer/footer';
import { CartItemModel, OrderSummaryModel } from '../../../cart/models/cart-model';
import { API_ENDPOINTS } from '../../../../core/constants/api-endpoints';


const TAX_RATE = 0.08;

interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number; // in cents
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, CheckoutSteps, Footer],
  templateUrl: './payment.html',
})


export class Payment implements OnInit, AfterViewInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiConfig = inject(ApiConfig);
  private readonly cartService = inject(CartService);
  private readonly destroy$ = new Subject<void>();

  // Stripe card mount point
  readonly cardElementRef = viewChild<ElementRef>('cardElement');

  // Stripe instances
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  // ── Signals ────────────────────────────────────────────────────────────
  readonly cartItems = signal<CartItemModel[]>([]);
  readonly cartLoading = signal(false);
  readonly cartError = signal<string | null>(null);
  readonly discountAmount = signal(0);
  readonly cartId = signal<string | null>(null);

  readonly selectedMethod = signal<'card' | 'paypal' | 'applepay'>('card');
  readonly isProcessing = signal(false);
  readonly paymentSuccess = signal(false);
  readonly errorMessage = signal('');

  readonly summary = computed<OrderSummaryModel>(() => {
    const subtotal = this.cartItems().reduce((sum, item) => {
      const unitPrice = item.product.discountPrice ?? item.product.price;
      return sum + unitPrice * item.quantity;
    }, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const discount = this.discountAmount();
    const shipping = 0; // set to null if unknown until checkout
    return {
      subtotal,
      shipping,
      tax,
      discount,
      total: Math.round((subtotal + tax + shipping - discount) * 100) / 100,
    };
  });

  readonly canPay = computed(() =>
    this.cartItems().length > 0 &&
    (this.selectedMethod() !== 'card' || this.cardholderName.trim().length > 0)
  );
  // ────────────────────────────────────────────────────────────────────────

  // Non-signal form fields (simple two-way binding is fine here)
  cardholderName = '';
  saveCard = false;

  // Expose TAX_RATE to template
  readonly TAX_RATE = TAX_RATE;

  readonly paymentMethods = [
    { key: 'card'     as const, label: 'Credit Card', icon: 'credit_card' },
    { key: 'paypal'   as const, label: 'PayPal',       icon: 'account_balance_wallet' },
    { key: 'applepay' as const, label: 'Apple Pay',    icon: 'phone_iphone' },
  ];

  readonly securityBadges = [
    { icon: 'security',      label: 'SSL Encrypted' },
    { icon: 'verified_user', label: 'PCI Compliant' },
    { icon: 'shield',        label: 'Fraud Protected' },
  ];

  async ngOnInit(): Promise<void> {
    this.loadCart();
    this.stripe = await loadStripe(this.apiConfig.stripePublishableKey);
  }

  ngAfterViewInit(): void {
    this.mountCard();
  }

  private loadCart(): void {
    this.cartLoading.set(true);
    this.cartError.set(null);

    this.cartService.getCart().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.cartItems.set(data.items);
        this.discountAmount.set(data.discountAmount ?? 0);
        this.cartId.set(data.id);
        this.cartLoading.set(false);
      },
      error: () => {
        this.cartError.set('Could not load cart items. Please go back and try again.');
        this.cartLoading.set(false);
      },
    });
  }

  private mountCard(): void {
    if (!this.stripe || !this.cardElementRef()?.nativeElement) return;

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontFamily: '"Inter", sans-serif',
          fontSize: '16px',
          color: '#191c1e',
          '::placeholder': { color: '#737688' },
        },
        invalid: { color: '#ba1a1a' },
      },
      hidePostalCode: true,
    });
    this.cardElement.mount(this.cardElementRef()!.nativeElement);
  }

  selectMethod(method: 'card' | 'paypal' | 'applepay'): void {
    this.selectedMethod.set(method);
    this.errorMessage.set('');

    // Re-mount Stripe card element after view updates
    if (method === 'card') {
      setTimeout(() => this.mountCard(), 0);
    }
  }

  async pay(): Promise<void> {
    if (!this.canPay()) return;
    this.isProcessing.set(true);
    this.errorMessage.set('');

    const amountInCents = Math.round(this.summary().total * 100);

    // 1. Get client secret from backend
    this.http
      .post<CreatePaymentIntentResponse>(
        `${this.apiConfig.baseUrl}${API_ENDPOINTS.payment.createIntent}`,
        { orderId: this.cartId()!, amount: amountInCents } satisfies CreatePaymentIntentRequest
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (res) => {
          await this.confirmPayment(res.clientSecret);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message ?? 'Could not initiate payment. Please try again.');
          this.isProcessing.set(false);
        },
      });
  }

  private async confirmPayment(clientSecret: string): Promise<void> {
    if (!this.stripe || !this.cardElement) return;

    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.cardElement,
        billing_details: { name: this.cardholderName },
      },
    });

    if (result.error) {
      this.errorMessage.set(result.error.message ?? 'Payment failed. Please try again.');
      this.isProcessing.set(false);
    } else if (result.paymentIntent?.status === 'succeeded') {
      this.paymentSuccess.set(true);
      this.isProcessing.set(false);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.cardElement?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
