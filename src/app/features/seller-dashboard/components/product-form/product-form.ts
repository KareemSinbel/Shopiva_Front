import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GradientButton } from '../../../../shared/components/gradient-button/gradient-button';
import { SellerService } from '../../services/seller.service';
import { SellerProductSummaryDto } from '../../models/seller-dashboard.models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GradientButton],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  productForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    price: new FormControl('', [Validators.required, Validators.min(0.01)]),
    discountedPrice: new FormControl(''),
    stock: new FormControl('', [Validators.required, Validators.min(0)]),
    categoryId: new FormControl('', [Validators.required]),
  });

  isEditMode = false;
  productId: number | null = null;
  currentProduct: SellerProductSummaryDto | null = null;
  loading = false;
  error: string | null = null;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  existingImageUrls: string[] = [];
  removedImageIds: number[] = [];

  categories = signal<any[]>([]);
  categoriesLoading = signal(false);
  categoriesError = signal<string | null>(null);

  constructor(
    private sellerService: SellerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  private loadCategories(): void {
    this.categoriesLoading.set(true);
    this.categoriesError.set(null);

    this.sellerService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.categoriesLoading.set(false);
      },
      error: (err) => {
        this.categoriesError.set('Failed to load categories.');
        this.categoriesLoading.set(false);
        console.error(err);
      },
    });
  }
  private loadProduct(id: number): void {
    this.loading = true;
    this.error = null;

    this.sellerService.getProductById(id).subscribe({
      next: (product) => {
        this.currentProduct = product;
        this.existingImageUrls = product.imageUrls || [];
        this.populateForm(product);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product. Please try again.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onImageSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      Array.from(files).forEach((file) => {
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeNewImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  toggleRemoveExistingImage(imageUrl: string): void {
    const index = this.existingImageUrls.indexOf(imageUrl);
    if (index > -1) {
      // For simplicity, we're using the index as image ID
      // In a real app, backend should provide image IDs
      if (!this.removedImageIds.includes(index)) {
        this.removedImageIds.push(index);
      } else {
        this.removedImageIds.splice(this.removedImageIds.indexOf(index), 1);
      }
    }
  }

  isImageMarkedForRemoval(imageUrl: string): boolean {
    const index = this.existingImageUrls.indexOf(imageUrl);
    return this.removedImageIds.includes(index);
  }

  submitForm(): void {
    if (!this.productForm.valid) {
      this.error = 'Please fill all required fields correctly.';
      return;
    }

    if (!this.isEditMode && this.selectedFiles.length === 0) {
      this.error = 'Please select at least one image.';
      return;
    }

    this.loading = true;
    this.error = null;

    const formData = this.buildFormData();
    const request$ = this.isEditMode && this.productId
      ? this.sellerService.updateProduct(this.productId, formData)
      : this.sellerService.createProduct(formData);

    request$.subscribe({
      next: () => this.router.navigate(['/seller/inventory']),
      error: (err) => {
        this.error = this.isEditMode
          ? 'Failed to update product. Please try again.'
          : 'Failed to create product. Please try again.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();

    // Add form fields
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);

    if (this.productForm.value.discountedPrice) {
      formData.append('discountedPrice', this.productForm.value.discountedPrice);
    }

    formData.append('stock', this.productForm.value.stock);
    formData.append('categoryId', this.productForm.value.categoryId);

    // Add new images
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    // Add removed image IDs for edit mode
    if (this.isEditMode && this.removedImageIds.length > 0) {
      this.removedImageIds.forEach((id) => {
        formData.append('removeImageIds', id.toString());
      });
    }

    return formData;
  }

  private populateForm(product: SellerProductSummaryDto): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountedPrice: product.discountedPrice || '',
      stock: product.stock,
      categoryId: product.categoryId || '',
    });
  }

  cancel(): void {
    this.router.navigate(['/seller/inventory']);
  }
}
