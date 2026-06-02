export interface ReviewResponseDto {
  id: number;
  rating: number;
  comment?: string;
  customerName: string;
  customerId: string;
  productId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductReviewSummaryDto {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: { [key: number]: number }; 
  reviews: ReviewResponseDto[];
}

export interface CreateReviewDto {
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}
