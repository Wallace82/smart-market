import { Routes } from '@angular/router';

export const CONCIERGE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'fila',
    pathMatch: 'full',
  },
  {
    path: 'fila',
    loadComponent: () => import('./fila/concierge-fila.component').then(m => m.ConciergeFilaComponent),
  }
];
