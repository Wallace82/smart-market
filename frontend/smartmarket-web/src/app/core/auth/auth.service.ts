import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/v1/auth';
  
  // Usando Signals para estado reativo do usuário
  private _user = signal<User | null>(null);
  user = computed(() => this._user());
  private readonly router = inject(Router);
  
  constructor(private http: HttpClient) { // O router é injetado via função inject()
    this.carregarUsuarioDoStorage();
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    // Adapta o payload para o formato que o backend atual espera (usando 'password')
    const payload = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        console.log('Resposta do servidor:', response);
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          this.decodificarToken(response.accessToken);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Limpeza completa
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Verifica se o usuário está autenticado.
   * Utilizado pelo AuthGuard para proteger rotas.
   * @returns `true` se houver um usuário logado, `false` caso contrário.
   */
  isAuthenticated(): boolean {
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
        id: payload.id || payload.userId || payload.sub,
        email: payload.sub || payload.email,
        roles: payload.roles || []
      });
    } catch (e) {
      console.error('Erro ao decodificar token', e);
      this.logout();
    }
  }
}
