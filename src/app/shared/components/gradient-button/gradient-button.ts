import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gradient-button',
  imports: [],
  templateUrl: './gradient-button.html',
  styleUrl: './gradient-button.css',
})
export class GradientButton {
  @Input() btnText: string = 'Button';
  @Input() isDisabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() btnClass: string = '';
  @Input() isHoverAnimated: boolean = true;
  @Output() click = new EventEmitter<void>();

  onClick() {
    if (!this.isDisabled) {
      this.click.emit();
    }
  }
}
