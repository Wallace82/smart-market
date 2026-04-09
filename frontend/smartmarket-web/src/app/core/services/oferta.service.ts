import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OfertaSupermercado {
  id: string;
  supermercadoId: string;
  produtoBaseId: string;
  nomeProduto: string; // Incluído para facilidade no frontend
  preco: number;
  unidadeMedida: string;
  urlImagem?: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private readonly apiUrl = '/api/v1/ofertas';

  constructor(private http: HttpClient) {}

  buscarPorSupermercado(supermercadoId: string): Observable<OfertaSupermercado[]> {
    const params = new HttpParams().set('supermercadoId', supermercadoId);
    return this.http.get<OfertaSupermercado[]>(this.apiUrl, { params });
  }

  buscarPorId(id: string): Observable<OfertaSupermercado> {
    return this.http.get<OfertaSupermercado>(`${this.apiUrl}/${id}`);
  }
}
