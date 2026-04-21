import { Routes } from '@angular/router';

// Os componentes do admin (dashboard, etc.) serão criados futuramente.
// import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // { path: 'dashboard', component: AdminDashboardComponent },
];