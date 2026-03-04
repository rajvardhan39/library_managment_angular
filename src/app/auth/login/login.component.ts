import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // model should only have these two for login
  model: LoginRequest = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  onSubmit(form: any): void {
    if (!form.valid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.model).subscribe({
      next: () => this.router.navigate(['/books']),
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Access denied. Please check your credentials.';
      },
      complete: () => (this.isLoading = false),
    });
  }
}