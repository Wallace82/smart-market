import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Campaign, CampaignRequest } from '../models/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/campaigns';

  listarPorSupermercado(supermarketId: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/supermercado/${supermarketId}`);
  }

  cadastrar(request: CampaignRequest): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, request);
  }

  alterarStatus(id: string, status: 'ATIVA' | 'PAUSADA' | 'CONCLUIDA' | 'Ativa' | 'Pausada' | 'Concluída'): Observable<Campaign> {
    const backendStatus = status.toUpperCase();
    return this.http.patch<Campaign>(`${this.apiUrl}/${id}/status`, { status: backendStatus });
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
