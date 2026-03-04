import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { TOKEN_KEY } from './auth.interceptor'; // Importing the key from your interceptor

export interface LoginRequest { username: string; password: string; }
export interface RegisterRequest { username: string; email: string; fullName: string; password: string; }
export interface AuthResponse { token: string; user: User; message?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBaseUrl = 'http://localhost:3001/api';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): User | null { return this.currentUserSubject.value; }
  get currentUserSnapshot(): User | null { return this.currentUserSubject.value; }
  get isAuthenticated(): boolean { return !!localStorage.getItem(TOKEN_KEY); }
  get isLibrarian(): boolean { return this.currentUserSubject.value?.role === 'librarian'; }

  constructor() { this.loadStoredUser(); }

  private loadStoredUser(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.http.get<User>(`${this.apiBaseUrl}/auth/profile`).subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.clearSession(),
      });
    }
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, payload).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, payload).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  // Public logout method for AppComponent
  logout(): void {
    this.http.post(`${this.apiBaseUrl}/auth/logout`, {}).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(), // Clear even if server call fails
    });
  }

refreshProfile(): void {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return;

  this.http.get<User>(`${this.apiBaseUrl}/auth/profile`)
    .subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.clearSession()
    });
}


  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}