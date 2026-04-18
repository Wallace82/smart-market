import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './features/auth/login/layout.component';

export const routes: Routes = [
  // Rotas públicas (fora do layout principal)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  // Rotas protegidas (dentro do layout principal)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'manager/dashboard', pathMatch: 'full' }, // Rota padrão para gestor
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'manager',
        loadChildren: () => import('./features/manager/manager.routes').then(m => m.MANAGER_ROUTES)
      }
    ],
  },

  // Fallback - redireciona para o login se a rota não existir
  { path: '**', redirectTo: 'login' },
];