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
    loadComponent: () => import('./financial/admin-financial.component').then(m => m.AdminFinancialComponent),
    data: { animation: 'financial' }
  },
  {
    path: 'assinaturas',
    loadComponent: () => import('./subscriptions/admin-subscriptions.component').then(m => m.AdminSubscriptionsComponent),
    data: { animation: 'subscriptions' }
  },
  {
    path: 'supermarkets',
    loadComponent: () => import('./supermarkets/store-list.component').then(m => m.StoreListComponent),
    data: { animation: 'supermarkets' }
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-list.component').then(m => m.UserListComponent),
    data: { animation: 'users' }
  },
  {
    path: 'catalog',
    loadComponent: () => import('./catalog/admin-catalog.component').then(m => m.AdminCatalogComponent),
    data: { animation: 'catalog' }
  },
  {
    path: 'themes',
    loadComponent: () => import('./themes/admin-themes.component').then(m => m.AdminThemesComponent),
    data: { animation: 'themes' }
  },
  {
    path: 'themes/:id/edit',
    loadComponent: () => import('./themes/editor/theme-editor.component').then(m => m.ThemeEditorComponent),
    data: { animation: 'theme-editor' }
  },
  {
    path: 'planos',
    loadComponent: () => import('./planos/admin-plan-list.component').then(m => m.AdminPlanListComponent),
    data: { animation: 'plans' }
  },
  {
    path: 'planos/new',
    loadComponent: () => import('./planos/admin-plan-edit.component').then(m => m.AdminPlanEditComponent),
    data: { animation: 'plan-editor' }
  },
  {
    path: 'planos/:id/edit',
    loadComponent: () => import('./planos/admin-plan-edit.component').then(m => m.AdminPlanEditComponent),
    data: { animation: 'plan-editor' }
  }
];