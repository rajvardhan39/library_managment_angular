import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  model: RegisterRequest = {
    username: '',
    email: '',
    fullName: '',
    password: '',
  };
  
  isLoading = false;
  errorMessage = '';

  onSubmit(form: any): void {
    if (!form.valid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.auth.register(this.model).subscribe({
      next: () => {
        // Direct success path to books catalog
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Registration failed. System timeout.';
      },
      complete: () => (this.isLoading = false),
    });
  }
}