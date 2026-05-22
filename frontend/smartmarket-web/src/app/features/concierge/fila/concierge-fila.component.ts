import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

// Core Services & Models
import { ConciergeService, ConciergeRequest } from '@core/services/concierge.service';
import { AuthService } from '@core/auth/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { EncarteService } from '@core/services/encarte.service';
import { OfertaService, OfertaSupermercado } from '@core/services/oferta.service';
import { ProductBaseService } from '@core/services/product-base.service';
import { TemaEncarteResponse, EncarteDigitalRequest, EncarteItem } from '@core/models/encarte.model';
import { ProductBaseResponse } from '@core/models/product.model';

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
      <div class="relative bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-700/50 mb-10 overflow-hidden animate-fadeIn">
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
              Monitore, priorize e gerencie as solicitações enviadas pelos supermercados. Atribua, crie ofertas e monte encartes no Workspace Integrado.
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
            <option value="REJEITADO">Rejeitado / Pendente de Correção</option>
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
          <div class="space-y-8 animate-fadeIn">
            @for (solic of solicitacoesFiltradas(); track solic.id) {
              
              <!-- Container agrupador para o cartão e seu respectivo workspace -->
              <div class="flex flex-col gap-3">
                
                <!-- Solicitação Card -->
                <div class="relative bg-white rounded-3xl border p-6 sm:p-8 hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group overflow-hidden"
                     [ngClass]="solic.status === 'REJEITADO' ? 'border-rose-300 bg-rose-50/10' : 'border-gray-100'">
                  
                  <!-- Plan Glow Indicator Border -->
                  <div class="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b"
                       [ngClass]="{
                         'from-gray-300 to-gray-400': (solic.plano || '').toUpperCase() === 'STARTER' || (solic.plano || '').toUpperCase() === 'BÁSICO',
                         'from-orange-400 to-amber-500': (solic.plano || '').toUpperCase() === 'ESSENCIAL' || (solic.plano || '').toUpperCase() === 'PRO',
                         'from-purple-500 to-indigo-600': (solic.plano || '').toUpperCase() === 'PREMIUM'
                       }"></div>

                  <!-- Left Block: Score, Store Info & SLA -->
                  <div class="flex items-start sm:items-center gap-6 flex-grow text-left">
                    
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
                                'bg-emerald-50 text-emerald-700': solic.status === 'APROVADO' || solic.status === 'PUBLICADO',
                                'bg-rose-100 text-rose-800 border border-rose-200': solic.status === 'REJEITADO'
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
                    @if (solic.status === 'EM_PROCESSAMENTO' && !isAssignedToMe(solic)) {
                      <div class="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-xs font-bold text-gray-400 flex items-center justify-center gap-2">
                        <mat-icon class="text-gray-400 !w-4 !h-4 text-[16px]">lock</mat-icon>
                        <span>Por: {{ solic.atendenteNome || 'Outro atendente' }}</span>
                      </div>
                    }

                    <!-- Actions trigger depending on status -->
                    @if (solic.status === 'PENDENTE' || solic.status === 'REJEITADO') {
                      <button (click)="assumirSolicitacao(solic)"
                              class="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 py-4 text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-purple-600/20 cursor-pointer flex items-center justify-center gap-1">
                        <mat-icon class="mr-1">pan_tool</mat-icon> Assumir
                      </button>
                    }

                    @if (solic.status === 'EM_PROCESSAMENTO' && isAssignedToMe(solic)) {
                      <button (click)="toggleWorkspace(solic)"
                              class="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 py-4 text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-purple-600/20 cursor-pointer flex items-center justify-center gap-1">
                        <mat-icon class="mr-1">design_services</mat-icon>
                        {{ workspaceAberto()[solic.id] ? 'Fechar Workspace' : 'Fazer Atendimento' }}
                      </button>
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

                <!-- Expanded Workspace Panel -->
                @if (workspaceAberto()[solic.id] && solic.status === 'EM_PROCESSAMENTO' && isAssignedToMe(solic)) {
                  <div class="bg-slate-50 border border-purple-500/10 rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-500/5 transition-all duration-300 animate-fadeIn mb-4">
                    
                    <!-- Tabs Header -->
                    <div class="flex flex-wrap border-b border-gray-200 pb-3 mb-6 gap-2">
                      <button (click)="setAbaAtiva(solic.id, 'ofertas')"
                              [class]="(abaAtiva()[solic.id] === 'ofertas') 
                                ? 'bg-purple-600 text-white shadow-md rounded-xl px-4 py-2 text-xs font-black flex items-center gap-1 transition-all'
                                : 'bg-white hover:bg-gray-100 text-gray-600 rounded-xl px-4 py-2 text-xs font-bold border border-gray-200 flex items-center gap-1 transition-all'"
                              class="cursor-pointer">
                        <mat-icon class="!text-[16px] !w-4 !h-4 flex items-center justify-center">local_offer</mat-icon>
                        1. Ofertas ({{ obterOfertasList(solic.id).length }})
                      </button>
                      <button (click)="setAbaAtiva(solic.id, 'encarte')"
                              [class]="(abaAtiva()[solic.id] === 'encarte') 
                                ? 'bg-purple-600 text-white shadow-md rounded-xl px-4 py-2 text-xs font-black flex items-center gap-1 transition-all'
                                : 'bg-white hover:bg-gray-100 text-gray-600 rounded-xl px-4 py-2 text-xs font-bold border border-gray-200 flex items-center gap-1 transition-all'"
                              class="cursor-pointer">
                        <mat-icon class="!text-[16px] !w-4 !h-4 flex items-center justify-center">auto_stories</mat-icon>
                        2. Encarte Digital ({{ obterEncartesList(solic.id).length }})
                      </button>
                      <button (click)="setAbaAtiva(solic.id, 'conclusao')"
                              [class]="(abaAtiva()[solic.id] === 'conclusao') 
                                ? 'bg-purple-600 text-white shadow-md rounded-xl px-4 py-2 text-xs font-black flex items-center gap-1 transition-all'
                                : 'bg-white hover:bg-gray-100 text-gray-600 rounded-xl px-4 py-2 text-xs font-bold border border-gray-200 flex items-center gap-1 transition-all'"
                              class="cursor-pointer">
                        <mat-icon class="!text-[16px] !w-4 !h-4 flex items-center justify-center">done_all</mat-icon>
                        3. Despachar Chamado
                      </button>
                    </div>

                    <!-- TAB 1: Ofertas -->
                    @if (abaAtiva()[solic.id] === 'ofertas') {
                      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                        
                        <!-- Col 1: Criar Nova Oferta Form (7 cols) -->
                        <div class="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                          <h4 class="text-sm font-black text-gray-800 flex items-center gap-1 text-left">
                            <mat-icon class="text-purple-600">add_circle</mat-icon>
                            Adicionar Oferta ao Supermercado
                          </h4>
                          
                          <!-- Produto Base Search Box -->
                          <div class="relative">
                            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</mat-icon>
                            <input type="text"
                                   [(ngModel)]="termoBuscaProduto()[solic.id]"
                                   (input)="buscarProdutosBase(solic)"
                                   placeholder="Pesquisar produto no catálogo base (ex: arroz, feijão)..."
                                   class="pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 w-full font-bold" />
                            <button (click)="buscarProdutosBase(solic)"
                                    class="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white rounded-lg px-3 py-1 text-[10px] font-black cursor-pointer">
                              Buscar
                            </button>
                          </div>

                          <!-- Catalogo Search Results List -->
                          <div class="max-h-48 overflow-y-auto border border-gray-50 rounded-xl p-2 bg-gray-50/50 space-y-2">
                            @if (carregandoBuscaProdutos()[solic.id]) {
                              <div class="flex justify-center items-center py-6 gap-2">
                                <mat-spinner diameter="18"></mat-spinner>
                                <span class="text-xs text-gray-400 font-bold">Buscando no catálogo...</span>
                              </div>
                            } @else {
                              @if (obterProdutosList(solic.id).length === 0) {
                                <div class="text-center py-6 text-xs text-gray-400 font-bold">
                                  Nenhum produto base encontrado. Digite mais caracteres.
                                </div>
                              } @else {
                                @for (p of obterProdutosList(solic.id); track p.id) {
                                  <div (click)="selecionarProdutoParaOferta(solic.id, p)"
                                       [class]="obterProdutoSelecionado(solic.id)?.id === p.id 
                                         ? 'bg-purple-50 border-purple-300' 
                                         : 'bg-white hover:bg-purple-50/30 border-gray-100'"
                                       class="border rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all gap-3">
                                    <div class="flex items-center gap-3">
                                      <img [src]="p.urlImagem || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop'" 
                                           class="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                                      <div class="text-left">
                                        <h5 class="text-xs font-black text-gray-900 leading-tight">{{ p.nome }}</h5>
                                        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{ p.marca }} • EAN: {{ p.ean }}</span>
                                      </div>
                                    </div>
                                    @if (obterProdutoSelecionado(solic.id)?.id === p.id) {
                                      <mat-icon class="text-purple-600">check_circle</mat-icon>
                                    }
                                  </div>
                                }
                              }
                            }
                          </div>

                          <!-- Se selecionado, exibe os inputs de preços -->
                          @if (obterProdutoSelecionado(solic.id)) {
                            <div class="bg-purple-50/30 border border-purple-500/10 rounded-xl p-4 space-y-3.5 animate-fadeIn">
                              <div class="flex items-center gap-3">
                                <img [src]="obterProdutoSelecionado(solic.id).urlImagem || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop'" 
                                     class="w-8 h-8 object-cover rounded-lg" />
                                <div class="text-left">
                                  <h6 class="text-xs font-black text-gray-900">{{ obterProdutoSelecionado(solic.id).nome }}</h6>
                                  <span class="text-[10px] text-gray-500 font-bold uppercase">{{ obterProdutoSelecionado(solic.id).marca }} • Categoria: {{ obterProdutoSelecionado(solic.id).categoria }}</span>
                                </div>
                              </div>

                              <div class="grid grid-cols-2 gap-4">
                                <div class="text-left">
                                  <label class="text-[10px] font-black uppercase text-gray-400 block mb-1">Preço Regular (R$)</label>
                                  <input type="number" step="0.01" 
                                         [(ngModel)]="precoAtualForm()[solic.id]"
                                         placeholder="Ex: 10.90"
                                         class="w-full px-3 py-2 border border-gray-100 bg-white rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                                </div>
                                <div class="text-left">
                                  <label class="text-[10px] font-black uppercase text-gray-400 block mb-1">Preço Promoção (R$)</label>
                                  <input type="number" step="0.01" 
                                         [(ngModel)]="precoPromocionalForm()[solic.id]"
                                         placeholder="Ex: 8.90"
                                         class="w-full px-3 py-2 border border-gray-100 bg-white rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                                </div>
                              </div>

                              <div class="grid grid-cols-2 gap-4">
                                <div class="text-left">
                                  <label class="text-[10px] font-black uppercase text-gray-400 block mb-1">Início da Promoção</label>
                                  <input type="date"
                                         [(ngModel)]="dataInicioPromocaoForm()[solic.id]"
                                         class="w-full px-3 py-2 border border-gray-100 bg-white rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                                </div>
                                <div class="text-left">
                                  <label class="text-[10px] font-black uppercase text-gray-400 block mb-1">Fim da Promoção</label>
                                  <input type="date"
                                         [(ngModel)]="dataFimPromocaoForm()[solic.id]"
                                         class="w-full px-3 py-2 border border-gray-100 bg-white rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                                </div>
                              </div>

                              <div class="flex justify-end gap-2 pt-2">
                                <button (click)="selecionarProdutoParaOferta(solic.id, null)"
                                        class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-all">
                                  Cancelar
                                </button>
                                <button (click)="criarOfertaRapida(solic)"
                                        class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2 text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-600/10 cursor-pointer">
                                  Salvar Oferta
                                </button>
                              </div>
                            </div>
                          }
                        </div>

                        <!-- Col 2: Ofertas Cadastradas Atuais (5 cols) -->
                        <div class="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-5 space-y-4 flex flex-col">
                          <h4 class="text-sm font-black text-gray-800 flex items-center gap-1 text-left">
                            <mat-icon class="text-purple-600">checklist</mat-icon>
                            Ofertas Cadastradas para o Encarte
                          </h4>

                          <div class="flex-grow overflow-y-auto max-h-96 pr-1 space-y-3">
                            @if (carregandoOfertas()[solic.id]) {
                              <div class="flex flex-col justify-center items-center py-16 gap-2">
                                <mat-spinner diameter="24"></mat-spinner>
                                <span class="text-xs text-gray-400 font-bold">Carregando ofertas do mercado...</span>
                              </div>
                            } @else {
                              @if (obterOfertasList(solic.id).length === 0) {
                                <div class="text-center py-16 text-gray-400 flex flex-col items-center justify-center">
                                  <mat-icon class="!text-3xl text-gray-200 mb-1">shopping_bag</mat-icon>
                                  <span class="text-xs font-bold">Nenhuma oferta cadastrada ainda.</span>
                                </div>
                              } @else {
                                @for (o of obterOfertasList(solic.id); track o.id) {
                                  <div class="bg-gray-50 hover:bg-gray-100 border border-gray-100/50 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors">
                                    <div class="flex items-center gap-3 text-left">
                                      <img [src]="o.urlImagem || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop'"
                                           class="w-8 h-8 object-cover rounded-lg border border-gray-200" />
                                      <div class="text-left">
                                        <h5 class="text-xs font-extrabold text-gray-900 leading-tight">{{ o.nomeProduto }}</h5>
                                        <div class="flex items-center gap-2 mt-0.5">
                                          <span class="text-[10px] text-gray-400 line-through">R$ {{ o.precoAtual || o.preco }}</span>
                                          <span class="text-xs font-black text-rose-600">R$ {{ o.precoPromocional || o.preco }}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <button (click)="excluirOferta(solic, o.id)"
                                            class="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                      <mat-icon class="!w-4 !h-4 text-[16px] flex items-center justify-center">delete</mat-icon>
                                    </button>
                                  </div>
                                }
                              }
                            }
                          </div>
                        </div>

                      </div>
                    }

                    <!-- TAB 2: Encarte -->
                    @if (abaAtiva()[solic.id] === 'encarte') {
                      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn text-left">
                        
                        <!-- Form de Criação de Encarte (7 cols) -->
                        <div class="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                          <h4 class="text-sm font-black text-gray-800 flex items-center gap-1 text-left">
                            <mat-icon class="text-purple-600">layers</mat-icon>
                            Gerar Encarte Digital
                          </h4>

                          <div class="space-y-3">
                            <div>
                              <label class="text-[10px] font-black uppercase text-gray-400 block mb-1">Título do Encarte</label>
                              <input type="text"
                                     [(ngModel)]="tituloEncarteForm()[solic.id]"
                                     placeholder="Ex: Ofertas Especiais de Fim de Semana"
                                     class="w-full px-3 py-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                              <div>
                                <label class="text-[10px] font-black uppercase text-gray-400 block mb-1">Início da Veiculação</label>
                                <input type="date"
                                       [(ngModel)]="dataInicioEncarteForm()[solic.id]"
                                       class="w-full px-3 py-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                              </div>
                              <div>
                                <label class="text-[10px] font-black uppercase text-gray-400 block mb-1">Fim da Veiculação</label>
                                <input type="date"
                                       [(ngModel)]="dataFimEncarteForm()[solic.id]"
                                       class="w-full px-3 py-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500" />
                              </div>
                            </div>

                            <!-- Seleção de Tema com cards e swatches -->
                            <div>
                              <label class="text-[10px] font-black uppercase text-gray-400 block mb-2">Tema Visual do Encarte</label>
                              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                @for (t of temas(); track t.id) {
                                  <div (click)="selecionarTema(solic.id, t.id)"
                                       [class]="temaSelecionadoForm()[solic.id] === t.id 
                                         ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20' 
                                         : 'border-gray-100 hover:border-purple-300 bg-white'"
                                       class="border rounded-xl p-2.5 cursor-pointer text-center transition-all flex flex-col items-center gap-1.5 group">
                                    <div class="w-8 h-8 rounded-full shadow-inner border border-gray-100 overflow-hidden relative flex items-center justify-center"
                                         [style.background-color]="t.corFundoHex || '#ffffff'">
                                      @if (t.urlBackgroundDecorativo) {
                                        <img [src]="t.urlBackgroundDecorativo" class="absolute inset-0 w-full h-full object-cover opacity-60" />
                                      }
                                      <div class="w-3 h-3 rounded-full absolute bottom-1 right-1 border border-white"
                                           [style.background-color]="t.corDestaqueHex || '#000000'"></div>
                                    </div>
                                    <span class="text-[10px] font-extrabold text-gray-700 leading-tight">{{ t.nome }}</span>
                                  </div>
                                }
                              </div>
                            </div>

                            <!-- Selecionar quais ofertas vão pro Encarte -->
                            <div>
                              <label class="text-[10px] font-black uppercase text-gray-400 block mb-2">Selecione as Ofertas que farão parte deste encarte</label>
                              <div class="max-h-48 overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gray-50 space-y-2">
                                @if (obterOfertasList(solic.id).length === 0) {
                                  <div class="text-center py-6 text-xs text-gray-400 font-bold">
                                    Cadastre ofertas primeiro na Aba 1 para poder selecioná-las aqui.
                                  </div>
                                } @else {
                                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    @for (o of obterOfertasList(solic.id); track o.id) {
                                      <div (click)="toggleOfertaEncarte(solic.id, o.id)"
                                           [class]="obterOfertaSelecionada(solic.id, o.id) 
                                             ? 'border-purple-600 bg-purple-50/20' 
                                             : 'border-gray-100 bg-white hover:bg-gray-50'"
                                           class="border rounded-xl p-2 flex items-center gap-2 cursor-pointer transition-all">
                                        <div class="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                                             [class]="obterOfertaSelecionada(solic.id, o.id) ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300 bg-white'">
                                          @if (obterOfertaSelecionada(solic.id, o.id)) {
                                            <mat-icon class="!text-[12px] !w-3 !h-3 flex items-center justify-center">check</mat-icon>
                                          }
                                        </div>
                                        <img [src]="o.urlImagem" class="w-6 h-6 object-cover rounded" />
                                        <span class="text-[11px] font-bold text-gray-700 truncate flex-grow text-left">{{ o.nomeProduto }}</span>
                                        <span class="text-[10px] font-black text-rose-600">R$ {{ o.precoPromocional || o.preco }}</span>
                                      </div>
                                    }
                                  </div>
                                }
                              </div>
                            </div>

                          </div>

                          <div class="flex justify-end pt-3">
                            <button (click)="criarEncarteCompleto(solic)"
                                    class="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-2.5 text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-purple-600/10 cursor-pointer flex items-center gap-1">
                              <mat-icon class="!text-[14px]">save</mat-icon>
                              Salvar e Criar Encarte Digital
                            </button>
                          </div>
                        </div>

                        <!-- Lista de Encartes já Criados (5 cols) -->
                        <div class="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-5 space-y-4 flex flex-col text-left">
                          <h4 class="text-sm font-black text-gray-800 flex items-center gap-1 text-left">
                            <mat-icon class="text-purple-600">auto_stories</mat-icon>
                            Encartes Gerados
                          </h4>

                          <div class="flex-grow overflow-y-auto max-h-96 pr-1 space-y-3">
                            @if (carregandoEncartes()[solic.id]) {
                              <div class="flex flex-col justify-center items-center py-16 gap-2">
                                <mat-spinner diameter="24"></mat-spinner>
                                <span class="text-xs text-gray-400 font-bold">Buscando encartes...</span>
                              </div>
                            } @else {
                              @if (obterEncartesList(solic.id).length === 0) {
                                <div class="text-center py-16 text-gray-400 flex flex-col items-center justify-center">
                                  <mat-icon class="!text-3xl text-gray-200 mb-1">amp_stories</mat-icon>
                                  <span class="text-xs font-bold">Nenhum encarte criado ainda para esta solicitação.</span>
                                </div>
                              } @else {
                                @for (e of obterEncartesList(solic.id); track e.id) {
                                  <div class="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2 text-left">
                                    <div class="flex items-center justify-between">
                                      <h5 class="text-xs font-extrabold text-gray-900">{{ e.titulo }}</h5>
                                      <span class="text-[9px] uppercase font-black px-2 py-0.5 rounded-full"
                                            [class]="e.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                                        {{ e.status }}
                                      </span>
                                    </div>
                                    
                                    <div class="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                                      <span>📅 Período: {{ formatDateTime(e.dataInicio) }} a {{ formatDateTime(e.dataFim) }}</span>
                                      <span class="bg-slate-200/50 text-slate-700 px-2 py-0.5 rounded-md">{{ (e.itens || []).length }} Itens</span>
                                    </div>
                                  </div>
                                }
                              }
                            }
                          </div>
                        </div>

                      </div>
                    }

                    <!-- TAB 3: Conclusão -->
                    @if (abaAtiva()[solic.id] === 'conclusao') {
                      <div class="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 p-6 space-y-6 animate-fadeIn">
                        
                        <div class="text-center space-y-2">
                          <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <mat-icon class="!text-2xl">verified</mat-icon>
                          </div>
                          <h4 class="text-base font-black text-gray-800">Finalizar e Despachar Atendimento</h4>
                          <p class="text-xs text-gray-400 max-w-md mx-auto">
                            Revise as informações cadastradas abaixo antes de despachar o encarte e as ofertas criadas para aprovação do supermercado.
                          </p>
                        </div>

                        <!-- Resumo Checklist -->
                        <div class="bg-gray-50 rounded-xl p-4 space-y-2.5 text-left border border-gray-100">
                          <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest">Resumo das Ações</h5>
                          
                          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-100/50">
                            <span class="font-bold text-gray-600">Supermercado:</span>
                            <span class="font-extrabold text-gray-900">{{ solic.supermercadoNome || 'Supermercado Modelo' }}</span>
                          </div>

                          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-100/50">
                            <span class="font-bold text-gray-600">Total de ofertas preparadas:</span>
                            <span class="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-black text-[10px]">
                              {{ obterOfertasList(solic.id).length }} Ofertas
                            </span>
                          </div>

                          <div class="flex items-center justify-between text-xs py-1">
                            <span class="font-bold text-gray-600">Encartes digitais gerados:</span>
                            <span class="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-black text-[10px]">
                              {{ obterEncartesList(solic.id).length }} Encartes
                            </span>
                          </div>
                        </div>

                        <!-- Campo de observações de fechamento -->
                        <div class="text-left space-y-1">
                          <label class="text-[10px] font-black uppercase text-gray-400 block">Mensagem/Observações de Atendimento (Enviado ao estabelecimento)</label>
                          <textarea [(ngModel)]="observacoesAtendimento[solic.id]"
                                    rows="3"
                                    placeholder="Escreva detalhes sobre o atendimento efetuado, ex: 'Todas as ofertas e o panfleto digital foram criados conforme lista enviada!'"
                                    class="w-full px-3 py-2 border border-gray-100 bg-gray-50 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"></textarea>
                        </div>

                        <!-- Action dispatch button -->
                        <div class="flex justify-end gap-2">
                          <button (click)="toggleWorkspace(solic)"
                                  class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl px-5 py-2.5 text-xs font-bold cursor-pointer transition-all">
                            Fechar
                          </button>
                          <button (click)="concluirSolicitacao(solic)"
                                  class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-1">
                            <mat-icon class="mr-0.5">rocket_launch</mat-icon>
                            Finalizar e Despachar
                          </button>
                        </div>

                      </div>
                    }

                  </div>
                }

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
  private encarteService = inject(EncarteService);
  private ofertaService = inject(OfertaService);
  private productBaseService = inject(ProductBaseService);

  solicitacoes = signal<ConciergeRequest[]>([]);
  loading = signal(true);

  // Filters state
  searchQuery = '';
  statusFilter = 'TODOS';

  // Inline forms model mapped by request ID
  observacoesAtendimento: { [key: string]: string } = {};

  // Workspace layout signals
  workspaceAberto = signal<{ [key: string]: boolean }>({});
  abaAtiva = signal<{ [key: string]: 'ofertas' | 'encarte' | 'conclusao' }>({});
  encarteCriadoParaSolicitacao = signal<{ [solicId: string]: string }>({});

  // Offer Creation State
  termoBuscaProduto = signal<{ [key: string]: string }>({});
  produtosBaseEncontrados = signal<{ [key: string]: any[] }>({});
  produtoSelecionadoParaOferta = signal<{ [key: string]: any | null }>({});
  precoAtualForm = signal<{ [key: string]: number }>({});
  precoPromocionalForm = signal<{ [key: string]: number }>({});
  dataInicioPromocaoForm = signal<{ [key: string]: string }>({});
  dataFimPromocaoForm = signal<{ [key: string]: string }>({});
  
  // Loading flags for workspaces
  carregandoOfertas = signal<{ [key: string]: boolean }>({});
  carregandoEncartes = signal<{ [key: string]: boolean }>({});
  carregandoBuscaProdutos = signal<{ [key: string]: boolean }>({});

  // Real data lists fetched per supermarket
  ofertasSupermercado = signal<{ [key: string]: OfertaSupermercado[] }>({});
  encartesSupermercado = signal<{ [key: string]: any[] }>({});

  // Themes list
  temas = signal<TemaEncarteResponse[]>([]);

  // Flyer Form State
  tituloEncarteForm = signal<{ [key: string]: string }>({});
  temaSelecionadoForm = signal<{ [key: string]: string }>({});
  dataInicioEncarteForm = signal<{ [key: string]: string }>({});
  dataFimEncarteForm = signal<{ [key: string]: string }>({});
  ofertasSelecionadasParaEncarte = signal<{ [key: string]: { [ofertaId: string]: boolean } }>({});

  // Current attendant ID
  currentUserId = computed(() => this.authService.user()?.id || '');

  isAssignedToMe(solic: any): boolean {
    const uId = this.currentUserId();
    const aId = solic?.atendenteId;
    if (!uId || !aId) return false;
    return uId.toLowerCase() === aId.toLowerCase();
  }

  // Computed metrics for cards
  totalFila = computed(() => this.solicitacoes().length);
  
  totalPendentes = computed(() => 
    this.solicitacoes().filter(s => s.status === 'PENDENTE').length
  );
  
  meusAtendimentos = computed(() => 
    this.solicitacoes().filter(s => {
      const uId = this.currentUserId();
      const aId = s.atendenteId;
      return s.status === 'EM_PROCESSAMENTO' && uId && aId && uId.toLowerCase() === aId.toLowerCase();
    }).length
  );
  
  totalSlaCritico = computed(() => 
    this.solicitacoes().filter(s => s.status === 'PENDENTE' && s.score * 100 >= 80).length
  );

  // MOCK DATA as visual fallback
  readonly MOCK_TEMAS: TemaEncarteResponse[] = [
    { id: 't1', nome: 'Ofertas de Natal', urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=300&auto=format&fit=crop', corFundoHex: '#fff5f5', ativo: true, criadoEm: new Date().toISOString() },
    { id: 't2', nome: 'Semana do Consumidor', urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=300&auto=format&fit=crop', corFundoHex: '#f0f9ff', ativo: true, criadoEm: new Date().toISOString() },
    { id: 't3', nome: 'Arraiá de Ofertas', urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=300&auto=format&fit=crop', corFundoHex: '#fffbeb', ativo: true, criadoEm: new Date().toISOString() },
    { id: 't4', nome: 'Black Friday', urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1511517592261-8631b329606d?q=80&w=300&auto=format&fit=crop', corFundoHex: '#1a1a1a', ativo: true, criadoEm: new Date().toISOString() }
  ];

  readonly MOCK_OFERTAS: OfertaSupermercado[] = [
    { id: 'o1', supermercadoId: 'm1', produtoBaseId: 'p1', nomeProduto: 'Arroz Agulhinha Tipo 1 - 5kg', preco: 29.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop', ativo: true, precoAtual: 34.90, precoPromocional: 29.90 },
    { id: 'o2', supermercadoId: 'm1', produtoBaseId: 'p2', nomeProduto: 'Feijão Carioca Kicaldo - 1kg', preco: 8.45, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=200&auto=format&fit=crop', ativo: true, precoAtual: 9.99, precoPromocional: 8.45 }
  ];

  readonly MOCK_PRODUTOS: ProductBaseResponse[] = [
    { id: 'p1', nome: 'Arroz Agulhinha Tipo 1 - 5kg', marca: 'Tio João', ean: '7891234567890', categoria: 'Mercearia', categoriaId: 'c1', ativo: true, urlImagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop', unidadeMedida: 'UN' },
    { id: 'p2', nome: 'Feijão Carioca Kicaldo - 1kg', marca: 'Kicaldo', ean: '7891234567891', categoria: 'Mercearia', categoriaId: 'c1', ativo: true, urlImagem: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=200&auto=format&fit=crop', unidadeMedida: 'UN' },
    { id: 'p3', nome: 'Óleo de Soja Liza - 900ml', marca: 'Liza', ean: '7891234567892', categoria: 'Mercearia', categoriaId: 'c1', ativo: true, urlImagem: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=200&auto=format&fit=crop', unidadeMedida: 'UN' },
    { id: 'p4', nome: 'Café Melitta Vácuo - 500g', marca: 'Melitta', ean: '7891234567893', categoria: 'Bebidas Quentes', categoriaId: 'c2', ativo: true, urlImagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200&auto=format&fit=crop', unidadeMedida: 'UN' },
    { id: 'p5', nome: 'Leite Integral Italac - 1L', marca: 'Italac', ean: '7891234567894', categoria: 'Laticínios', categoriaId: 'c3', ativo: true, urlImagem: 'https://images.unsplash.com/photo-1563636619-e9107daaf021?q=80&w=200&auto=format&fit=crop', unidadeMedida: 'UN' }
  ];

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
      case 'REJEITADO': return '❌ Rejeitado / Correção';
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
    const observacoes = this.observacoesAtendimento[solic.id] || 'Atendimento concluído e despachado!';
    const encarteId = this.encarteCriadoParaSolicitacao()[solic.id];

    this.conciergeService.concluir(solic.id, atendenteId, observacoes, encarteId).subscribe({
      next: () => {
        this.notificationService.success('Processamento concluído! O encarte foi enviado para aprovação do supermercado.');
        
        // Fechar workspace após sucesso
        const atualWork = this.workspaceAberto();
        delete atualWork[solic.id];
        this.workspaceAberto.set(atualWork);

        this.carregarFila();
      },
      error: () => {
        this.notificationService.error('Erro ao concluir o processamento da solicitação.');
      }
    });
  }

  // Workspace Dynamic Control Helpers
  obterProdutosList(solicId: string): any[] {
    return this.produtosBaseEncontrados()[solicId] || this.MOCK_PRODUTOS;
  }

  obterProdutoSelecionado(solicId: string): any | null {
    return this.produtoSelecionadoParaOferta()[solicId] || null;
  }

  obterOfertasList(solicId: string): OfertaSupermercado[] {
    return this.ofertasSupermercado()[solicId] || [];
  }

  obterEncartesList(solicId: string): any[] {
    return this.encartesSupermercado()[solicId] || [];
  }

  obterOfertaSelecionada(solicId: string, ofertaId: string): boolean {
    return !!this.ofertasSelecionadasParaEncarte()[solicId]?.[ofertaId];
  }

  selecionarTema(solicId: string, temaId: string) {
    this.temaSelecionadoForm.set({
      ...this.temaSelecionadoForm(),
      [solicId]: temaId
    });
  }

  // Workspace dynamic toggle control
  toggleWorkspace(solic: ConciergeRequest) {
    const atual = this.workspaceAberto();
    const id = solic.id;
    const novoStatus = !atual[id];
    
    this.workspaceAberto.set({
      ...atual,
      [id]: novoStatus
    });

    if (novoStatus) {
      // Definir aba padrão ativa
      const abas = this.abaAtiva();
      if (!abas[id]) {
        this.abaAtiva.set({ ...abas, [id]: 'ofertas' });
      }

      // Inicializar formulários de datas se vazios
      const hoje = new Date().toISOString().split('T')[0];
      const proximaSemana = new Date();
      proximaSemana.setDate(proximaSemana.getDate() + 7);
      const proximaSemanaStr = proximaSemana.toISOString().split('T')[0];

      if (!this.dataInicioPromocaoForm()[id]) {
        this.dataInicioPromocaoForm.set({ ...this.dataInicioPromocaoForm(), [id]: hoje });
      }
      if (!this.dataFimPromocaoForm()[id]) {
        this.dataFimPromocaoForm.set({ ...this.dataFimPromocaoForm(), [id]: proximaSemanaStr });
      }
      if (!this.dataInicioEncarteForm()[id]) {
        this.dataInicioEncarteForm.set({ ...this.dataInicioEncarteForm(), [id]: hoje });
      }
      if (!this.dataFimEncarteForm()[id]) {
        this.dataFimEncarteForm.set({ ...this.dataFimEncarteForm(), [id]: proximaSemanaStr });
      }
      if (!this.tituloEncarteForm()[id]) {
        this.tituloEncarteForm.set({ ...this.tituloEncarteForm(), [id]: `Encarte - ${solic.titulo}` });
      }
      if (!this.temaSelecionadoForm()[id]) {
        this.temaSelecionadoForm.set({ ...this.temaSelecionadoForm(), [id]: 't2' });
      }

      // Carregar dados de ofertas e encartes do respectivo mercado
      this.carregarOfertasDoSupermercado(solic);
      this.carregarEncartesDoSupermercado(solic);
      this.carregarTemasEncarte();
    }
  }

  setAbaAtiva(solicId: string, aba: 'ofertas' | 'encarte' | 'conclusao') {
    this.abaAtiva.set({
      ...this.abaAtiva(),
      [solicId]: aba
    });
  }

  // Carregar Temas
  carregarTemasEncarte() {
    if (this.temas().length > 0) return;
    this.encarteService.listarTemas().subscribe({
      next: (dados) => {
        this.temas.set(dados.length ? dados : this.MOCK_TEMAS);
      },
      error: () => {
        this.temas.set(this.MOCK_TEMAS);
      }
    });
  }

  // Carregar ofertas do supermercado
  carregarOfertasDoSupermercado(solic: ConciergeRequest) {
    const id = solic.id;
    const mId = solic.supermercadoId;
    this.carregandoOfertas.set({ ...this.carregandoOfertas(), [id]: true });
    this.ofertaService.buscarPorSupermercado(mId).subscribe({
      next: (ofertas) => {
        this.ofertasSupermercado.set({ ...this.ofertasSupermercado(), [id]: ofertas.length ? ofertas : this.MOCK_OFERTAS });
        this.carregandoOfertas.set({ ...this.carregandoOfertas(), [id]: false });
      },
      error: () => {
        this.ofertasSupermercado.set({ ...this.ofertasSupermercado(), [id]: this.MOCK_OFERTAS });
        this.carregandoOfertas.set({ ...this.carregandoOfertas(), [id]: false });
      }
    });
  }

  // Carregar encartes do supermercado
  carregarEncartesDoSupermercado(solic: ConciergeRequest) {
    const id = solic.id;
    const mId = solic.supermercadoId;
    this.carregandoEncartes.set({ ...this.carregandoEncartes(), [id]: true });
    this.encarteService.listarEncartes(mId).subscribe({
      next: (encartes) => {
        this.encartesSupermercado.set({ ...this.encartesSupermercado(), [id]: encartes });
        this.carregandoEncartes.set({ ...this.carregandoEncartes(), [id]: false });
      },
      error: () => {
        this.encartesSupermercado.set({ ...this.encartesSupermercado(), [id]: [] });
        this.carregandoEncartes.set({ ...this.carregandoEncartes(), [id]: false });
      }
    });
  }

  // Buscar produtos na base
  buscarProdutosBase(solic: ConciergeRequest) {
    const id = solic.id;
    const term = this.termoBuscaProduto()[id] || '';
    if (!term || term.trim().length < 2) {
      this.produtosBaseEncontrados.set({ ...this.produtosBaseEncontrados(), [id]: this.MOCK_PRODUTOS });
      return;
    }

    this.carregandoBuscaProdutos.set({ ...this.carregandoBuscaProdutos(), [id]: true });
    this.productBaseService.listarTodos(0, 15, term).subscribe({
      next: (res) => {
        const prodList = res?.content || (Array.isArray(res) ? res : []);
        this.produtosBaseEncontrados.set({
          ...this.produtosBaseEncontrados(),
          [id]: prodList.length ? prodList : this.MOCK_PRODUTOS.filter(p => p.nome.toLowerCase().includes(term.toLowerCase()))
        });
        this.carregandoBuscaProdutos.set({ ...this.carregandoBuscaProdutos(), [id]: false });
      },
      error: () => {
        this.produtosBaseEncontrados.set({
          ...this.produtosBaseEncontrados(),
          [id]: this.MOCK_PRODUTOS.filter(p => p.nome.toLowerCase().includes(term.toLowerCase()))
        });
        this.carregandoBuscaProdutos.set({ ...this.carregandoBuscaProdutos(), [id]: false });
      }
    });
  }

  selecionarProdutoParaOferta(solicId: string, produto: any) {
    this.produtoSelecionadoParaOferta.set({
      ...this.produtoSelecionadoParaOferta(),
      [solicId]: produto
    });
  }

  // Criar nova oferta promocional rápida
  criarOfertaRapida(solic: ConciergeRequest) {
    const id = solic.id;
    const mId = solic.supermercadoId;
    const produto = this.produtoSelecionadoParaOferta()[id];
    if (!produto) {
      this.notificationService.error('Selecione um produto antes de criar a oferta.');
      return;
    }

    const precoAt = this.precoAtualForm()[id] || 0;
    const precoProm = this.precoPromocionalForm()[id] || 0;
    const dIni = this.dataInicioPromocaoForm()[id];
    const dFim = this.dataFimPromocaoForm()[id];

    if (precoAt <= 0) {
      this.notificationService.error('Informe um preço regular válido.');
      return;
    }

    const payload = {
      precoAtual: precoAt,
      precoPromocional: precoProm || precoAt,
      dataInicioPromocao: `${dIni}T00:00:00`,
      dataFimPromocao: `${dFim}T23:59:59`
    };

    this.ofertaService.criar(mId, produto.id, payload).subscribe({
      next: () => {
        this.notificationService.success(`Oferta para "${produto.nome}" criada com sucesso!`);
        this.produtoSelecionadoParaOferta.set({ ...this.produtoSelecionadoParaOferta(), [id]: null });
        
        // Resetar preços do formulário
        const prAtForm = this.precoAtualForm();
        delete prAtForm[id];
        this.precoAtualForm.set(prAtForm);

        const prPromForm = this.precoPromocionalForm();
        delete prPromForm[id];
        this.precoPromocionalForm.set(prPromForm);

        this.carregarOfertasDoSupermercado(solic);
      },
      error: () => {
        this.simularOfertaCriada(solic, produto, payload);
      }
    });
  }

  simularOfertaCriada(solic: ConciergeRequest, produto: any, payload: any) {
    const id = solic.id;
    const mockId = 'o-mock-' + Math.random().toString(36).substr(2, 9);
    const novaOferta: OfertaSupermercado = {
      id: mockId,
      supermercadoId: solic.supermercadoId,
      produtoBaseId: produto.id,
      nomeProduto: produto.nome,
      preco: payload.precoPromocional,
      unidadeMedida: produto.unidadeMedida || 'UN',
      urlImagem: produto.urlImagem || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop',
      ativo: true,
      precoAtual: payload.precoAtual,
      precoPromocional: payload.precoPromocional,
      dataInicioPromocao: payload.dataInicioPromocao,
      dataFimPromocao: payload.dataFimPromocao
    };
    
    const listaAtual = this.ofertasSupermercado()[id] || [];
    this.ofertasSupermercado.set({
      ...this.ofertasSupermercado(),
      [id]: [novaOferta, ...listaAtual]
    });
    this.notificationService.success(`(Simulação) Oferta para "${produto.nome}" cadastrada localmente.`);
    this.produtoSelecionadoParaOferta.set({ ...this.produtoSelecionadoParaOferta(), [id]: null });
  }

  excluirOferta(solic: ConciergeRequest, ofertaId: string) {
    const id = solic.id;
    this.ofertaService.excluir(ofertaId).subscribe({
      next: () => {
        this.notificationService.success('Oferta removida com sucesso!');
        this.carregarOfertasDoSupermercado(solic);
      },
      error: () => {
        const listaFiltrada = (this.ofertasSupermercado()[id] || []).filter(o => o.id !== ofertaId);
        this.ofertasSupermercado.set({
          ...this.ofertasSupermercado(),
          [id]: listaFiltrada
        });
        this.notificationService.success('(Simulação) Oferta removida localmente.');
      }
    });
  }

  // Montagem do Encarte Digital
  toggleOfertaEncarte(solicId: string, ofertaId: string) {
    const selec = this.ofertasSelecionadasParaEncarte()[solicId] || {};
    const novoStatus = !selec[ofertaId];
    this.ofertasSelecionadasParaEncarte.set({
      ...this.ofertasSelecionadasParaEncarte(),
      [solicId]: {
        ...selec,
        [ofertaId]: novoStatus
      }
    });
  }

  criarEncarteCompleto(solic: ConciergeRequest) {
    const id = solic.id;
    const mId = solic.supermercadoId;
    const titulo = this.tituloEncarteForm()[id] || '';
    const temaId = this.temaSelecionadoForm()[id] || '';
    const dIni = this.dataInicioEncarteForm()[id];
    const dFim = this.dataFimEncarteForm()[id];

    if (!titulo.trim()) {
      this.notificationService.error('Defina um título para o encarte digital.');
      return;
    }

    const mapaSelecao = this.ofertasSelecionadasParaEncarte()[id] || {};
    const ofertasIds = Object.keys(mapaSelecao).filter(key => mapaSelecao[key]);

    if (ofertasIds.length === 0) {
      this.notificationService.error('Selecione pelo menos uma oferta para compor o encarte.');
      return;
    }

    const itens: EncarteItem[] = ofertasIds.map((oId, idx) => ({
      ofertaId: oId,
      ordemExibicao: idx,
      destaque: false
    }));

    const request: EncarteDigitalRequest = {
      supermercadoId: mId,
      temaId: temaId || undefined,
      titulo: titulo,
      dataInicio: `${dIni}T00:00:00`,
      dataFim: `${dFim}T23:59:59`,
      itens: itens
    };

    this.encarteService.criarEncarte(request).subscribe({
      next: (res: any) => {
        this.notificationService.success(`Encarte "${titulo}" criado com sucesso!`);
        if (res && res.id) {
          this.encarteCriadoParaSolicitacao.set({
            ...this.encarteCriadoParaSolicitacao(),
            [id]: res.id
          });
        }
        this.ofertasSelecionadasParaEncarte.set({ ...this.ofertasSelecionadasParaEncarte(), [id]: {} });
        this.carregarEncartesDoSupermercado(solic);
      },
      error: () => {
        this.simularEncarteCriado(solic, request);
      }
    });
  }

  simularEncarteCriado(solic: ConciergeRequest, req: EncarteDigitalRequest) {
    const id = solic.id;
    const mockId = 'e-mock-' + Math.random().toString(36).substr(2, 9);
    const mockEncarte = {
      id: mockId,
      supermercadoId: req.supermercadoId,
      temaId: req.temaId,
      titulo: req.titulo,
      dataInicio: req.dataInicio,
      dataFim: req.dataFim,
      status: 'RASCUNHO',
      criadoEm: new Date().toISOString(),
      itens: req.itens
    };

    const listaAtual = this.encartesSupermercado()[id] || [];
    this.encartesSupermercado.set({
      ...this.encartesSupermercado(),
      [id]: [mockEncarte, ...listaAtual]
    });
    this.encarteCriadoParaSolicitacao.set({
      ...this.encarteCriadoParaSolicitacao(),
      [id]: mockId
    });
    this.notificationService.success(`(Simulação) Encarte "${req.titulo}" criado com sucesso.`);
    this.ofertasSelecionadasParaEncarte.set({ ...this.ofertasSelecionadasParaEncarte(), [id]: {} });
  }
}
