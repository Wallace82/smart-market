import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'client/home' },
  { path: 'admin/supermarkets', loadComponent: () => import('./features/admin/supermarkets/supermarkets.page').then(m => m.SupermarketsPageComponent) },
  { path: 'manager/products', loadComponent: () => import('./features/manager/products/products.page').then(m => m.ProductsPageComponent) },
  { path: 'client/home', loadComponent: () => import('./features/client/home/home.page').then(m => m.HomePageComponent) },
];
