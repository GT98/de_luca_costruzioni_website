// auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Aspetta che la sessione sia caricata da Supabase
  await authService.waitForSession();

  const user = authService.getCurrentUser();

  if (!user) {
    router.navigate(['/admin/login']);
    return false;
  }

  return true;
};