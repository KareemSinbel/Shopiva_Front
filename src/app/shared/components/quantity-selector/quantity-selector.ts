import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [],
  templateUrl: './quantity-selector.html',
  styleUrl: './quantity-selector.css'
})
export class QuantitySelectorComponent {
  @Input() min = 1;
  @Input() max = 99;
  @Output() quantityChange = new EventEmitter<number>();

  readonly quantity = signal(1);

  increment(): void {
    if (this.quantity() < this.max) {
      this.quantity.update(q => q + 1);
      this.quantityChange.emit(this.quantity());
    }
  }

  decrement(): void {
    if (this.quantity() > this.min) {
      this.quantity.update(q => q - 1);
      this.quantityChange.emit(this.quantity());
    }
  }
}
