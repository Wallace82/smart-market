import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/template/main/main-layout.component';
import { HomeComponent } from './features/public/home.component';

export const routes: Routes = [
  // ==================================================
  // Rotas Públicas (Acesso sem login)
  // ==================================================
  {
    path: '',
    component: HomeComponent,
    title: 'SmartMarket - Ofertas Perto de Você',
  },
  {
    path: 'planos',
    title: 'SmartMarket - Conheça nossos planos',
    loadComponent: () => import('./features/billing/pages/pricing-page.component').then(m => m.PricingPageComponent)
  },
  {
    path: 'location',
    title: 'SmartMarket - Alterar Localização',
    loadComponent: () => import('./features/public/location/location.component').then(m => m.LocationComponent)
  },
  {
    path: 'flyers',
    title: 'SmartMarket - Todos os Encartes',
    loadComponent: () => import('./features/public/flyers/flyer-list.component').then(m => m.FlyerListComponent)
  },
  {
    path: 'flyer/:id',
    title: 'SmartMarket - Visualizador de Encarte',
    loadComponent: () => import('./features/manager/dashboard/flyer-viewer.component').then(m => m.FlyerViewerComponent)
  },
  {
    path: 'supermarket/:id',
    title: 'SmartMarket - Loja',
    loadComponent: () => import('./features/public/supermarket-details/supermarket-details.component').then(m => m.SupermarketDetailsComponent)
  },
  {
    path: 'offers',
    title: 'SmartMarket - Promoções',
    loadComponent: () => import('./features/public/offers/offers-list.component').then(m => m.OffersListComponent)
  },
  {
    path: 'login',
    title: 'SmartMarket - Login',
    // Assumindo que o componente de login existe em 'features/auth'
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'SmartMarket - Crie sua Conta',
    // Assumindo que o componente de registro existe ou será criado
    loadComponent: () =>
      import('./features/login/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // ==================================================
  // Rotas Protegidas (Exigem login e usam o layout principal)
  // ==================================================
  {
    path: 'admin',
    component: MainLayoutComponent,
    //canActivate: [authGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'manager',
    component: MainLayoutComponent,
    //canActivate: [authGuard],
    // Você precisará criar o arquivo de rotas para o gestor, similar ao de admin
    loadChildren: () =>
      import('./features/manager/manager.routes').then((m) => m.MANAGER_ROUTES),
  },
  {
    path: 'concierge',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./features/concierge/concierge.routes').then((m) => m.CONCIERGE_ROUTES),
  },

  // ==================================================
  // Rota de Fallback (Página não encontrada)
  // ==================================================
  {
    path: '**',
    redirectTo: '', // Redireciona qualquer URL não encontrada para a home pública
  },
];