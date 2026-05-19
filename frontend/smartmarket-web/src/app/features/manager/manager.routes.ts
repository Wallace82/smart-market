import { Routes } from '@angular/router';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard.component';

export const MANAGER_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: ManagerDashboardComponent },

  // ==========================================================
  // RF-02 - Personalização da Loja (Whitelabel - Cores e Logo)
  // ==========================================================
  { 
    path: 'settings', 
    loadComponent: () => import('./settings/manager-settings.component').then(m => m.ManagerSettingsComponent),
    title: 'SmartMarket - Configurações da Loja'
  },
  { 
    path: 'settings/identity', 
    loadComponent: () => import('./settings/identity/identity-settings.component').then(m => m.IdentitySettingsComponent),
    title: 'SmartMarket - Identidade Visual'
  },
  
  // ==========================================================
  // RF-03 e RF-04 - Catálogo, Ofertas e Encartes Digitais
  // ==========================================================
  { 
    path: 'offers', 
    loadComponent: () => import('./offers/offer-list.component').then(m => m.OfferListComponent),
    title: 'SmartMarket - Minhas Ofertas'
  },
  { 
    path: 'flyers', 
    loadComponent: () => import('./flyers/flyer-list/flyer-list.component').then(m => m.FlyerListComponent),
    title: 'SmartMarket - Encartes Digitais'
  },
  { 
    path: 'flyers/new', 
    loadComponent: () => import('./flyers/flyer-create/flyer-create.component').then(m => m.FlyerCreateComponent),
    title: 'SmartMarket - Novo Encarte'
  },
  { 
    path: 'flyers/edit/:id', 
    loadComponent: () => import('./flyers/flyer-create/flyer-create.component').then(m => m.FlyerCreateComponent),
    title: 'SmartMarket - Editar Encarte'
  },
  
  // ==========================================================
  // RF-12 e RF-13 - Growth, Marketing e QR Code
  // ==========================================================
  {
    path: 'marketing',
    loadComponent: () => import('./marketing/marketing-dashboard.component').then(m => m.MarketingDashboardComponent),
    title: 'SmartMarket - Marketing & QR Code'
  },
  {
    path: 'campaigns',
    loadComponent: () => import('./campaigns/campaign-list.component').then(m => m.CampaignListComponent),
    title: 'SmartMarket - Campanhas Inteligentes'
  },
  {
    path: 'subscription',
    loadComponent: () => import('../billing/pages/subscription-page.component').then(m => m.SubscriptionPageComponent),
    title: 'SmartMarket - Minha Assinatura'
  }
];