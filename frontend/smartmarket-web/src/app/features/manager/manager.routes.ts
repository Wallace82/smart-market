import { Routes } from '@angular/router';

import { ManagerFlyersComponent } from './flyers/manager-flyers.component';
import { OfferManagementComponent } from './flyers/offer-management.component';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard.component';
import { ProductListComponent } from './products/product-list.component';
import { ManagerSettingsComponent } from './settings/manager-settings.component';

export const MANAGER_ROUTES: Routes = [
  { path: 'dashboard', component: ManagerDashboardComponent },
  { path: 'flyers', component: ManagerFlyersComponent },
  { path: 'offers', component: OfferManagementComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'settings', component: ManagerSettingsComponent },
];