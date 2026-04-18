import { Routes } from '@angular/router';

export const MANAGER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
    title: 'Dashboard do Gestor'
  },
  {
    path: 'flyers',
    loadComponent: () => import('./flyers/flyer-management.component').then(m => m.FlyerManagementComponent),
    title: 'Gestão de Encartes'
  },
  {
    path: 'offers',
    loadComponent: () => import('./offers/offer-management.component').then(m => m.OfferManagementComponent),
    title: 'Gestão de Ofertas'
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/supermarket-settings.component').then(m => m.SupermarketSettingsComponent),
    title: 'Configurações da Loja'
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];