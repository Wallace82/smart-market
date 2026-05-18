import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ConciergeRequest {
  id: string;
  supermercadoId: string;
  supermercadoNome?: string;
  atendenteId: string | null;
  atendenteNome?: string | null;
  titulo: string;
  observacoes: string | null;
  status: string; // PENDENTE, EM_PROCESSAMENTO, AGUARDANDO_APROVACAO, APROVADO, REJEITADO, PUBLICADO
  dataCriacao: string;
  dataInicioProcessamento?: string | null;
  dataConclusao?: string | null;
  slaDefinido?: number; // em horas
  score: number;
  complexidade: number; // 1=Pequena, 2=Média, 3=Grande
  plano: string;
  lockAt?: string | null;
  urlArquivoOriginal?: string;
  tempoEmFilaMinutos?: number;
  tempoRestanteSlaMinutos?: number;
  faixaPrioridade?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConciergeService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/concierge/solicitacoes';

  listarFila(): Observable<ConciergeRequest[]> {
    return this.http.get<ConciergeRequest[]>(`${this.apiUrl}/fila`);
  }

  assumir(id: string, atendenteId: string): Observable<ConciergeRequest> {
    const params = new HttpParams().set('atendenteId', atendenteId);
    return this.http.patch<ConciergeRequest>(`${this.apiUrl}/${id}/assumir`, null, { params });
  }

  concluir(id: string, atendenteId: string, observacoes?: string): Observable<ConciergeRequest> {
    let params = new HttpParams().set('atendenteId', atendenteId);
    if (observacoes) {
      params = params.set('observacoes', observacoes);
    }
    return this.http.patch<ConciergeRequest>(`${this.apiUrl}/${id}/concluir`, null, { params });
  }

  aprovar(id: string, gestorId: string): Observable<ConciergeRequest> {
    const params = new HttpParams().set('gestorId', gestorId);
    return this.http.patch<ConciergeRequest>(`${this.apiUrl}/${id}/aprovar`, null, { params });
  }

  criar(
    supermercadoId: string,
    titulo: string,
    observacoes: string,
    complexidade: number,
    file: File
  ): Observable<ConciergeRequest> {
    const formData = new FormData();
    formData.append('supermercadoId', supermercadoId);
    formData.append('titulo', titulo);
    formData.append('observacoes', observacoes);
    formData.append('complexidade', complexidade.toString());
    formData.append('file', file);

    return this.http.post<ConciergeRequest>(this.apiUrl, formData);
  }
}
