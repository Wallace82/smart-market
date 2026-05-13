import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {
  private http = inject(HttpClient);

  buscarCep(cep: string): Observable<any> {
    const cleanCep = cep.replace(/\D/g, '');
    return this.http.get(`/external/cep/${cleanCep}/json/`);
  }

  buscarCnpj(cnpj: string): Observable<any> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    return this.http.get(`/external/cnpj/${cleanCnpj}`);
  }
}
