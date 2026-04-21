import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se o usuário estiver autenticado, permite o acesso.
  // Caso contrário, cria uma UrlTree para redirecionar para a página de login.
  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};