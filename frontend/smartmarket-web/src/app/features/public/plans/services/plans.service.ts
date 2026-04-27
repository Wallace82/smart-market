import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'semiannual' | 'annual';
  maxOffers: number;
  maxPushNotifications: number;
  allowCustomerPreferences: boolean;
  trialDays: number;
  highlight?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlansService {
  
  private mockPlans: Plan[] = [
    {
      id: '1',
      name: 'Básico',
      description: 'Ideal para supermercados de bairro que estão começando no digital.',
      price: 149.90,
      billingCycle: 'monthly',
      maxOffers: 100,
      maxPushNotifications: 2,
      allowCustomerPreferences: false,
      trialDays: 7,
      highlight: false
    },
    {
      id: '2',
      name: 'Pro',
      description: 'A escolha número um para escalar suas vendas e fidelizar clientes.',
      price: 299.90,
      billingCycle: 'monthly',
      maxOffers: 500,
      maxPushNotifications: 10,
      allowCustomerPreferences: true,
      trialDays: 14,
      highlight: true
    },
    {
      id: '3',
      name: 'Premium',
      description: 'Para redes com múltiplas lojas e altíssimo volume de tráfego físico.',
      price: 599.90,
      billingCycle: 'monthly',
      maxOffers: 9999, // Ilimitado
      maxPushNotifications: 30,
      allowCustomerPreferences: true,
      trialDays: 14,
      highlight: false
    }
  ];

  getPlans(): Observable<Plan[]> {
    return of(this.mockPlans).pipe(delay(800)); // Simulando loading
  }
}
