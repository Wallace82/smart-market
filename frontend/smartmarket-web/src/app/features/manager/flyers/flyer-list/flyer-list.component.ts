import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { EncarteService } from '@core/services/encarte.service';
import { AuthService } from '@core/services/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';
import { EncarteDigital } from '@core/models/encarte.model'; // Usando EncarteDigital diretamente
import { SupermarketResponse } from '@core/models/supermarket.model'; // Nova interface
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip'; // Módulo MatTooltip
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-flyer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule // <-- CORREÇÃO: Módulo de tooltip que estava faltando
  ],
  templateUrl: './flyer-list.component.html',
  styleUrl: './flyer-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // MELHORIA: Adicionando ChangeDetection
})
export class FlyerListComponent implements OnInit {
  encartes = signal<EncarteDigital[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  supermarket = signal<SupermarketResponse | null>(null);

  displayedColumns: string[] = ['titulo', 'dataInicio', 'dataFim', 'status', 'acoes'];

  // MELHORIA: Usando inject() para consistência em componentes standalone
  private readonly encarteService = inject(EncarteService);
  private readonly authService = inject(AuthService);
  private readonly supermarketService = inject(SupermarketService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.carregarEncartes();
  }

  carregarEncartes(): void {
    this.loading.set(true);
    this.error.set(null);
    const user = this.authService.user();

    if (!user || !user.id) {
      this.error.set('Usuário não autenticado ou ID do gestor não encontrado.');
      this.loading.set(false);
      return;
    }
    // MELHORIA: Refatoração com switchMap para evitar nested subscriptions
    this.supermarketService.buscarPorGestor(user.id).pipe(
      tap((markets: SupermarketResponse[]) => {
        if (!markets || markets.length === 0) {
          throw new Error('Nenhum supermercado associado a este gestor.');
        }
        this.supermarket.set(markets[0]); // Assume o primeiro supermercado
      }),
      switchMap((markets: SupermarketResponse[]) => {
        return this.encarteService.listarEncartes(markets[0].id);
      }),
      catchError((err: any) => {
        const errorMessage = err.message || 'Erro desconhecido ao carregar dados.';
        this.error.set('Erro ao carregar encartes: ' + errorMessage);
        this.snackBar.open('Erro ao carregar encartes.', 'Fechar', { duration: 3000 });
        return of([]); // Retorna um observable vazio para que a subscription principal não quebre
      })
    ).subscribe({
      next: (encartesData: EncarteDigital[]) => {
        this.encartes.set(encartesData);
        this.loading.set(false);
      }
    });
  }

  editarEncarte(id: string): void {
    this.router.navigate(['/manager/flyers/edit', id]);
  }

  alterarStatus(id: string, novoStatus: EncarteDigital['status']): void { // MELHORIA: Tipagem mais precisa
    this.encarteService.alterarStatusEncarte(id, novoStatus).subscribe({
      next: () => {
        this.snackBar.open(`Status do encarte alterado para ${novoStatus}!`, 'Fechar', { duration: 3000 });
        this.carregarEncartes();
      },
      error: (err: any) => {
        this.snackBar.open('Erro ao alterar status: ' + (err.message || err), 'Fechar', { duration: 3000 });
      }
    });
  }

  visualizarEncarte(id: string): void {
    this.router.navigate(['/client/flyers', id]);
  }

  getStatusClass(status: EncarteDigital['status']): string { // MELHORIA: Tipagem mais precisa
    switch (status) {
      case 'PUBLICADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'RASCUNHO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ARQUIVADO':
        return 'bg-blue-100 text-blue-800 border-blue-200'; // MELHORIA: Cor para arquivado
      case 'EXPIRADO': // Correção: Voltando para EXPIRADO conforme tipagem
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusLabel(status: string): string {
    switch (status as EncarteDigital['status']) { // MELHORIA: Cast para tipagem
      case 'PUBLICADO': return 'Publicado';
      case 'RASCUNHO': return 'Rascunho';
      case 'ARQUIVADO': return 'Arquivado';
      case 'EXPIRADO': return 'Expirado'; // Correção: Voltando para EXPIRADO
      default: return status;
    }
  }
}
