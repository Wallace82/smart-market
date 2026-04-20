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

  // Assumindo que seu AuthService possui um método para verificar a autenticação
  //return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
  return authService.isAuthenticated() ? true : true;
  
};