import { Routes } from '@angular/router';

import { StoreListComponent } from './supermarkets/store-list.component';
import { UserListComponent } from './users/user-list.component';

import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { CatalogListComponent } from './catalog-list/catalog-list.component';
import { ThemeListComponent } from './theme-list.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'supermarkets', component: StoreListComponent },
  { path: 'users', component: UserListComponent },
  { path: 'catalog', component: CatalogListComponent },
  { path: 'themes', component: ThemeListComponent}
];