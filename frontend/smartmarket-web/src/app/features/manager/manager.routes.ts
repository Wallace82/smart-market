import { Routes } from '@angular/router';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard.component';

export const MANAGER_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: ManagerDashboardComponent },
  // As rotas de encartes, ofertas e campanhas serão adicionadas aqui futuramente
];