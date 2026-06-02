import {
  Component,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserManagementService } from '../../services/user-management-service';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit-modal.html',
  styleUrl: './user-edit-modal.css',
})
export class UserEditModal implements OnInit {
  @Input({ required: true }) user!: User;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<User>();

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserManagementService);

  readonly form = signal<FormGroup | null>(null);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.form.set(
      this.fb.group({
        firstName: [this.user.firstName, [Validators.required, Validators.minLength(2)]],
        lastName: [this.user.lastName, [Validators.required, Validators.minLength(2)]],
        email: [{ value: this.user.email, disabled: true }, Validators.required],
        phoneNumber: [this.user.phoneNumber || '', Validators.required],
        role: [this.user.roles, Validators.required],
      })
    );
  }

  onSave(): void {
    const fg = this.form();
    if (!fg || fg.invalid) return;

    this.isSaving.set(true);
    this.error.set(null);

    const payload = {
      firstName: fg.get('firstName')?.value,
      lastName: fg.get('lastName')?.value,
      phoneNumber: fg.get('phoneNumber')?.value,
      role: fg.get('role')?.value,
    };

    console.log('Updating user:', payload); // DEBUG

    this.userService.updateUser(this.user.id, payload).subscribe({
      next: (updatedUser) => {
        console.log('User updated successfully:', updatedUser); // DEBUG
        this.isSaving.set(false);
        this.updated.emit(updatedUser);
        this.close.emit();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Failed to update user.';
        console.error('User update error:', err); // DEBUG
        this.error.set(errorMsg);
        this.isSaving.set(false);
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
