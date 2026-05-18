import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Plano, Assinatura, CicloCobranca } from '@core/models/billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private http = inject(HttpClient);
  private readonly plansUrl = '/api/v1/planos';
  private readonly subsUrl = '/api/v1/assinaturas';

  getPlans(): Observable<Plano[]> {
    return this.http.get<Plano[]>(this.plansUrl);
  }

  getCurrentSubscription(supermercadoId: string): Observable<Assinatura> {
    return this.http.get<Assinatura>(`${this.subsUrl}/supermercado/${supermercadoId}`);
  }

  subscribe(supermercadoId: string, planoId: string, ciclo: CicloCobranca): Observable<Assinatura> {
    return this.http.post<Assinatura>(this.subsUrl, {
      supermercadoId,
      planoId,
      ciclo
    });
  }
}
