import {
  Component,
  inject,
  OnInit,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Banner {
  id?: number;
  title: string;
  subTitle: string | null;
  imageUrl: string;
  isLive: boolean;
}

const API = 'https://localhost:7259/api';

@Component({
  selector: 'app-banner-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './banner-modal.html',
  styleUrl: './banner-modal.css',
})
export class BannerModal implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<Banner>();

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly form = signal<FormGroup | null>(null);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);
  readonly imagePreview = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);

  ngOnInit(): void {
    this.form.set(
      this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        subTitle: ['', []],
        isLive: [false, Validators.required],
      })
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      this.error.set('Please select a valid image file.');
    }
  }

  onSave(): void {
    const fg = this.form();
    if (!fg || fg.invalid || !this.selectedFile()) {
      this.error.set('Please fill all required fields and select an image.');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const formData = new FormData();
    formData.append('title', fg.get('title')?.value);
    formData.append('subTitle', fg.get('subTitle')?.value || '');
    formData.append('imageFile', this.selectedFile()!);
    formData.append('isLive', fg.get('isLive')?.value ? 'true' : 'false');

    console.log('Creating banner...'); // DEBUG

    this.http.post<Banner>(`${API}/Dashboard/banners`, formData).subscribe({
      next: (banner) => {
        console.log('Banner created:', banner); // DEBUG
        this.isSaving.set(false);
        this.created.emit(banner);
        this.close.emit();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Failed to create banner.';
        console.error('Banner creation error:', err); // DEBUG
        this.error.set(errorMsg);
        this.isSaving.set(false);
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
