import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guarda de rota funcional para verificar se o usuário está autenticado.
 *
 * Se o `AuthService.isAuthenticated()` retornar `true`, a navegação é permitida.
 * Caso contrário, o usuário é redirecionado para a tela de login.
 */
export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se o usuário estiver autenticado, permite o acesso.
  // Caso contrário, cria uma UrlTree para redirecionar para a página de login.
  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};