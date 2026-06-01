import { Component, Input } from '@angular/core';
import { CheckoutStep, Step } from '../../models/cart-model';

@Component({
  selector: 'app-checkout-steps',
  imports: [],
  templateUrl: './checkout-steps.html',
  styleUrl: './checkout-steps.css',
})
export class CheckoutSteps {
  @Input({ required: true }) activeStep!: CheckoutStep;

  readonly steps: Step[] = [
    { key: 'cart',     label: 'Cart',     index: 1 },
    { key: 'shipping', label: 'Shipping', index: 2 },
    { key: 'payment',  label: 'Payment',  index: 3 },
  ];
}
