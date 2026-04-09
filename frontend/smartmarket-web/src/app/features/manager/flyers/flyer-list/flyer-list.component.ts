import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { EncarteService } from '../../../../core/services/encarte.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SupermarketService } from '../../../../core/services/supermarket.service';
import { EncarteDigitalResponse } from '../../../../core/models/encarte.model';
import { SupermarketResponse } from '../../../../core/models/supermarket.model';

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
    MatMenuModule
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
      next: (markets) => {
        if (markets && markets.length > 0) {
          this.supermarket.set(markets[0]);
          this.encarteService.listarEncartes(markets[0].id).subscribe({
            next: (encartesData) => {
              this.encartes.set(encartesData);
              this.loading.set(false);
            },
            error: (err) => {
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
      error: (err) => {
        this.error.set('Erro ao buscar supermercado do gestor: ' + (err.message || err));
        this.loading.set(false);
        this.snackBar.open('Erro ao buscar supermercado.', 'Fechar', { duration: 3000 });
      }
    });
  }

  editarEncarte(id: string): void {
    // Implementar navegação para um componente de edição de encarte
    // Por enquanto, podemos navegar para a tela de criação com o ID para simular edição
    this.router.navigate(['/manager/flyers/edit', id]);
  }

  alterarStatus(id: string, novoStatus: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO' | 'EXPIRADO'): void {
    this.encarteService.alterarStatusEncarte(id, novoStatus).subscribe({
      next: () => {
        this.snackBar.open(`Status do encarte alterado para ${novoStatus}!`, 'Fechar', { duration: 3000 });
        this.carregarEncartes(); // Recarrega a lista para refletir a mudança
      },
      error: (err) => {
        this.snackBar.open('Erro ao alterar status: ' + (err.message || err), 'Fechar', { duration: 3000 });
      }
    });
  }

  visualizarEncarte(id: string): void {
    // Navegar para a visualização do cliente
    this.router.navigate(['/client/flyers', id]);
  }
}
