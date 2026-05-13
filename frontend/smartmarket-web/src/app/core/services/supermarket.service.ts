import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupermarketRequest, SupermarketResponse, FilialRequest, FilialResponse } from '../models/supermarket.model';

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {
  private readonly apiUrl = '/api/v1/supermercados';

  constructor(private http: HttpClient) {}

  cadastrar(request: SupermarketRequest): Observable<SupermarketResponse> {
    return this.http.post<SupermarketResponse>(this.apiUrl, request);
  }

  atualizar(id: string, request: SupermarketRequest): Observable<SupermarketResponse> {
    return this.http.put<SupermarketResponse>(`${this.apiUrl}/${id}`, request);
  }

  uploadLogomarca(id: string, file: File): Observable<SupermarketResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<SupermarketResponse>(`${this.apiUrl}/${id}/upload-logomarca`, formData);
  }

  listarTodos(page = 0, size = 20): Observable<SupermarketResponse[]> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<SupermarketResponse[]>(this.apiUrl, { params });
  }

  buscarPorId(id: string): Observable<SupermarketResponse> {
    return this.http.get<SupermarketResponse>(`${this.apiUrl}/${id}`);
  }

  buscarPorGestor(gestorId: string): Observable<SupermarketResponse[]> {
    return this.http.get<SupermarketResponse[]>(`${this.apiUrl}/gestor/${gestorId}`);
  }

  alterarStatus(id: string, status: 'PENDENTE' | 'ATIVO' | 'INATIVO'): Observable<SupermarketResponse> {
    return this.http.patch<SupermarketResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Métodos Públicos (Vitrine)
  listarProximos(lat: number, lng: number, raio: number = 3000): Observable<SupermarketResponse[]> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lng.toString())
      .set('radiusMeters', raio.toString());
    return this.http.get<SupermarketResponse[]>(`${this.apiUrl}/public/nearby`, { params });
  }

  // Métodos de Filiais
  listarFiliais(supermercadoId: string): Observable<FilialResponse[]> {
    return this.http.get<FilialResponse[]>(`/api/v1/filiais/supermercado/${supermercadoId}`);
  }

  cadastrarFilial(request: FilialRequest): Observable<FilialResponse> {
    return this.http.post<FilialResponse>(`/api/v1/filiais`, request);
  }

  atualizarFilial(id: string, request: FilialRequest): Observable<FilialResponse> {
    return this.http.put<FilialResponse>(`/api/v1/filiais/${id}`, request);
  }

  deletarFilial(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/filiais/${id}`);
  }
}

