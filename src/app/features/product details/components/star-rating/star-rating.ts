import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRatingComponent {
  @Input({ required: true }) rating!: number;
  @Input() reviewCount?: number;

  get stars(): ('full' | 'half' | 'empty')[] {
    return Array.from({ length: 5 }, (_, i) => {
      const pos = i + 1;
      if (this.rating >= pos) return 'full';
      if (this.rating >= pos - 0.5) return 'half';
      return 'empty';
    });
  }
}
