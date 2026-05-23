import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LocalFavorito,
  LocalFavoritoRequest,
  PreferenciaProduto,
  PreferenciaProdutoRequest
} from '../models/cliente-preferencias.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly baseUrl = '/api/v1/clientes/me';
  private http = inject(HttpClient);

  // ===== LOCAIS FAVORITOS =====

  getLocais(): Observable<LocalFavorito[]> {
    return this.http.get<LocalFavorito[]>(`${this.baseUrl}/locais`);
  }

  salvarLocal(req: LocalFavoritoRequest): Observable<LocalFavorito> {
    return this.http.post<LocalFavorito>(`${this.baseUrl}/locais`, req);
  }

  removerLocal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/locais/${id}`);
  }

  ativarLocal(id: string): Observable<LocalFavorito> {
    return this.http.patch<LocalFavorito>(`${this.baseUrl}/locais/${id}/ativar`, {});
  }

  // ===== PREFERÊNCIAS DE PRODUTO =====

  getPreferencias(): Observable<PreferenciaProduto[]> {
    return this.http.get<PreferenciaProduto[]>(`${this.baseUrl}/preferencias`);
  }

  salvarPreferencia(req: PreferenciaProdutoRequest): Observable<PreferenciaProduto> {
    return this.http.post<PreferenciaProduto>(`${this.baseUrl}/preferencias`, req);
  }

  removerPreferencia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/preferencias/${id}`);
  }
}
