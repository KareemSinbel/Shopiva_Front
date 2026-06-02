import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-pagination',
  imports: [],
  templateUrl: './user-pagination.html',
  styleUrl: './user-pagination.css',
})
export class UserPagination {
  @Input({ required: true }) currentPage!: number;
  @Input({ required: true }) totalPages!: number;
  @Input({ required: true }) totalCount!: number;
  @Input({ required: true }) pageSize!: number;

  @Output() pageChange = new EventEmitter<number>();

  get showing(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [1];
    if (current > 3) pages.push(-1); // ellipsis
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push(-1); // ellipsis
    pages.push(total);
    return pages;
  }
}
