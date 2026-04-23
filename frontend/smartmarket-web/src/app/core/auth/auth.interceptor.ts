import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Ignorar rotas de autenticação (evita enviar token expirado no login/registro)
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Se tivermos o token, clonamos a requisição original e adicionamos o Header de Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Se não tiver token (ex: na própria requisição de login), segue normalmente
  return next(req);
};