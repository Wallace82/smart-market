import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
 
export interface OfertaSupermercado {
  id: string;
  supermercadoId: string;
  produtoBaseId: string;
  nomeProduto: string;
  preco: number;
  unidadeMedida: string;
  urlImagem?: string;
  ativo: boolean;
 
  // Rich backend representation
  produtoBase?: {
    id: string;
    nome: string;
    descricao?: string;
    marca?: string;
    urlImagem?: string;
    unidadeMedida?: string;
    categoriaId?: string;
  };
  precoAtual?: number;
  precoPromocional?: number;
  dataInicioPromocao?: string;
  dataFimPromocao?: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private readonly apiUrl = '/api/v1/ofertas';
  private http = inject(HttpClient);
 
  buscarPorSupermercado(supermercadoId: string): Observable<OfertaSupermercado[]> {
    const params = new HttpParams().set('supermercadoId', supermercadoId);
    return this.http.get<OfertaSupermercado[]>(this.apiUrl, { params }).pipe(
      map(ofertas => ofertas.map(o => this.mapearOferta(o)))
    );
  }
 
  buscarPorId(id: string): Observable<OfertaSupermercado> {
    return this.http.get<OfertaSupermercado>(`${this.apiUrl}/${id}`).pipe(
      map(o => this.mapearOferta(o))
    );
  }
 
  criar(supermercadoId: string, produtoBaseId: string, oferta: {
    precoAtual: number;
    precoPromocional: number;
    dataInicioPromocao: string;
    dataFimPromocao: string;
  }): Observable<OfertaSupermercado> {
    return this.http.post<any>(
      `${this.apiUrl}/supermercado/${supermercadoId}/produto/${produtoBaseId}`,
      oferta
    ).pipe(map(o => this.mapearOferta(o)));
  }
 
  atualizar(id: string, produtoBaseId: string, oferta: {
    precoAtual: number;
    precoPromocional: number;
    dataInicioPromocao: string;
    dataFimPromocao: string;
    ativo: boolean;
  }): Observable<OfertaSupermercado> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}/produto/${produtoBaseId}`,
      oferta
    ).pipe(map(o => this.mapearOferta(o)));
  }
 
  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
 
  private mapearOferta(o: any): OfertaSupermercado {
    const precoEfetivo = o.preco !== undefined ? o.preco : 
      (o.precoPromocional !== null && o.precoPromocional !== undefined ? o.precoPromocional : o.precoAtual);
      
    return {
      ...o,
      nomeProduto: o.nomeProduto || o.produtoBase?.nome || 'Produto Sem Nome',
      preco: precoEfetivo || 0.0,
      urlImagem: o.urlImagem || o.produtoBase?.urlImagem || '',
      unidadeMedida: o.unidadeMedida || o.produtoBase?.unidadeMedida || 'UN',
      ativo: o.ativo !== undefined ? o.ativo : true
    };
  }
}
