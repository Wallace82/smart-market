import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductBaseResponse } from '@core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductBaseService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/admin/catalog'; // Ajustado conforme arquitetura admin

  listarTodos(page = 0, size = 20, search?: string): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (search) params = params.set('search', search);
    return this.http.get<any>(this.apiUrl, { params });
  }

  salvar(produto: Partial<ProductBaseResponse>): Observable<ProductBaseResponse> {
    if (produto.id) {
      return this.http.put<ProductBaseResponse>(`${this.apiUrl}/${produto.id}`, produto);
    }
    return this.http.post<ProductBaseResponse>(this.apiUrl, produto);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
