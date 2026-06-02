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
import { UserManagementService } from '../../services/user-management-service';
import { User, UserInsights } from '../../models/user';


const PAGE_SIZE = 10;

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    FormsModule,
    UserRow,
    UserPagination,
  ],
  templateUrl: './user-management.html',
})
export class UserManagement implements OnInit, OnDestroy {
  private readonly userService = inject(UserManagementService);
  private readonly destroy$ = new Subject<void>();
  private readonly searchInput$ = new Subject<string>();

  // ── Signals ────────────────────────────────────────────────────────────
  readonly users         = signal<User[]>([]);
  readonly insights      = signal<UserInsights | null>(null);
  readonly isLoading     = signal(false);
  readonly insightsLoading = signal(false);
  readonly error         = signal<string | null>(null);
  readonly currentPage   = signal(1);
  readonly totalCount    = signal(0);
  readonly totalPages    = signal(1);
  readonly searchQuery   = signal('');
  readonly actioningId   = signal<number | null>(null); // row being mutated
  // ────────────────────────────────────────────────────────────────────────

  readonly pageSize = PAGE_SIZE;

  ngOnInit(): void {
    //this.loadInsights();
    this.loadUsers();

    // Debounce search so we don't fire on every keystroke
    this.searchInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(query => {
      this.searchQuery.set(query);
      this.currentPage.set(1);
      this.loadUsers();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Data loading ───────────────────────────────────────────────────────

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

  // loadInsights(): void {
  //   this.insightsLoading.set(true);
  //   this.userService.getInsights().pipe(takeUntil(this.destroy$)).subscribe({
  //     next: (data) => { this.insights.set(data); this.insightsLoading.set(false); },
  //     error: () => this.insightsLoading.set(false),
  //   });
  // }

  // ── Search ─────────────────────────────────────────────────────────────

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  // ── Pagination ─────────────────────────────────────────────────────────

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadUsers();
  }

  // ── User actions ───────────────────────────────────────────────────────

  onEdit(user: User): void {
    // TODO: open edit modal / navigate to edit route
    console.log('Edit user:', user.id);
  }

  onRestrict(user: User): void {
    this.actioningId.set(user.id);
    this.userService.restrictUser(user.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        // Optimistic update
        this.users.update(list =>
          list.map(u => u.id === user.id ? { ...u, isRestricted: true as const } : u)
        );
        this.actioningId.set(null);
      },
      error: () => this.actioningId.set(null),
    });
  }

  onUnrestrict(user: User): void {
    this.actioningId.set(user.id);
    this.userService.unrestrictUser(user.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.users.update(list =>
          list.map(u => u.id === user.id ? { ...u, isRestricted: false as const } : u)
        );
        this.actioningId.set(null);
      },
      error: () => this.actioningId.set(null),
    });
  }

  onDelete(user: User): void {
    if (!confirm(`Delete ${user.firstName + " " + user.lastName}? This cannot be undone.`)) return;
    this.actioningId.set(user.id);

    // Optimistic removal
    this.users.update(list => list.filter(u => u.id !== user.id));
    this.totalCount.update(n => n - 1);

    this.userService.deleteUser(user.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.actioningId.set(null),
      error: () => {
        // Revert — reload
        this.actioningId.set(null);
        this.loadUsers();
      },
    });
  }

  // onInvite(): void {
  //   const email = prompt('Enter email address to invite:');
  //   if (!email?.trim()) return;
  //   this.userService.inviteUser(email.trim()).pipe(takeUntil(this.destroy$)).subscribe({
  //     next: () => alert(`Invitation sent to ${email}`),
  //     error: () => alert('Failed to send invitation.'),
  //   });
  // }
}
