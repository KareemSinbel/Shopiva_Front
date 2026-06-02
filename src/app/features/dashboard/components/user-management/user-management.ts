import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserRow } from '../user-row/user-row';
import { UserPagination } from '../user-pagination/user-pagination';
import { UserEditModal } from '../user-edit-modal/user-edit-modal';
import { UserManagementService } from '../../services/user-management-service';
import { User, UserInsights } from '../../models/user';
import { ToastService } from '../../../../shared/services/toast.service';
import { Router } from '@angular/router';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    FormsModule,
    UserRow,
    UserPagination,
    UserEditModal,
  ],
  templateUrl: './user-management.html',
})
export class UserManagement implements OnInit, OnDestroy {
  private readonly userService = inject(UserManagementService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly searchInput$ = new Subject<string>();

  readonly users = signal<User[]>([]);
  readonly insights = signal<UserInsights | null>(null);
  readonly isLoading = signal(false);
  readonly insightsLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly totalCount = signal(0);
  readonly totalPages = signal(1);
  readonly searchQuery = signal('');
  readonly actioningId = signal<number | null>(null);
  readonly editingUser = signal<User | null>(null);

  readonly pageSize = PAGE_SIZE;

  ngOnInit(): void {
    this.loadUsers();

    this.searchInput$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.searchQuery.set(query);
        this.currentPage.set(1);
        this.loadUsers();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService
      .getUsers(this.currentPage(), PAGE_SIZE, this.searchQuery())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.users.set(res.items);
          this.totalCount.set(res.totalCount);
          this.totalPages.set(res.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load users. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);
    this.loadUsers();
  }

  onEdit(user: User): void {
    this.editingUser.set(user);
  }

  onEditModalClose(): void {
    this.editingUser.set(null);
  }

  onEditModalUpdated(updatedUser: User): void {
    this.users.update((list) =>
      list.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    this.editingUser.set(null);

    this.toastService.success(
      `${updatedUser.firstName} ${updatedUser.lastName} updated successfully`
    );
  }

  onRestrict(user: User): void {
    this.actioningId.set(user.id);

    this.userService
      .restrictUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.users.update((list) =>
            list.map((u) =>
              u.id === user.id
                ? { ...u, isRestricted: true }
                : u
            )
          );

          this.actioningId.set(null);

          this.toastService.success(
            `${user.firstName} ${user.lastName} has been suspended`
          );
        },
        error: () => {
          this.actioningId.set(null);
          this.toastService.error('Failed to suspend user');
        },
      });
  }

  onUnrestrict(user: User): void {
    this.actioningId.set(user.id);

    this.userService
      .unrestrictUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.users.update((list) =>
            list.map((u) =>
              u.id === user.id
                ? { ...u, isRestricted: false }
                : u
            )
          );

          this.actioningId.set(null);

          this.toastService.success(
            `${user.firstName} ${user.lastName} has been reactivated`
          );
        },
        error: () => {
          this.actioningId.set(null);
          this.toastService.error('Failed to reactivate user');
        },
      });
  }

  onDelete(user: User): void {
    const confirmed = confirm(
      `Delete ${user.firstName} ${user.lastName}? This cannot be undone.`
    );

    if (!confirmed) return;

    this.actioningId.set(user.id);

    this.users.update((list) =>
      list.filter((u) => u.id !== user.id)
    );

    this.totalCount.update((count) => count - 1);

    this.userService
      .deleteUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.actioningId.set(null);

          this.toastService.success(
            `${user.firstName} ${user.lastName} has been deleted`
          );
        },
        error: () => {
          this.actioningId.set(null);
          this.loadUsers();
          this.toastService.error('Failed to delete user');
        },
      });
  }
}
