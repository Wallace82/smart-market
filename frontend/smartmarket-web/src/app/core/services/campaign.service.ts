import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Campaign, CampaignRequest } from '../models/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/campanhas';

  listarPorSupermercado(supermercadoId: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/supermercado/${supermercadoId}`);
  }

  cadastrar(request: CampaignRequest): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, request);
  }

  alterarStatus(id: string, status: 'Ativa' | 'Pausada' | 'Concluída'): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.apiUrl}/${id}/status`, { status });
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
