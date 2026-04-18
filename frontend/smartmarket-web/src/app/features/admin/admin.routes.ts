import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Dashboard do Admin'
  },
  {
    path: 'supermarkets',
    loadComponent: () => import('./supermarkets/supermarket-management.component').then(m => m.SupermarketManagementComponent),
    title: 'Gestão de Supermercados'
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-management.component').then(m => m.UserManagementComponent),
    title: 'Gestão de Usuários'
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];