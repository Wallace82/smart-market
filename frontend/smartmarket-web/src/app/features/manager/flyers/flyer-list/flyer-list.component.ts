import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { EncarteService } from '@core/services/encarte.service';
import { AuthService } from '@core/services/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';
import { EncarteDigitalResponse } from '@core/models/encarte.model';
import { SupermarketResponse } from '@core/models/supermarket.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatDividerModule // <-- CORREÇÃO: Módulo importado para resolver o erro NG8001
  ],
  templateUrl: './flyer-list.component.html',
  styleUrl: './flyer-list.component.scss'
})
export class FlyerListComponent implements OnInit {
  encartes = signal<EncarteDigitalResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  supermarket = signal<SupermarketResponse | null>(null);

  displayedColumns: string[] = ['titulo', 'dataInicio', 'dataFim', 'status', 'acoes'];

  constructor(
    private encarteService: EncarteService,
    private authService: AuthService,
    private supermarketService: SupermarketService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEncartes();
  }

  carregarEncartes(): void {
    this.loading.set(true);
    const user = this.authService.user();

    if (!user || !user.id) {
      this.error.set('Usuário não autenticado ou ID do gestor não encontrado.');
      this.loading.set(false);
      return;
    }

    this.supermarketService.buscarPorGestor(user.id).subscribe({
      next: (markets: SupermarketResponse[]) => {
        if (markets && markets.length > 0) {
          this.supermarket.set(markets[0]);
          this.encarteService.listarEncartes(markets[0].id).subscribe({
            next: (encartesData: EncarteDigitalResponse[]) => {
              this.encartes.set(encartesData);
              this.loading.set(false);
            },
            error: (err: any) => {
              this.error.set('Erro ao carregar encartes: ' + (err.message || err));
              this.loading.set(false);
              this.snackBar.open('Erro ao carregar encartes.', 'Fechar', { duration: 3000 });
            }
          });
        } else {
          this.error.set('Nenhum supermercado associado a este gestor.');
          this.loading.set(false);
        }
      },
      error: (err: any) => {
        this.error.set('Erro ao buscar supermercado do gestor: ' + (err.message || err));
        this.loading.set(false);
        this.snackBar.open('Erro ao buscar supermercado.', 'Fechar', { duration: 3000 });
      }
    });
  }

  editarEncarte(id: string): void {
    this.router.navigate(['/manager/flyers/edit', id]);
  }

  alterarStatus(id: string, novoStatus: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO' | 'EXPIRADO'): void {
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'PUBLICADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'RASCUNHO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ARQUIVADO':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EXPIRADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PUBLICADO': return 'Publicado';
      case 'RASCUNHO': return 'Rascunho';
      case 'ARQUIVADO': return 'Arquivado';
      case 'EXPIRADO': return 'Expirado';
      default: return status;
    }
  }
}
