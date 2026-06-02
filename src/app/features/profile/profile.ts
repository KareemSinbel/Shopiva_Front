import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileResponseDto } from './profile.models';
import { ProfileService } from '../../core/services/profile-service';
import { ToastService } from '../../shared/services/toast.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profile = signal<ProfileResponseDto | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  activeTab = signal<'info' | 'password' | 'image'>('info');

  // Profile form
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
  });
  profileSaving = signal(false);
  profileSuccess = signal(false);
  profileError = signal<string | null>(null);

  // Password form
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });
  passwordSaving = signal(false);
  passwordSuccess = signal(false);
  passwordError = signal<string | null>(null);

  // Image
  selectedImageFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  imageSaving = signal(false);
  imageSuccess = signal(false);
  imageError = signal<string | null>(null);

  private toastService = inject(ToastService);

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.error.set(null);

    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          country: data.country ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load profile.');
        this.loading.set(false);
      },
    });
  }

  setTab(tab: 'info' | 'password' | 'image'): void {
    this.activeTab.set(tab);
    this.profileSuccess.set(false);
    this.passwordSuccess.set(false);
    this.imageSuccess.set(false);
    this.profileError.set(null);
    this.passwordError.set(null);
    this.imageError.set(null);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.profileSaving.set(true);
    this.profileSuccess.set(false);
    this.profileError.set(null);

    const payload = this.profileForm.value as any;
    console.log('Sending profile update:', payload); // DEBUG

    this.profileService.updateProfile(payload).subscribe({
      next: (data) => {
        console.log('Profile updated successfully:', data); // DEBUG
        this.profile.set(data);
        this.profileSaving.set(false);
        this.profileSuccess.set(true);
        this.toastService.success('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Profile update error:', err); // DEBUG
        const errorMsg = err?.error?.detail ?? err?.error?.message ?? 'Failed to update profile.';
        this.profileError.set(errorMsg);
        this.profileSaving.set(false);
        this.toastService.error(errorMsg);
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    const { newPassword, confirmNewPassword } = this.passwordForm.value;
    if (newPassword !== confirmNewPassword) {
      this.passwordError.set('Passwords do not match.');
      this.toastService.error('Passwords do not match.');
      return;
    }

    this.passwordSaving.set(true);
    this.passwordSuccess.set(false);
    this.passwordError.set(null);

    this.profileService.changePassword(this.passwordForm.value as any).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.passwordSaving.set(false);
        this.passwordSuccess.set(true);
        this.toastService.success('Password changed successfully!');
      },
      error: (err) => {
        const errorMsg = err?.error?.detail ?? err?.error?.message ?? 'Failed to change password.';
        this.passwordError.set(errorMsg);
        this.passwordSaving.set(false);
        this.toastService.error(errorMsg);
      },
    });
  }

  onImageSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedImageFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  uploadImage(): void {
    const file = this.selectedImageFile();
    if (!file) return;
    this.imageSaving.set(true);
    this.imageSuccess.set(false);
    this.imageError.set(null);

    const formData = new FormData();
    formData.append('Image', file);

    this.profileService.updateProfileImage(formData).subscribe({
      next: (data) => {
        this.profile.set(data);
        this.imageSaving.set(false);
        this.imageSuccess.set(true);
        this.selectedImageFile.set(null);
        this.previewUrl.set(null);
        this.toastService.success('Profile picture updated successfully!');
      },
      error: (err) => {
        const errorMsg = err?.error?.detail ?? err?.error?.message ?? 'Failed to upload image.';
        this.imageError.set(errorMsg);
        this.imageSaving.set(false);
        this.toastService.error(errorMsg);
      },
    });
  }

  removeImage(): void {
    if (!window.confirm('Remove your profile picture?')) return;
    this.imageSaving.set(true);
    this.imageError.set(null);

    this.profileService.removeProfileImage().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.imageSaving.set(false);
        this.imageSuccess.set(true);
        this.toastService.success('Profile picture removed successfully!');
      },
      error: (err) => {
        const errorMsg = err?.error?.detail ?? err?.error?.message ?? 'Failed to remove image.';
        this.imageError.set(errorMsg);
        this.imageSaving.set(false);
        this.toastService.error(errorMsg);
      },
    });
  }

  get initials(): string {
    const p = this.profile();
    if (!p) return '?';
    return `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
  }
}
