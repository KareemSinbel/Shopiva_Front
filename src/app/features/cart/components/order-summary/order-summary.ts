import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderSummaryModel } from '../../models/cart-model';

@Component({
  selector: 'app-order-summary',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  @Input({ required: true }) summary!: OrderSummaryModel;
  @Input() itemCount = 0;

  @Output() checkout = new EventEmitter<void>();
  @Output() promoApplied = new EventEmitter<string>();

  promoInput = '';
  readonly isApplyingPromo = signal(false);
  readonly promoError = signal<string | null>(null);
  readonly promoSuccess = signal(false);

  applyPromo(): void {
    const code = this.promoInput.trim();
    if (!code) return;
    this.promoError.set(null);
    this.promoSuccess.set(false);
    this.isApplyingPromo.set(true);
    this.promoApplied.emit(code);
    // Parent calls promoApplied and updates summary; parent should call
    // setPromoResult(success, errorMsg) after the API responds.
  }

  /** Called by the parent after API responds to promo attempt */
  setPromoResult(success: boolean, errorMsg?: string): void {
    this.isApplyingPromo.set(false);
    if (success) {
      this.promoSuccess.set(true);
      this.promoInput = '';
    } else {
      this.promoError.set(errorMsg ?? 'Invalid promo code.');
    }
  }
}
