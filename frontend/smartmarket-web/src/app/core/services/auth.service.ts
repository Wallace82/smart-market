import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/v1/auth';
  
  // Usando Signals para estado reativo do usuário
  private _user = signal<User | null>(null);
  user = computed(() => this._user());
  
  constructor(private http: HttpClient) {
    this.carregarUsuarioDoStorage();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.decodificarToken(response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._user.set(null);
  }

  isLoggedIn(): boolean {
    return !!this._user();
  }

  private carregarUsuarioDoStorage(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodificarToken(token);
    }
  }

  private decodificarToken(token: string): void {
    try {
      // Simulação simples de decodificação de JWT
      // Em produção, usar uma lib como jwt-decode
      const payload = JSON.parse(atob(token.split('.')[1]));
      this._user.set({
        id: payload.userId || payload.sub,
        email: payload.email,
        roles: payload.roles || []
      });
    } catch (e) {
      console.error('Erro ao decodificar token', e);
      this.logout();
    }
  }
}
