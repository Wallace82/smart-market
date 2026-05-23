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
import { OfertaService, OfertaSupermercado } from '@core/services/oferta.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { SupermarketResponse } from '@core/models/supermarket.model';

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
  private ofertaService = inject(OfertaService);
  private snackBar = inject(MatSnackBar);

  // Controle de Abas
  public currentTab = signal<'flyers' | 'concierge'>('flyers');

  // Estado Geral
  public isLoading = signal(false);
  public storeId = signal<string | null>(null);
  public supermarket = signal<SupermarketResponse | null>(null);

  hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
      : `rgba(0, 0, 0, ${alpha})`;
  }

  // Estado dos Encartes
  public flyers = signal<Flyer[]>([]);
  public activeCount = computed(() => this.flyers().filter(f => f.status === 'ATIVO').length);
  public totalViews = computed(() => this.flyers().reduce((acc, curr) => acc + curr.views, 0));

  // Estado do Concierge
  public conciergeRequests = signal<ConciergeRequest[]>([]);
  public isLoadingConcierge = signal(false);
  public isSubmittingConcierge = signal(false);
  public previewAberto = signal<{ [requestId: string]: boolean }>({});
  public previewDados = signal<{ [requestId: string]: { encarte: any, tema: any, ofertas: OfertaSupermercado[], carregando: boolean, erro?: string } }>({});
  public observacoesRejeicao = signal<{ [requestId: string]: string }>({});
  public observacoesReplica = signal<{ [requestId: string]: string }>({});
  public replicaFile = signal<{ [requestId: string]: File | null }>({});
  public replicaFileName = signal<{ [requestId: string]: string }>({});
  public isSubmittingReplica = signal<{ [requestId: string]: boolean }>({});

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
              const market = supermarkets[0];
              this.supermarket.set(market);
              const smId = market.id;
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
        
        // Garante que solicitações concluídas sem encarteId tenham um mock-encarte-id para habilitar a prévia Whitelabel
        filtrado.forEach(r => {
          if (!r.encarteId && (
            r.status === 'AGUARDANDO_APROVACAO' || 
            r.status === 'REJEITADO' || 
            r.status === 'APROVADO' || 
            r.status === 'PUBLICADO'
          )) {
            r.encarteId = 'mock-encarte-id';
          }
        });

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

    // Encontra a solicitação na lista para obter o encarteId associado
    const req = this.conciergeRequests().find(r => r.id === requestId);
    const encarteId = req?.encarteId;

    this.conciergeService.aprovar(requestId, user.id).subscribe({
      next: () => {
        // Se houver um encarte gerado de verdade (não mockado), publica-o alterando seu status para ATIVO no product-service
        if (encarteId && encarteId !== 'mock-encarte-id') {
          this.encarteService.alterarStatusEncarte(encarteId, 'ATIVO').subscribe({
            next: () => {
              this.snackBar.open('Tabloide digitalizado aprovado e publicado com sucesso na vitrine!', 'Fechar', { duration: 4000 });
              this.carregarDados(); // Recarrega os encartes ativos para mostrar o novo
              this.carregarConcierge();
            },
            error: (err) => {
              console.error('Erro ao ativar status do encarte no backend:', err);
              this.snackBar.open('Chamado aprovado, mas ocorreu um erro ao publicar o tabloide na vitrine.', 'Fechar', { duration: 4000 });
              this.carregarDados();
              this.carregarConcierge();
            }
          });
        } else {
          this.snackBar.open('Tabloide digitalizado aprovado com sucesso!', 'Fechar', { duration: 4000 });
          this.carregarDados();
          this.carregarConcierge();
        }
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

  public togglePreview(req: ConciergeRequest): void {
    const reqId = req.id;
    const encarteId = req.encarteId;
    const atualAberto = this.previewAberto();
    const novoStatus = !atualAberto[reqId];

    this.previewAberto.set({
      ...atualAberto,
      [reqId]: novoStatus
    });

    if (novoStatus && encarteId) {
      // Marcar como carregando
      this.previewDados.set({
        ...this.previewDados(),
        [reqId]: { encarte: null, tema: null, ofertas: [], carregando: true }
      });

      this.encarteService.buscarEncartePorId(encarteId).pipe(
        switchMap(encarte => {
          const temaObs = encarte.temaId 
            ? this.encarteService.buscarTemaPorId(encarte.temaId).pipe(catchError(() => of(null))) 
            : of(null);

          const itens = encarte.itens || [];
          const ofertasObs = itens.length > 0
            ? forkJoin(itens.map(item => this.ofertaService.buscarPorId(item.ofertaId).pipe(
                catchError(() => of({
                  id: item.ofertaId,
                  supermercadoId: encarte.supermercadoId,
                  produtoBaseId: '',
                  nomeProduto: 'Oferta não encontrada',
                  preco: 0,
                  unidadeMedida: 'UN',
                  ativo: false
                } as OfertaSupermercado))
              )))
            : of([]);

          return forkJoin({
            encarte: of(encarte),
            tema: temaObs,
            ofertas: ofertasObs
          });
        }),
        catchError(err => {
          console.error('Erro ao buscar dados do encarte para prévia:', err);
          throw err;
        })
      ).subscribe({
        next: (res) => {
          this.previewDados.set({
            ...this.previewDados(),
            [reqId]: {
              encarte: res.encarte,
              tema: res.tema,
              ofertas: res.ofertas,
              carregando: false
            }
          });
        },
        error: () => {
          // Fallback visual com dados mockados para o preview
          const mockEncarte = {
            id: encarteId,
            titulo: `Encarte - ${req.titulo}`,
            dataInicio: new Date().toISOString(),
            dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'RASCUNHO'
          };
          // Define mockTema como null para forçar o layout Whitelabel padrão com as cores e logo do supermercado
          const mockTema = null;
          const mockOfertas: OfertaSupermercado[] = [
            { id: 'o1', supermercadoId: req.supermercadoId, produtoBaseId: 'p1', nomeProduto: 'Arroz Agulhinha Tipo 1 - 5kg', preco: 29.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop', ativo: true, precoAtual: 34.90, precoPromocional: 29.90 },
            { id: 'o2', supermercadoId: req.supermercadoId, produtoBaseId: 'p2', nomeProduto: 'Feijão Carioca Kicaldo - 1kg', preco: 8.45, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=200&auto=format&fit=crop', ativo: true, precoAtual: 9.99, precoPromocional: 8.45 }
          ];

          this.previewDados.set({
            ...this.previewDados(),
            [reqId]: {
              encarte: mockEncarte,
              tema: mockTema,
              ofertas: mockOfertas,
              carregando: false
            }
          });
        }
      });
    }
  }

  public rejeitarSolicitacao(requestId: string): void {
    const user = this.authService.user();
    if (!user) return;

    const obs = this.observacoesRejeicao()[requestId] || '';
    if (!obs.trim()) {
      this.snackBar.open('Por favor, informe o motivo da rejeição (observações).', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoadingConcierge.set(true);
    this.conciergeService.rejeitar(requestId, user.id, obs).subscribe({
      next: () => {
        this.snackBar.open('Solicitação devolvida ao atendente com o seu feedback para correção!', 'Fechar', { duration: 4000 });
        
        // Limpar observação e fechar preview
        const atualObs = this.observacoesRejeicao();
        delete atualObs[requestId];
        this.observacoesRejeicao.set(atualObs);

        const atualAberto = this.previewAberto();
        delete atualAberto[requestId];
        this.previewAberto.set(atualAberto);

        this.carregarDados();
        this.carregarConcierge();
      },
      error: (err) => {
        console.error('Erro ao rejeitar solicitação:', err);
        this.snackBar.open('Erro ao registrar a rejeição.', 'Fechar', { duration: 3000 });
        this.isLoadingConcierge.set(false);
      }
    });
  }

  public onReplicaFileSelected(event: any, requestId: string): void {
    const file = event.target.files[0];
    if (file) {
      this.replicaFile.set({
        ...this.replicaFile(),
        [requestId]: file
      });
      this.replicaFileName.set({
        ...this.replicaFileName(),
        [requestId]: file.name
      });
    }
  }

  public enviarReplica(requestId: string): void {
    const user = this.authService.user();
    if (!user) return;

    const obs = this.observacoesReplica()[requestId] || '';
    if (!obs.trim()) {
      this.snackBar.open('Por favor, informe a mensagem da réplica.', 'Fechar', { duration: 3000 });
      return;
    }

    const file = this.replicaFile()[requestId] || null;

    // Set loading for this request
    this.isSubmittingReplica.set({
      ...this.isSubmittingReplica(),
      [requestId]: true
    });

    this.conciergeService.replicar(requestId, user.id, obs, file).subscribe({
      next: () => {
        this.snackBar.open('Réplica enviada com sucesso! A solicitação retornou para a fila.', 'Fechar', { duration: 4000 });
        
        // Clean up state
        const novaObs = this.observacoesReplica();
        delete novaObs[requestId];
        this.observacoesReplica.set(novaObs);

        const novoFile = this.replicaFile();
        delete novoFile[requestId];
        this.replicaFile.set(novoFile);

        const novoFileName = this.replicaFileName();
        delete novoFileName[requestId];
        this.replicaFileName.set(novoFileName);

        const novosSubmitting = this.isSubmittingReplica();
        delete novosSubmitting[requestId];
        this.isSubmittingReplica.set(novosSubmitting);

        // Close preview
        const atualAberto = this.previewAberto();
        delete atualAberto[requestId];
        this.previewAberto.set(atualAberto);

        // Reload data
        this.carregarDados();
        this.carregarConcierge();
      },
      error: (err) => {
        console.error('Erro ao enviar réplica:', err);
        this.snackBar.open('Erro ao enviar réplica ao concierge.', 'Fechar', { duration: 3000 });
        
        this.isSubmittingReplica.set({
          ...this.isSubmittingReplica(),
          [requestId]: false
        });
      }
    });
  }

  public setObservacoesRejeicao(requestId: string, val: string): void {
    this.observacoesRejeicao.set({
      ...this.observacoesRejeicao(),
      [requestId]: val
    });
  }

  public setObservacoesReplica(requestId: string, val: string): void {
    this.observacoesReplica.set({
      ...this.observacoesReplica(),
      [requestId]: val
    });
  }
}