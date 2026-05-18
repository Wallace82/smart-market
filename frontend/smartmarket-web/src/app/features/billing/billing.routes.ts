import { Routes } from '@angular/router';
import { PricingPageComponent } from './pages/pricing-page.component';
import { SubscriptionPageComponent } from './pages/subscription-page.component';

export const BILLING_ROUTES: Routes = [
  {
    path: '',
    component: PricingPageComponent
  },
  {
    path: 'assinatura',
    component: SubscriptionPageComponent
  }
];
