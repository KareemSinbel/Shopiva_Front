import { Component, Input, OnInit, signal } from '@angular/core';
import { CreateReviewDto, ProductReviewSummaryDto, ReviewResponseDto, UpdateReviewDto } from '../../Models/review.models';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../../../core/services/review-service';
import { AuthService } from '../../../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-review',
  imports: [CommonModule, ReactiveFormsModule , RouterLink],
  templateUrl: './product-review.html',
  styleUrl: './product-review.css',
})
export class ProductReview implements OnInit {
  @Input({ required: true }) productId!: number;

  summary = signal<ProductReviewSummaryDto | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  submitError = signal<string | null>(null);
  submitting = signal(false);

  editingReviewId = signal<number | null>(null);
  hoveredStar = signal(0); // for hover effect on star input

  reviewForm = new FormGroup({
    rating: new FormControl<number>(0, [Validators.required, Validators.min(1), Validators.max(5)]),
    comment: new FormControl('', [Validators.maxLength(1000)]),
  });

  constructor(
    private reviewService: ReviewService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  get isCustomer(): boolean {
    return this.authService.getUserRole() === 'Customer';
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'Admin';
  }

  get currentUserId(): string | null {
    return this.authService.currentUser.value?.sub ?? null;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userHasReviewed(): boolean {
    const reviews = this.summary()?.reviews ?? [];
    return reviews.some((r) => r.customerId === this.currentUserId);
  }

  private loadReviews(): void {
    this.loading.set(true);
    this.error.set(null);

    this.reviewService.getProductReviews(this.productId).subscribe({
      next: (data) => {
        this.summary.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load reviews.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  setRating(star: number): void {
    this.reviewForm.patchValue({ rating: star });
  }

  setHover(star: number): void {
    this.hoveredStar.set(star);
  }

  clearHover(): void {
    this.hoveredStar.set(0);
  }

  getStarState(star: number): 'filled' | 'hovered' | 'empty' {
    const selected = this.reviewForm.value.rating ?? 0;
    const hovered = this.hoveredStar();
    if (hovered >= star) return 'hovered';
    if (selected >= star) return 'filled';
    return 'empty';
  }

  submitReview(): void {
    if (this.reviewForm.invalid) return;

    this.submitting.set(true);
    this.submitError.set(null);

    const editingId = this.editingReviewId();

    if (editingId !== null) {
      const dto: UpdateReviewDto = {
        rating: this.reviewForm.value.rating ?? undefined,
        comment: this.reviewForm.value.comment ?? undefined,
      };

      this.reviewService.updateReview(this.productId, editingId, dto).subscribe({
        next: () => {
          this.resetForm();
          this.loadReviews();
        },
        error: (err) => {
          this.submitError.set('Failed to update review.');
          this.submitting.set(false);
          console.error(err);
        },
      });
    } else {
      const dto: CreateReviewDto = {
        rating: this.reviewForm.value.rating!,
        comment: this.reviewForm.value.comment ?? undefined,
      };

      this.reviewService.createReview(this.productId, dto).subscribe({
        next: () => {
          this.resetForm();
          this.loadReviews();
        },
        error: (err) => {
          this.submitError.set('Failed to submit review.');
          this.submitting.set(false);
          console.error(err);
        },
      });
    }
  }

  startEdit(review: ReviewResponseDto): void {
    this.editingReviewId.set(review.id);
    this.reviewForm.patchValue({ rating: review.rating, comment: review.comment ?? '' });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteReview(reviewId: number): void {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    this.reviewService.deleteReview(this.productId, reviewId).subscribe({
      next: () => this.loadReviews(),
      error: (err) => {
        this.error.set('Failed to delete review.');
        console.error(err);
      },
    });
  }

  private resetForm(): void {
    this.reviewForm.reset({ rating: 0, comment: '' });
    this.editingReviewId.set(null);
    this.submitting.set(false);
  }

  getRatingBreakdownPercent(star: number): number {
    const total = this.summary()?.totalReviews ?? 0;
    if (total === 0) return 0;
    return Math.round(((this.summary()?.ratingBreakdown[star] ?? 0) / total) * 100);
  }

  stars = [1, 2, 3, 4, 5];
}
