import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Checks the 'isAuthenticated' getter we added to AuthService
  if (auth.isAuthenticated) {
    return true;
  }

  // Navigate to login and save the URL the user was trying to access
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};