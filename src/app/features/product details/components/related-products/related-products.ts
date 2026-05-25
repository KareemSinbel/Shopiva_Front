import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../products/models/product';
import { ProductService } from '../../../../core/services/product-service';


@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './related-products.html',
  styleUrl: './related-products.css'
})
export class RelatedProductsComponent implements OnInit {
  @Input({ required: true }) productId!: number;

  private productService = inject(ProductService); // TODO: uncomment

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRelated();
  }

  private loadRelated(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getFeaturedProducts().subscribe({
      next: (data) => {
        // Filter out the current product from related
        this.products.set(data.filter(p => p.id !== this.productId).slice(0, 4));
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Could not load related products.');
        this.isLoading.set(false);
      },
    });
  }

  scrollLeft(): void {
    // TODO: implement carousel scroll or integrate a carousel library
    console.log('scroll left');
  }

  scrollRight(): void {
    // TODO: implement carousel scroll or integrate a carousel library
    console.log('scroll right');
  }

  navigateToProduct(id: number): void {
    // TODO: inject Router and navigate to product detail route
    // this.router.navigate(['/product', id]);
    console.log('navigate to product:', id);
  }
}
