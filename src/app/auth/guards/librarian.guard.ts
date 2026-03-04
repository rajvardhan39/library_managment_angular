import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../auth.service';

export const librarianGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    // We only need the current value to make the decision
    take(1),
    map((user) => {
      // Check if user exists and has the librarian role
      if (user && user.role === 'librarian') {
        return true;
      }

      // If not a librarian, redirect to the main catalog
      // You could also redirect to an "Unauthorized" page if you have one
      console.warn('Access denied: Librarian role required.');
      return router.createUrlTree(['/books']);
    })
  );
};