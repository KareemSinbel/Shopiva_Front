import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

const API = 'https://localhost:7259/api';
const PUBLISHABLE_KEY = 'pk_test_51TdTRtLynZtEcTLPfC2YfcFyq7H4NOi0m1KJgJ5kdqTigyXKyN9Xh0U5u9H4nNImTY9ehwbfCgAi6OWXeJNiwJ4200ScvS3oM0';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl:    './payment.css',
})
export class Payment implements OnInit, OnDestroy {

  @ViewChild('cardElement') cardElementRef!: ElementRef;

  // Stripe
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  // State
  selectedMethod: 'card' | 'paypal' | 'applepay' = 'card';
  cardholderName = '';
  saveCard = false;
  isProcessing = false;
  paymentSuccess = false;
  errorMessage = '';

  // Order (mock - replace with real cart data)
  orderItems = [
    {
      name: 'Luxe Chronos V2',
      variant: 'Onyx Black / 44mm',
      price: 1299.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwdWu9x6z1KIS6grmAzaru9EsDvcWuqS84Z-aNkiNhtKGqAzzTo-4gG27brGFKHV85FF3Q8hpqpbAPyUuiL-3hYMoRcv7OOTcMz2kI70WiEJeaqQ01chC_PewlqAIX4wLpHAyf60HbOxXapIBNwW03h300ZtmcK-Qm-a6gwB2vVKR5ZIogA1QLAMOr980s0ohqDzQB8uo7wFKJyg84rQptCNjCJNWptyLuvbljSoeo3xOBl5kzZqq2uerbDLYozCPfyZApakafYso'
    },
    {
      name: 'Spatial Audio Max',
      variant: 'Signature White',
      price: 549.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXJg-CoYo9nRBw7xu-jK9-BvtGiCAfH5KBUxNe8K4mPlF1i_1-189b2iaOYjIrv7Q9BLQ0xR1LXt834qLN00To7NCK0s8tDKAwjAfbpgRJ5nFL-4jkuKjX_dU0S6Qt_qJWWdf-F02UbJDzBybsTyeiYxbHwWyyK27SIkjTY7RvIZ621UVpIMlpiItmA8ixwwbtfYfPYNnp8Oftezu0kufKm6Xr8tv7Aj6QH2jzt6AH0EghRk-pjsLDSTqKYsVt5yyc17FU2ZaLj3w'
    }
  ];

  get subtotal()  { return this.orderItems.reduce((s, i) => s + i.price, 0); }
  get taxes()     { return Math.round(this.subtotal * 0.08 * 100) / 100; }
  get total()     { return this.subtotal + this.taxes; }

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    this.stripe = await loadStripe(PUBLISHABLE_KEY);
  }

  ngAfterViewInit() {
    this.mountCard();
  }

  mountCard() {
    if (!this.stripe) return;
    this.elements   = this.stripe.elements();
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
    this.cardElement.mount(this.cardElementRef.nativeElement);
  }

  selectMethod(method: 'card' | 'paypal' | 'applepay') {
    this.selectedMethod = method;
  }

  async pay() {
    if (!this.stripe || !this.cardElement || !this.cardholderName) return;
    this.isProcessing = true;
    this.errorMessage = '';

    // 1. Get client secret from backend
    this.http.post<{ clientSecret: string }>(`${API}/Payment/create-intent`, {
      orderId: 1,
      amount: this.total
    }).subscribe({
      next: async (res) => {
        // 2. Confirm payment with Stripe
        const result = await this.stripe!.confirmCardPayment(res.clientSecret, {
          payment_method: {
            card: this.cardElement!,
            billing_details: { name: this.cardholderName }
          }
        });

        if (result.error) {
          this.errorMessage = result.error.message || 'Payment failed';
          this.isProcessing = false;
        } else if (result.paymentIntent?.status === 'succeeded') {
          this.paymentSuccess = true;
          this.isProcessing   = false;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.isProcessing = false;
      }
    });
  }

  ngOnDestroy() {
    this.cardElement?.destroy();
  }
}
