import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Added for Search [(ngModel)]
import { BehaviorSubject, Observable, Subject, catchError, finalize, of, shareReplay, switchMap, takeUntil, tap, delay, map } from 'rxjs';
import { User } from '../../models/user.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';
import { UserAdminService } from './user-admin.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnDestroy {
  private readonly userAdmin = inject(UserAdminService);
  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  searchTerm = '';
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly error$ = new BehaviorSubject<string>('');
  readonly info$ = new BehaviorSubject<string>('');
  
  confirmingDeactivate: User | null = null;

  readonly users$: Observable<User[]> = this.refresh$.pipe(
    delay(0), 
    tap(() => {
      this.error$.next('');
      this.isLoading$.next(true);
    }),
    switchMap(() => this.userAdmin.getAllUsers().pipe(
      catchError(() => {
        this.error$.next('Failed to fetch users.');
        return of([]);
      }),
      finalize(() => this.isLoading$.next(false))
    )),
    shareReplay(1)
  );

  // Filters users based on search input
  filterUsers(users: User[]): User[] {
    if (!this.searchTerm) return users;
    const term = this.searchTerm.toLowerCase();
    return users.filter(u => 
      u.fullName.toLowerCase().includes(term) || 
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  onRoleChange(user: User, newRole: 'user' | 'librarian'): void {
    this.updateUserStatus(user.id, { role: newRole }, 'Role updated.');
  }

  onActivate(user: User): void {
    this.updateUserStatus(user.id, { isActive: true }, `User ${user.username} activated.`);
  }

  askDeactivate(user: User): void {
    this.confirmingDeactivate = user;
  }

  onDeactivateConfirmed(): void {
    if (!this.confirmingDeactivate) return;
    this.updateUserStatus(this.confirmingDeactivate.id, { isActive: false }, 'User deactivated.');
    this.confirmingDeactivate = null;
  }

  private updateUserStatus(id: number, payload: any, msg: string): void {
    this.isLoading$.next(true);
    this.userAdmin.updateUser(id, payload)
      .pipe(
        finalize(() => this.isLoading$.next(false)), 
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.info$.next(msg);
          this.refresh$.next();
          setTimeout(() => this.info$.next(''), 3000);
        },
        error: () => this.error$.next('Update failed.')
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}