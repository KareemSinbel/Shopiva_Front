import { Component, Input, signal, computed } from '@angular/core';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.css',
})
export class ImageGalleryComponent {
  @Input({ required: true }) images!: string[];
  @Input() altPrefix = 'Product';

  readonly activeIndex = signal(0);
  readonly activeImage = computed(() => this.images[this.activeIndex()]);

  selectImage(index: number): void {
    this.activeIndex.set(index);
  }
}
