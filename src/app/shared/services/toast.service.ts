import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private idCounter = 0;
  private readonly DEFAULT_DURATION = 3000;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration?: number): void {
    const id = `toast-${++this.idCounter}`;
    const toast: Toast = {
      id,
      message,
      type,
      duration: duration ?? this.DEFAULT_DURATION,
    };

    this.toasts.update(toasts => [...toasts, toast]);

    if (toast.duration! > 0) {
      setTimeout(() => this.remove(id), toast.duration);
    }
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }
}
