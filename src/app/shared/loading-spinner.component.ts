import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `<div class="spinner" aria-label="Loading"></div>`,
  styles: [
    `
      .spinner {
        width: 2rem;
        height: 2rem;
        border: 2px solid #ddd;
        border-top-color: #333;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `,
  ],
})
export class LoadingSpinnerComponent {}
