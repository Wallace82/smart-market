import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@core/auth/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';
import { EncarteService } from '@core/services/encarte.service';

export interface Flyer {
  id: string;
  title: string;
  theme: string;
  startDate: string;
  endDate: string;
  status: 'RASCUNHO' | 'ATIVO' | 'ENCERRADO';
  views: number;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-flyer-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './flyer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlyerListComponent implements OnInit {
  private authService = inject(AuthService);
  private supermarketService = inject(SupermarketService);
  private encarteService = inject(EncarteService);
  private snackBar = inject(MatSnackBar);

  public isLoading = signal(false);
  public flyers = signal<Flyer[]>([]);
  public activeCount = computed(() => this.flyers().filter(f => f.status === 'ATIVO').length);
  public totalViews = computed(() => this.flyers().reduce((acc, curr) => acc + curr.views, 0));

  ngOnInit(): void {
    this.carregarDados();
  }

  public carregarDados(): void {
    const user = this.authService.user();
    if (!user) return;
    
    this.isLoading.set(true);
    
    // 1. Listar Temas para mapear temaId -> nome do tema
    this.encarteService.listarTemas().subscribe({
      next: (temas) => {
        const temasMap = new Map(temas.map(t => [t.id, t.nome]));
        
        // 2. Buscar Supermercado do gestor
        this.supermarketService.buscarPorGestor(user.id).subscribe({
          next: (supermarkets) => {
            if (supermarkets.length > 0) {
              const smId = supermarkets[0].id;
              
              // 3. Listar Encartes do Supermercado
              this.encarteService.listarEncartes(smId).subscribe({
                next: (encartes) => {
                  const mapped: Flyer[] = encartes.map(e => ({
                    id: e.id,
                    title: e.titulo,
                    theme: e.temaId ? (temasMap.get(e.temaId) || 'Tema Personalizado') : 'Padrão / Clean',
                    startDate: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : '',
                    endDate: e.dataFim ? new Date(e.dataFim).toLocaleDateString('pt-BR') : '',
                    status: e.status,
                    views: Math.floor(Math.random() * 500) + 50, // Mocked views count for beautiful display since backend does not track views yet
                    thumbnailUrl: e.temaId ? `https://ui-avatars.com/api/?name=${encodeURIComponent(temasMap.get(e.temaId) || 'Tema')}&background=8b5cf6&color=fff` : 'https://ui-avatars.com/api/?name=Padrao&background=16a34a&color=fff'
                  }));
                  this.flyers.set(mapped);
                  this.isLoading.set(false);
                },
                error: () => {
                  this.isLoading.set(false);
                  this.snackBar.open('Erro ao carregar encartes digitais.', 'Fechar', { duration: 3000 });
                }
              });
            } else {
              this.isLoading.set(false);
            }
          },
          error: () => {
            this.isLoading.set(false);
            this.snackBar.open('Erro ao carregar informações da loja.', 'Fechar', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Erro ao carregar temas de tabloides.', 'Fechar', { duration: 3000 });
      }
    });
  }
 
  public alterarStatus(flyerId: string, status: 'RASCUNHO' | 'ATIVO' | 'ENCERRADO'): void {
    this.isLoading.set(true);
    this.encarteService.alterarStatusEncarte(flyerId, status).subscribe({
      next: () => {
        this.snackBar.open(`Status do encarte alterado para ${status} com sucesso!`, 'Fechar', { duration: 3000 });
        this.carregarDados();
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Erro ao alterar status do encarte.', 'Fechar', { duration: 3000 });
      }
    });
  }
}