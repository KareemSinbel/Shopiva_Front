import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[] | undefined;

  if (!expectedRoles?.length) {

    return true;
  }

  const userRole = authService.getUserRole();

  if (!userRole) {

    return router.createUrlTree(['/login']);
  }

  if (expectedRoles.includes(userRole)) {

    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
