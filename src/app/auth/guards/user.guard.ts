import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../auth.service';

export const userGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {

      // If not logged in → go to login
      if (!user) {
        return router.createUrlTree(['/login']);
      }

      // If normal user → allow
      if (user.role === 'user') {
        return true;
      }

      // If librarian → redirect to librarian dashboard
      if (user.role === 'librarian') {
        return router.createUrlTree(['/librarian/dashboard']);
      }

      // Fallback
      return router.createUrlTree(['/login']);
    })
  );
};