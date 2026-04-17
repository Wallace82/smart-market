import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EncarteDigital } from '@core/models/encarte.model';

@Injectable({
  providedIn: 'root'
})
export class EncarteService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/encartes'; // O proxy irá redirecionar para o backend

  getEncartesByGestor(): Observable<EncarteDigital[]> {
    // Em um cenário real, a chamada HTTP seria:
    // return this.http.get<EncarteDigital[]>(`${this.apiUrl}/gestor`);

    // Para que a aplicação compile e funcione, estou retornando dados mocados.
    const mockEncartes: EncarteDigital[] = [
      {
        id: 'enc-uuid-1',
        supermercadoId: 'sup-uuid-1',
        temaId: 'tema-natal-2025',
        titulo: 'Ofertas de Natal',
        dataInicio: '2025-12-10T00:00:00Z',
        dataFim: '2025-12-24T23:59:59Z',
        status: 'ATIVO',
        criadoEm: '2025-11-20T10:00:00Z',
        atualizadoEm: '2025-11-20T10:00:00Z',
        itens: []
      },
      {
        id: 'enc-uuid-2',
        supermercadoId: 'sup-uuid-1',
        titulo: 'Esquenta Black Friday (Rascunho)',
        dataInicio: '2025-11-01T00:00:00Z',
        dataFim: '2025-11-28T23:59:59Z',
        status: 'RASCUNHO',
        criadoEm: '2025-10-15T14:30:00Z',
        atualizadoEm: '2025-10-15T14:30:00Z',
        itens: []
      }
    ];
    return of(mockEncartes);
  }

  // Aqui entrariam os métodos create, update, delete, etc.
}