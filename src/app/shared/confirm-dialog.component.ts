import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" (click)="cancelled.emit()">
      <div class="dialog" (click)="$event.stopPropagation()">
        
        <div class="modal-icon">
          <span class="exclamation">!</span>
        </div>

        <div class="content">
          <h3 class="title">{{ message }}</h3>
          <div class="body-text">
            <ng-content></ng-content>
          </div>
        </div>

        <div class="actions">
          <button class="btn-cancel" type="button" (click)="cancelled.emit()">
            Nevermind
          </button>
          <button class="btn-confirm" type="button" (click)="confirmed.emit()">
            Yes, Proceed
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* THE OVERLAY (Darkens the background) */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-out;
    }

    /* THE DIALOG BOX */
    .dialog {
      background: #0f172a;
      padding: 2rem;
      border-radius: 20px;
      max-width: 400px;
      width: 90%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      text-align: center;
      /* Bouncy Entrance Animation */
      animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* DECORATIVE ICON */
    .modal-icon {
      width: 60px;
      height: 60px;
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid #ef4444;
      color: #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: bold;
      margin: 0 auto 1.5rem;
    }

    .title {
      color: white;
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
    }

    .body-text {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 2rem;
    }

    /* ACTIONS */
    .actions {
      display: flex;
      gap: 1rem;
    }

    button {
      flex: 1;
      padding: 0.75rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 0.9rem;
      font-family: 'Inter', sans-serif;
    }

    .btn-cancel {
      background: #1e293b;
      color: #cbd5e1;
    }

    .btn-cancel:hover {
      background: #334155;
      color: white;
    }

    .btn-confirm {
      background: #ef4444;
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .btn-confirm:hover {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(239, 68, 68, 0.4);
    }

    /* KEYFRAMES */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() message = 'Are you sure?';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}