import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

// Core
import { ConciergeService, ConciergeRequest } from '@core/services/concierge.service';
import { AuthService } from '@core/auth/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-concierge-fila',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Premium Header Section -->
      <div class="relative bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-700/50 mb-10 overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl"></div>
        
        <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-purple-500/25 text-purple-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/30">Concierge</span>
              <span class="bg-slate-700/50 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Fila Inteligente</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Fila de Atendimento</h1>
            <p class="text-slate-400 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
              Monitore, priorize e gerencie as solicitações enviadas pelos supermercados. Atribua e conclua tarefas cumprindo o SLA contratado.
            </p>
          </div>
          <button (click)="carregarFila()"
                  class="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 py-4 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer">
            <mat-icon class="mr-1">refresh</mat-icon> Atualizar Fila
          </button>
        </div>
      </div>

      <!-- KPI Metrics Dashboard -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Card 1: Total na Fila -->
        <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div class="p-4 bg-purple-50 rounded-2xl text-purple-600">
            <mat-icon class="!text-3xl !w-8 !h-8 flex items-center justify-center">assignment</mat-icon>
          </div>
          <div>
            <span class="text-xs font-bold uppercase text-gray-400">Total na Fila</span>
            <h3 class="text-3xl font-black text-gray-900 leading-none mt-1">{{ totalFila() }}</h3>
          </div>
        </div>

        <!-- Card 2: Aguardando -->
        <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div class="p-4 bg-amber-50 rounded-2xl text-amber-600">
            <mat-icon class="!text-3xl !w-8 !h-8 flex items-center justify-center">hourglass_empty</mat-icon>
          </div>
          <div>
            <span class="text-xs font-bold uppercase text-gray-400">Pendente</span>
            <h3 class="text-3xl font-black text-gray-900 leading-none mt-1">{{ totalPendentes() }}</h3>
          </div>
        </div>

        <!-- Card 3: Meus Atendimentos -->
        <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div class="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <mat-icon class="!text-3xl !w-8 !h-8 flex items-center justify-center">person_pin</mat-icon>
          </div>
          <div>
            <span class="text-xs font-bold uppercase text-gray-400">Comigo</span>
            <h3 class="text-3xl font-black text-gray-900 leading-none mt-1">{{ meusAtendimentos() }}</h3>
          </div>
        </div>

        <!-- Card 4: SLA Crítico -->
        <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div class="p-4 bg-rose-50 rounded-2xl text-rose-600">
            <mat-icon class="!text-3xl !w-8 !h-8 flex items-center justify-center">alarm_on</mat-icon>
          </div>
          <div>
            <span class="text-xs font-bold uppercase text-gray-400">SLA Crítico</span>
            <h3 class="text-3xl font-black text-gray-900 leading-none mt-1">{{ totalSlaCritico() }}</h3>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <!-- Search bar -->
        <div class="relative w-full sm:flex-grow">
          <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</mat-icon>
          <input type="text" 
                 [(ngModel)]="searchQuery" 
                 placeholder="Buscar por supermercado ou título..."
                 class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-semibold" />
        </div>

        <!-- Status Filter -->
        <div class="relative w-full sm:w-64">
          <select [(ngModel)]="statusFilter"
                  class="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-bold text-gray-700">
            <option value="TODOS">Todos os Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="EM_PROCESSAMENTO">Em Processamento</option>
            <option value="AGUARDANDO_APROVACAO">Aguardando Aprovação</option>
            <option value="APROVADO">Aprovado</option>
            <option value="PUBLICADO">Publicado / Concluído</option>
          </select>
          <mat-icon class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">unfold_more</mat-icon>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex flex-col justify-center items-center py-32 gap-4">
          <mat-spinner diameter="48" color="primary"></mat-spinner>
          <span class="text-gray-500 font-bold text-sm tracking-wide animate-pulse">Carregando fila inteligente...</span>
        </div>
      } @else {
        
        <!-- Fila de Cards -->
        @if (solicitacoesFiltradas().length === 0) {
          <div class="bg-gray-50 rounded-3xl p-16 text-center border border-dashed border-gray-200">
            <mat-icon class="!text-5xl !w-12 !h-12 text-gray-300 mb-2">assignment_late</mat-icon>
            <h3 class="text-lg font-black text-gray-800">Fila limpa!</h3>
            <p class="text-gray-400 text-sm mt-1">Nenhuma solicitação de concierge encontrada no momento.</p>
          </div>
        } @else {
          <div class="space-y-6">
            @for (solic of solicitacoesFiltradas(); track solic.id) {
              <!-- Solicitação Card -->
              <div class="relative bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group overflow-hidden">
                
                <!-- Plan Glow Indicator Border -->
                <div class="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b"
                     [ngClass]="{
                       'from-gray-300 to-gray-400': (solic.plano || '').toUpperCase() === 'STARTER' || (solic.plano || '').toUpperCase() === 'BÁSICO',
                       'from-orange-400 to-amber-500': (solic.plano || '').toUpperCase() === 'ESSENCIAL' || (solic.plano || '').toUpperCase() === 'PRO',
                       'from-purple-500 to-indigo-600': (solic.plano || '').toUpperCase() === 'PREMIUM'
                     }"></div>

                <!-- Left Block: Score, Store Info & SLA -->
                <div class="flex items-start sm:items-center gap-6 flex-grow">
                  
                  <!-- Score Circle Display -->
                  <div class="relative flex-shrink-0 w-16 h-16 rounded-full flex flex-col justify-center items-center font-black border-4"
                       [ngClass]="{
                         'bg-rose-50 text-rose-600 border-rose-100': solic.score * 100 >= 80,
                         'bg-amber-50 text-amber-600 border-amber-100': solic.score * 100 >= 50 && solic.score * 100 < 80,
                         'bg-emerald-50 text-emerald-600 border-emerald-100': solic.score * 100 < 50
                       }">
                    <span class="text-[9px] uppercase tracking-widest text-gray-400 -mb-1">Score</span>
                    <span class="text-xl font-black leading-none">{{ formatScore(solic.score) }}</span>
                  </div>

                  <!-- Details -->
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-xs font-black uppercase px-2.5 py-0.5 rounded-full border"
                            [ngClass]="{
                              'bg-purple-50 text-purple-700 border-purple-200': (solic.plano || '').toUpperCase() === 'PREMIUM',
                              'bg-amber-50 text-amber-700 border-amber-200': (solic.plano || '').toUpperCase() === 'ESSENCIAL' || (solic.plano || '').toUpperCase() === 'PRO',
                              'bg-slate-50 text-slate-700 border-slate-200': (solic.plano || '').toUpperCase() === 'STARTER' || (solic.plano || '').toUpperCase() === 'BÁSICO'
                            }">
                        👑 {{ solic.plano || 'Padrão' }}
                      </span>
                      
                      <!-- Status Badge -->
                      <span class="text-xs font-bold px-2.5 py-0.5 rounded-full"
                            [ngClass]="{
                              'bg-amber-50 text-amber-700': solic.status === 'PENDENTE',
                              'bg-blue-50 text-blue-700': solic.status === 'EM_PROCESSAMENTO',
                              'bg-indigo-50 text-indigo-700': solic.status === 'AGUARDANDO_APROVACAO',
                              'bg-emerald-50 text-emerald-700': solic.status === 'APROVADO' || solic.status === 'PUBLICADO'
                            }">
                        {{ getStatusText(solic.status) }}
                      </span>

                      <!-- Complexity Star Rating -->
                      <span class="text-xs font-bold text-gray-400 flex items-center gap-0.5 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                        ⚡ Complexidade: {{ getComplexityText(solic.complexidade) }}
                      </span>
                    </div>

                    <h3 class="text-xl font-black text-gray-900 mt-1 leading-tight group-hover:text-purple-600 transition-colors">{{ solic.titulo }}</h3>
                    
                    <p class="text-sm font-bold text-slate-500 flex items-center gap-1">
                      <mat-icon class="!w-4 !h-4 text-[16px] text-purple-400">store</mat-icon>
                      <span>Estabelecimento: <span class="text-gray-900 font-extrabold">{{ solic.supermercadoNome || 'Supermercado Modelo' }}</span></span>
                    </p>

                    <!-- SLA Countdown progress -->
                    <div class="flex items-center gap-3 pt-1">
                      <div class="text-xs font-semibold text-gray-400">SLA Restante: <span class="font-extrabold text-gray-700">{{ formatSlaTime(solic.tempoRestanteSlaMinutos) }}</span></div>
                      <div class="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full rounded-full"
                             [ngStyle]="{ 'width': getSlaPercentage(solic) + '%' }"
                             [ngClass]="{
                               'bg-rose-500': getSlaPercentage(solic) >= 80,
                               'bg-amber-500': getSlaPercentage(solic) >= 40 && getSlaPercentage(solic) < 80,
                               'bg-emerald-500': getSlaPercentage(solic) < 40
                             }"></div>
                      </div>
                      <span class="text-xs font-black" 
                            [ngClass]="{
                              'text-rose-600 animate-pulse': isSlaCritical(solic),
                              'text-gray-500': !isSlaCritical(solic)
                            }">
                        🕒 Criado em: {{ formatDateTime(solic.dataCriacao) }}
                      </span>
                    </div>

                    @if (solic.observacoes) {
                      <p class="text-xs text-gray-400 italic bg-gray-50 p-2 rounded-xl mt-2 border border-gray-100">
                        "{{ solic.observacoes }}"
                      </p>
                    }
                  </div>
                </div>

                <!-- Right Block: Attachments, Assigner Info & Interactive Actions -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-shrink-0 w-full lg:w-auto">
                  
                  <!-- Download Original File Button -->
                  <a [href]="solic.urlArquivoOriginal || '#'" target="_blank"
                     class="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl px-5 py-3 text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                    <mat-icon class="!w-4 !h-4 text-[18px]">cloud_download</mat-icon>
                    Baixar Listagem
                  </a>

                  <!-- Lock Attendant Information if locked -->
                  @if (solic.status === 'EM_PROCESSAMENTO' && solic.atendenteId !== currentUserId()) {
                    <div class="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-xs font-bold text-gray-400 flex items-center justify-center gap-2">
                      <mat-icon class="text-gray-400 !w-4 !h-4 text-[16px]">lock</mat-icon>
                      <span>Por: {{ solic.atendenteNome || 'Outro atendente' }}</span>
                    </div>
                  }

                  <!-- Actions trigger depending on status -->
                  @if (solic.status === 'PENDENTE') {
                    <button (click)="assumirSolicitacao(solic)"
                            class="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 py-4 text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-purple-600/20 cursor-pointer flex items-center justify-center gap-1">
                      <mat-icon class="mr-1">pan_tool</mat-icon> Assumir
                    </button>
                  }

                  @if (solic.status === 'EM_PROCESSAMENTO' && solic.atendenteId === currentUserId()) {
                    <div class="flex flex-col gap-2 w-full sm:w-auto">
                      <!-- Observation input for Conclude -->
                      <input type="text"
                             [(ngModel)]="observacoesAtendimento[solic.id]"
                             placeholder="Observações do processamento..."
                             class="px-4 py-2 border border-gray-100 bg-gray-50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 w-full font-bold" />
                      <button (click)="concluirSolicitacao(solic)"
                              class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-3 text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-1">
                        <mat-icon class="mr-1">done_all</mat-icon> Concluir
                      </button>
                    </div>
                  }

                  @if (solic.status === 'AGUARDANDO_APROVACAO') {
                    <div class="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-2xl px-5 py-3 text-xs font-black flex items-center justify-center gap-1">
                      <mat-icon class="!w-4 !h-4 text-[16px]">hourglass_top</mat-icon>
                      Aguardando Aprovação do Estabelecimento
                    </div>
                  }

                  @if (solic.status === 'APROVADO' || solic.status === 'PUBLICADO') {
                    <div class="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl px-5 py-3 text-xs font-black flex items-center justify-center gap-1 shadow-sm">
                      <mat-icon class="!w-4 !h-4 text-[16px]">check_circle</mat-icon>
                      Publicado
                    </div>
                  }
                </div>

              </div>
            }
          </div>
        }
      }

    </div>
  `
})
export class ConciergeFilaComponent implements OnInit {
  private conciergeService = inject(ConciergeService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  solicitacoes = signal<ConciergeRequest[]>([]);
  loading = signal(true);

  // Filters state
  searchQuery = '';
  statusFilter = 'TODOS';

  // Inline forms model mapped by request ID
  observacoesAtendimento: { [key: string]: string } = {};

  // Current attendant ID
  currentUserId = computed(() => this.authService.user()?.id || '');

  // Computed metrics for cards
  totalFila = computed(() => this.solicitacoes().length);
  
  totalPendentes = computed(() => 
    this.solicitacoes().filter(s => s.status === 'PENDENTE').length
  );
  
  meusAtendimentos = computed(() => 
    this.solicitacoes().filter(s => s.status === 'EM_PROCESSAMENTO' && s.atendenteId === this.currentUserId()).length
  );
  
  totalSlaCritico = computed(() => 
    this.solicitacoes().filter(s => s.status === 'PENDENTE' && s.score * 100 >= 80).length
  );

  ngOnInit() {
    this.carregarFila();
  }

  carregarFila() {
    this.loading.set(true);
    this.conciergeService.listarFila().subscribe({
      next: (dados) => {
        this.solicitacoes.set(dados);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('ERRO DETALHADO DO CONCIERGE:', err);
        this.notificationService.error('Erro ao buscar a fila de atendimento.');
        this.loading.set(false);
      }
    });
  }

  // Reactive filtering
  solicitacoesFiltradas = computed(() => {
    return this.solicitacoes().filter(s => {
      const superNome = s.supermercadoNome || 'Supermercado Modelo';
      // 1. Search Query filter
      const matchesSearch = superNome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            s.titulo.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // 2. Status filter
      const matchesStatus = this.statusFilter === 'TODOS' || s.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  });

  formatScore(score: number): string {
    return score ? Math.round(score * 100).toString() : '0';
  }

  getComplexityText(comp: number): string {
    if (comp === 1) return 'Pequena (1)';
    if (comp === 2) return 'Média (2)';
    if (comp === 3) return 'Grande (3)';
    return 'Padrão (1)';
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDENTE': return '⏳ Pendente';
      case 'EM_PROCESSAMENTO': return '⚙️ Em Processamento';
      case 'AGUARDANDO_APROVACAO': return '👁️ Aguardando Aprovação';
      case 'APROVADO':
      case 'PUBLICADO': return '✅ Publicado';
      default: return status;
    }
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    } catch {
      return dateStr;
    }
  }

  formatSlaTime(minutos?: number): string {
    if (minutos === undefined || minutos === null) return 'N/A';
    if (minutos <= 0) return 'Excedido!';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  }

  getSlaPercentage(solic: ConciergeRequest): number {
    // Proporção de tempo gasto com base no score de urgência
    if (solic.score * 100 >= 80) return 90;
    if (solic.score * 100 >= 50) return 60;
    return 20;
  }

  isSlaCritical(solic: ConciergeRequest): boolean {
    return solic.score * 100 >= 80 && solic.status === 'PENDENTE';
  }

  assumirSolicitacao(solic: ConciergeRequest) {
    const atendenteId = this.currentUserId();
    if (!atendenteId) {
      this.notificationService.error('Seu ID de atendente não pôde ser verificado. Faça login novamente.');
      return;
    }

    this.conciergeService.assumir(solic.id, atendenteId).subscribe({
      next: () => {
        this.notificationService.success('Você assumiu a tarefa com sucesso! Ela está travada para você.');
        this.carregarFila();
      },
      error: (err) => {
        if (err.status === 409) {
          this.notificationService.error('Esta solicitação já foi assumida por outro atendente.');
        } else {
          this.notificationService.error('Erro ao assumir a solicitação.');
        }
        this.carregarFila();
      }
    });
  }

  concluirSolicitacao(solic: ConciergeRequest) {
    const atendenteId = this.currentUserId();
    const observacoes = this.observacoesAtendimento[solic.id] || '';

    this.conciergeService.concluir(solic.id, atendenteId, observacoes).subscribe({
      next: () => {
        this.notificationService.success('Processamento concluído! O encarte foi enviado para aprovação do supermercado.');
        this.carregarFila();
      },
      error: () => {
        this.notificationService.error('Erro ao concluir o processamento da solicitação.');
      }
    });
  }
}
