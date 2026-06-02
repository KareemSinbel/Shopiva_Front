import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateReviewDto, ProductReviewSummaryDto, ReviewResponseDto, UpdateReviewDto } from '../../features/product details/Models/review.models';
import { ApiConfig } from './api-config';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private http: HttpClient , private readonly apiConfig: ApiConfig) {}

  getProductReviews(productId: number): Observable<ProductReviewSummaryDto> {
    return this.http
      .get<ProductReviewSummaryDto>(`${this.apiConfig.baseUrl}/Review?productId=${productId}`)
      .pipe(catchError((err) => throwError(() => err)));
  }

  createReview(productId: number, dto: CreateReviewDto): Observable<ReviewResponseDto> {
    return this.http
      .post<ReviewResponseDto>(`${this.apiConfig.baseUrl}/Review?productId=${productId}`, dto)
      .pipe(catchError((err) => throwError(() => err)));
  }

  updateReview(productId: number, reviewId: number, dto: UpdateReviewDto): Observable<ReviewResponseDto> {
    return this.http
      .put<ReviewResponseDto>(`${this.apiConfig.baseUrl}/Review/${reviewId}?productId=${productId}`, dto)
      .pipe(catchError((err) => throwError(() => err)));
  }

  deleteReview(productId: number, reviewId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiConfig.baseUrl}/Review/${reviewId}?productId=${productId}`)
      .pipe(catchError((err) => throwError(() => err)));
  }
}
