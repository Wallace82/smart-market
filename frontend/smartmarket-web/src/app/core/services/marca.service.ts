import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MarcaResponse } from '@core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/marcas';

  listar(): Observable<MarcaResponse[]> {
    return this.http.get<MarcaResponse[]>(this.apiUrl);
  }
}
