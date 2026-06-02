import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  template: `
    <main class="min-h-screen flex items-center justify-center px-6 bg-surface">
      <section class="max-w-md text-center space-y-5">
        <p class="text-sm font-semibold text-primary">403</p>
        <h1 class="text-3xl font-bold text-on-surface">Unauthorized</h1>
        <p class="text-on-surface-variant">
          You do not have permission to open this page.
        </p>
        <a
          routerLink="/login"
          class="inline-flex items-center justify-center px-5 py-3 rounded-lg btn-primary-gradient text-white font-semibold"
        >
          Back to login
        </a>
      </section>
    </main>
  `,
})
export class Unauthorized {}
