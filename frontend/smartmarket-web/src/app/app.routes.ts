import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'client/home' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin/supermarkets', loadComponent: () => import('./features/admin/supermarkets/supermarkets.page').then(m => m.SupermarketsPageComponent) },
  { path: 'manager/products', loadComponent: () => import('./features/manager/products/products.page').then(m => m.ProductsPageComponent) },
  { path: 'manager/settings/identity', loadComponent: () => import('./features/manager/settings/identity/identity-settings.component').then(m => m.IdentitySettingsComponent) },
  { path: 'manager/flyers', loadComponent: () => import('./features/manager/flyers/flyer-list/flyer-list.component').then(m => m.FlyerListComponent) },
  { path: 'manager/flyers/create', loadComponent: () => import('./features/manager/flyers/flyer-create/flyer-create.component').then(m => m.FlyerCreateComponent) },
  { path: 'manager/flyers/edit/:id', loadComponent: () => import('./features/manager/flyers/flyer-create/flyer-create.component').then(m => m.FlyerCreateComponent) },
  { path: 'client/home', loadComponent: () => import('./features/client/home/home.page').then(m => m.HomePageComponent) },
  { path: 'client/flyers/:id', loadComponent: () => import('./features/client/flyers/flyer-display.component').then(m => m.FlyerDisplayComponent) },
];
