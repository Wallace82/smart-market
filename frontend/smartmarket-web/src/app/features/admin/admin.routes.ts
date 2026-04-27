import { Routes } from '@angular/router';

// Os componentes do admin (dashboard, etc.) serão criados futuramente.
// import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'financeiro',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    redirectTo: 'financeiro',
    pathMatch: 'full',
  },
  {
    path: 'financeiro',
    loadComponent: () => import('./financial/admin-financial.component').then(m => m.AdminFinancialComponent)
  },
  {
    path: 'assinaturas',
    loadComponent: () => import('./subscriptions/admin-subscriptions.component').then(m => m.AdminSubscriptionsComponent)
  },
  {
    path: 'supermarkets',
    loadComponent: () => import('./supermarkets/store-list.component').then(m => m.StoreListComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'catalog',
    loadComponent: () => import('./catalog/admin-catalog.component').then(m => m.AdminCatalogComponent)
  },
  {
    path: 'themes',
    loadComponent: () => import('./themes/admin-themes.component').then(m => m.AdminThemesComponent)
  }
];