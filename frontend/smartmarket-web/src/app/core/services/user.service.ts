import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UserResponse } from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/users';

  listarTodos(page = 0, size = 20): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  alterarStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  buscarPorId(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }
}
