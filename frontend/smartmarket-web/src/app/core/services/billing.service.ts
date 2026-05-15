import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FinancialSummaryResponse, SubscriptionResponse } from '@core/models/billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/admin/billing';

  getFinancialSummary(): Observable<FinancialSummaryResponse> {
    return this.http.get<FinancialSummaryResponse>(`${this.apiUrl}/summary`);
  }

  getSubscriptions(): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(`${this.apiUrl}/subscriptions`);
  }

  cancelSubscription(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/subscriptions/${id}/cancel`, {});
  }

  reactivateSubscription(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/subscriptions/${id}/reactivate`, {});
  }
}
