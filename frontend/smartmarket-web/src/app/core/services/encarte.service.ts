import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemaEncarteRequest, TemaEncarteResponse, EncarteDigitalRequest, EncarteDigitalResponse } from '../models/encarte.model';

@Injectable({
  providedIn: 'root'
})
export class EncarteService {
  private readonly temasUrl = '/api/v1/temas-encarte';
  private readonly encartesUrl = '/api/v1/encartes';

  constructor(private http: HttpClient) {}

  // Temas de Encarte
  cadastrarTema(request: TemaEncarteRequest): Observable<TemaEncarteResponse> {
    return this.http.post<TemaEncarteResponse>(this.temasUrl, request);
  }

  atualizarTema(id: string, request: TemaEncarteRequest): Observable<TemaEncarteResponse> {
    return this.http.put<TemaEncarteResponse>(`${this.temasUrl}/${id}`, request);
  }

  listarTemas(): Observable<TemaEncarteResponse[]> {
    return this.http.get<TemaEncarteResponse[]>(this.temasUrl);
  }

  buscarTemaPorId(id: string): Observable<TemaEncarteResponse> {
    return this.http.get<TemaEncarteResponse>(`${this.temasUrl}/${id}`);
  }

  uploadTemaBackground(id: string, file: File): Observable<TemaEncarteResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<TemaEncarteResponse>(`${this.temasUrl}/${id}/upload-background`, formData);
  }

  // Encartes Digitais
  criarEncarte(request: EncarteDigitalRequest): Observable<EncarteDigitalResponse> {
    return this.http.post<EncarteDigitalResponse>(this.encartesUrl, request);
  }

  atualizarEncarte(id: string, request: EncarteDigitalRequest): Observable<EncarteDigitalResponse> {
    return this.http.put<EncarteDigitalResponse>(`${this.encartesUrl}/${id}`, request);
  }

  listarEncartes(supermercadoId?: string): Observable<EncarteDigitalResponse[]> {
    let params = new HttpParams();
    if (supermercadoId) {
      params = params.set('supermercadoId', supermercadoId);
    }
    return this.http.get<EncarteDigitalResponse[]>(this.encartesUrl, { params });
  }

  buscarEncartePorId(id: string): Observable<EncarteDigitalResponse> {
    return this.http.get<EncarteDigitalResponse>(`${this.encartesUrl}/${id}`);
  }

  alterarStatusEncarte(id: string, status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO' | 'EXPIRADO'): Observable<EncarteDigitalResponse> {
    return this.http.patch<EncarteDigitalResponse>(`${this.encartesUrl}/${id}/status`, null, {
      params: { status }
    });
  }
}
