import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface FinancialData {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
}

export interface SubscriptionData {
  supermarketName: string;
  planName: string;
  status: 'active' | 'trialing' | 'pending' | 'canceled';
  price: number;
  renewalDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  
  getFinancialSummary(): Observable<FinancialData> {
    return of({
      totalRevenue: 145000.50,
      monthlyRevenue: 12500.90,
      activeSubscriptions: 145,
      churnRate: 2.5
    }).pipe(delay(600));
  }

  getSubscriptions(): Observable<SubscriptionData[]> {
    return of<SubscriptionData[]>([
      { supermarketName: 'Mercado Silva', planName: 'Pro', status: 'active', price: 299.90, renewalDate: '2026-06-01T00:00:00' },
      { supermarketName: 'Super Compre Bem', planName: 'Premium', status: 'active', price: 599.90, renewalDate: '2026-06-15T00:00:00' },
      { supermarketName: 'Mini Mercado Central', planName: 'Básico', status: 'trialing', price: 149.90, renewalDate: '2026-05-10T00:00:00' },
      { supermarketName: 'Rede Econômica', planName: 'Premium', status: 'canceled', price: 599.90, renewalDate: '2026-04-20T00:00:00' },
      { supermarketName: 'Atacadão do Bairro', planName: 'Pro', status: 'pending', price: 299.90, renewalDate: '2026-05-05T00:00:00' }
    ]).pipe(delay(800));
  }
}
