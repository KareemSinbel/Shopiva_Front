import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] space-y-3 max-w-sm pointer-events-none">
      @for (toast of toastService.toasts() || []; track toast.id) {
        <div
          [ngClass]="getToastClass(toast.type)"
          class="px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-300 pointer-events-auto flex items-center gap-3"
        >
          <span class="material-symbols-outlined text-xl flex-shrink-0">
            {{ getIcon(toast.type) }}
          </span>
          <p class="font-body-md">{{ toast.message }}</p>
          <button
            (click)="toastService.remove(toast.id)"
            class="ml-auto flex-shrink-0 hover:opacity-75 transition-opacity"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
      warning: 'warning',
    };
    return icons[type] || 'info';
  }

  getToastClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'bg-tertiary-container text-on-tertiary-container',
      error: 'bg-error-container text-on-error-container',
      info: 'bg-primary-container text-on-primary-container',
      warning: 'bg-warning-container text-on-warning-container',
    };
    return classes[type] || 'bg-surface-container text-on-surface';
  }
}
