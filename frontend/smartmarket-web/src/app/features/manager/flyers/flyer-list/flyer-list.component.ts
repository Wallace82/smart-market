import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@core/auth/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';
import { EncarteService } from '@core/services/encarte.service';
import { ConciergeService, ConciergeRequest } from '@core/services/concierge.service';

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
    FormsModule,
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
  private conciergeService = inject(ConciergeService);
  private snackBar = inject(MatSnackBar);

  // Controle de Abas
  public currentTab = signal<'flyers' | 'concierge'>('flyers');

  // Estado Geral
  public isLoading = signal(false);
  public storeId = signal<string | null>(null);

  // Estado dos Encartes
  public flyers = signal<Flyer[]>([]);
  public activeCount = computed(() => this.flyers().filter(f => f.status === 'ATIVO').length);
  public totalViews = computed(() => this.flyers().reduce((acc, curr) => acc + curr.views, 0));

  // Estado do Concierge
  public conciergeRequests = signal<ConciergeRequest[]>([]);
  public isLoadingConcierge = signal(false);
  public isSubmittingConcierge = signal(false);

  // Formulário de Nova Solicitação do Concierge
  public newRequestTitle = signal('');
  public newRequestObs = signal('');
  public newRequestComplexity = signal(1); // 1 = Pequena, 2 = Média, 3 = Grande
  public selectedFile = signal<File | null>(null);
  public selectedFileName = signal('');

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
              this.storeId.set(smId);
              
              // Carregar solicitações do Concierge vinculadas a esta loja
              this.carregarConcierge();

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

  // ==========================================================
  // Métodos da Fila do Concierge (Para o Supermercado)
  // ==========================================================

  public carregarConcierge(): void {
    const smId = this.storeId();
    if (!smId) return;

    this.isLoadingConcierge.set(true);
    this.conciergeService.listarFila().subscribe({
      next: (reqs) => {
        // Filtrar solicitações pertencentes a esta loja específica
        const filtrado = reqs.filter(r => r.supermercadoId === smId);
        // Ordena por data de criação decrescente
        filtrado.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
        this.conciergeRequests.set(filtrado);
        this.isLoadingConcierge.set(false);
      },
      error: (err) => {
        console.error('Erro ao listar solicitações de concierge:', err);
        this.isLoadingConcierge.set(false);
      }
    });
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.selectedFileName.set(file.name);
    }
  }

  public criarSolicitacao(): void {
    const smId = this.storeId();
    const titulo = this.newRequestTitle().trim();
    const obs = this.newRequestObs().trim();
    const complexidade = this.newRequestComplexity();
    const file = this.selectedFile();

    if (!smId) {
      this.snackBar.open('Supermercado não identificado.', 'Fechar', { duration: 3000 });
      return;
    }
    if (!titulo) {
      this.snackBar.open('Por favor, informe o título da solicitação.', 'Fechar', { duration: 3000 });
      return;
    }
    if (!file) {
      this.snackBar.open('Por favor, faça upload de um arquivo PDF/Imagem com a listagem de ofertas.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isSubmittingConcierge.set(true);
    this.conciergeService.criar(smId, titulo, obs, complexidade, file).subscribe({
      next: () => {
        this.snackBar.open('Solicitação enviada ao Concierge com sucesso! Entrou em fila.', 'Fechar', { duration: 4000 });
        
        // Limpar formulário
        this.newRequestTitle.set('');
        this.newRequestObs.set('');
        this.newRequestComplexity.set(1);
        this.selectedFile.set(null);
        this.selectedFileName.set('');
        
        this.isSubmittingConcierge.set(false);
        this.carregarConcierge();
      },
      error: (err) => {
        console.error('Erro ao criar solicitação de concierge:', err);
        this.snackBar.open('Erro ao enviar solicitação ao concierge.', 'Fechar', { duration: 3000 });
        this.isSubmittingConcierge.set(false);
      }
    });
  }

  public aprovarSolicitacao(requestId: string): void {
    const user = this.authService.user();
    if (!user) return;

    this.isLoadingConcierge.set(true);
    this.conciergeService.aprovar(requestId, user.id).subscribe({
      next: () => {
        this.snackBar.open('Tabloide digitalizado aprovado e publicado com sucesso!', 'Fechar', { duration: 4000 });
        this.carregarDados(); // Recarrega os encartes ativos para mostrar o novo
        this.carregarConcierge();
      },
      error: (err) => {
        console.error('Erro ao aprovar solicitação:', err);
        this.snackBar.open('Erro ao aprovar a digitalização.', 'Fechar', { duration: 3000 });
        this.isLoadingConcierge.set(false);
      }
    });
  }

  public getStatusText(status: string): string {
    switch (status) {
      case 'PENDENTE': return '⏳ Em Fila (Pendente)';
      case 'EM_PROCESSAMENTO': return '⚙️ Em Digitalização';
      case 'AGUARDANDO_APROVACAO': return '👁️ Aguardando Sua Aprovação';
      case 'APROVADO':
      case 'PUBLICADO': return '✅ Publicado / Concluído';
      case 'REJEITADO': return '❌ Rejeitado';
      default: return status;
    }
  }

  public getComplexityText(comp: number): string {
    if (comp === 1) return 'Pequena (1)';
    if (comp === 2) return 'Média (2)';
    if (comp === 3) return 'Grande (3)';
    return 'Padrão (1)';
  }

  public formatDateTime(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    } catch {
      return dateStr;
    }
  }
}