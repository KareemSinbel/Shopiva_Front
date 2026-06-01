import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CartItemModel } from '../../models/cart-model';

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
})

export class CartItem {
  @Input({ required: true }) item!: CartItemModel;
  @Input() isUpdating = signal(false);

  @Output() quantityChanged = new EventEmitter<number>();
  @Output() removed = new EventEmitter<void>();

  readonly quantity = signal(1);

  ngOnInit(): void {
    this.quantity.set(this.item.quantity);
  }

  changeQty(delta: number): void {
    const next = this.quantity() + delta;
    if (next < 1 || next > this.item.product.stock) return;
    this.quantity.set(next);
    this.quantityChanged.emit(next);
  }

  onRemove(): void {
    this.removed.emit();
  }
}
