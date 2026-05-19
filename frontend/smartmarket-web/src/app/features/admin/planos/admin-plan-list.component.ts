import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BillingService } from '../../billing/services/billing.service';
import { NotificationService } from '@core/services/notification.service';
import { Plano } from '@core/models/billing.model';

@Component({
  selector: 'app-admin-plan-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressSpinnerModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Premium Header Section with Gradient Elements -->
      <div class="relative bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-700/50 mb-10 overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary/15 rounded-full blur-3xl"></div>
        
        <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-primary/25 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/30">Billing</span>
              <span class="bg-slate-700/50 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Configurações</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Gestão de Planos</h1>
            <p class="text-slate-400 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
              Monitore, customize e ative os planos SaaS disponíveis. Defina limites de ofertas, encartes ativos, alcance de geolocalização e suporte Concierge.
            </p>
          </div>
          <a routerLink="/admin/planos/new" 
             class="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] text-white rounded-2xl px-6 py-4 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer border-0 shrink-0 no-underline">
            <mat-icon class="mr-1">add_circle</mat-icon> Criar Novo Plano
          </a>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex flex-col justify-center items-center py-32 gap-4">
          <mat-spinner diameter="48" color="primary"></mat-spinner>
          <span class="text-gray-500 font-bold text-sm tracking-wide animate-pulse">Carregando planos do sistema...</span>
        </div>
      } @else {
        
        <!-- Grid of Plans -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (plano of planos(); track plano.id) {
            <div class="relative bg-white rounded-3xl border border-gray-100/80 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group">
              
              <!-- Color Accent Indicator based on price/class -->
              <div class="h-2 w-full bg-gradient-to-r"
                   [ngClass]="{
                     'from-blue-400 to-indigo-500': plano.precoMensal < 100,
                     'from-emerald-400 to-teal-500': plano.precoMensal >= 100 && plano.precoMensal < 300,
                     'from-amber-500 to-orange-600': plano.precoMensal >= 300 && plano.precoMensal < 600,
                     'from-purple-600 to-pink-600': plano.precoMensal >= 600
                   }"></div>

              <!-- Card Header -->
              <div class="p-6 pb-4 flex items-start justify-between">
                <div>
                  <span class="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5 block">Pacote</span>
                  <h3 class="text-2xl font-black text-gray-900 leading-none mb-1 group-hover:text-primary transition-colors">{{ plano.nome }}</h3>
                </div>
                
                <!-- Toggle Status Button -->
                <button (click)="toggleStatus(plano); $event.stopPropagation()"
                        [matTooltip]="plano.ativo ? 'Clique para desativar plano' : 'Clique para ativar plano'"
                        class="px-3 py-1 rounded-full text-[11px] font-extrabold transition-all duration-200 border cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1 shadow-sm"
                        [ngClass]="plano.ativo ? 
                          'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/80' : 
                          'bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100/80'">
                  <span class="w-1.5 h-1.5 rounded-full animate-pulse" [ngClass]="plano.ativo ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                  {{ plano.ativo ? 'Ativo' : 'Inativo' }}
                </button>
              </div>

              <!-- Price Info Panel -->
              <div class="px-6 py-4 border-y border-gray-50 bg-gray-50/50">
                <div class="flex items-baseline">
                  <span class="text-sm font-bold text-gray-400 mr-1">R$</span>
                  <span class="text-4xl font-black text-gray-900 tracking-tight">{{ plano.precoMensal }}</span>
                  <span class="text-xs font-bold text-gray-400 ml-1">/ mês</span>
                </div>
                
                <!-- Multi-cycle details for B2B transparency -->
                <div class="flex flex-col gap-1.5 mt-4">
                  <div class="flex justify-between items-center text-xs text-gray-500 font-semibold bg-white border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm">
                    <span class="flex items-center gap-1"><mat-icon class="!w-3.5 !h-3.5 text-[14px] text-blue-500">calendar_today</mat-icon> Semestral</span>
                    <span class="text-gray-900 font-bold">R$ {{ plano.precoSemestral }}</span>
                  </div>
                  <div class="flex justify-between items-center text-xs text-gray-500 font-semibold bg-white border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm">
                    <span class="flex items-center gap-1"><mat-icon class="!w-3.5 !h-3.5 text-[14px] text-violet-500">savings</mat-icon> Anual (~20% off)</span>
                    <span class="text-gray-900 font-bold">R$ {{ plano.precoAnual }}</span>
                  </div>
                </div>
              </div>

              <!-- Features Grid -->
              <div class="p-6 space-y-4 flex-grow">
                <!-- Ofertas -->
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-600 font-semibold">
                    <mat-icon class="mr-2.5 text-blue-500 !w-5 !h-5 text-[20px]">storefront</mat-icon>
                    <span>Ofertas Mensais</span>
                  </div>
                  <span class="font-extrabold text-gray-900">{{ plano.limiteOfertasMensais === 0 ? 'Ilimitado' : plano.limiteOfertasMensais }}</span>
                </div>

                <!-- Encartes -->
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-600 font-semibold">
                    <mat-icon class="mr-2.5 text-emerald-500 !w-5 !h-5 text-[20px]">auto_stories</mat-icon>
                    <span>Encartes Ativos</span>
                  </div>
                  <span class="font-extrabold text-gray-900">{{ plano.limiteEncartesAtivos === 0 ? 'Ilimitado' : plano.limiteEncartesAtivos }}</span>
                </div>

                <!-- Raio de Atuação -->
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-600 font-semibold">
                    <mat-icon class="mr-2.5 text-amber-500 !w-5 !h-5 text-[20px]">location_on</mat-icon>
                    <span>Raio de Alcance</span>
                  </div>
                  <span class="font-extrabold text-gray-900">{{ plano.raioAtuacaoKm }} km</span>
                </div>

                <!-- Notificações -->
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-600 font-semibold">
                    <mat-icon class="mr-2.5 text-orange-500 !w-5 !h-5 text-[20px]">notifications</mat-icon>
                    <span>Pushes inclusos</span>
                  </div>
                  <span class="font-extrabold text-gray-900">{{ plano.limiteNotificacoesMensais === 0 ? 'Ilimitado' : plano.limiteNotificacoesMensais }}</span>
                </div>

                <!-- Concierge -->
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-600 font-semibold">
                    <mat-icon class="mr-2.5 text-purple-500 !w-5 !h-5 text-[20px]">support_agent</mat-icon>
                    <span>Suporte Concierge</span>
                  </div>
                  <span class="font-extrabold text-gray-900 text-right">
                    @if (plano.possuiConcierge) {
                      Sim <span class="text-[10px] text-purple-600 block font-bold">{{ plano.conciergeUploadsMensais ? '(' + plano.conciergeUploadsMensais + ' uploads/mês)' : '(Ilimitado)' }}</span>
                    } @else {
                      <span class="text-gray-400">Não possui</span>
                    }
                  </span>
                </div>

                <!-- SLA -->
                <div class="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <div class="flex items-center text-gray-600 font-semibold">
                    <mat-icon class="mr-2.5 text-rose-500 !w-5 !h-5 text-[20px]">timer</mat-icon>
                    <span>SLA de Suporte</span>
                  </div>
                  <span class="font-extrabold text-gray-900">{{ plano.slaAtendimentoHoras }}h</span>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="p-6 pt-0 mt-auto flex gap-3">
                <a mat-stroked-button [routerLink]="['/admin/planos', plano.id, 'edit']" 
                   class="flex-1 !rounded-2xl !border-gray-200 hover:!bg-slate-50 transition-colors py-2 flex items-center justify-center gap-1.5 font-bold text-slate-700">
                  <mat-icon class="!w-4 !h-4 text-[16px] flex items-center justify-center">edit</mat-icon> Editar Configurações
                </a>
              </div>

            </div>
          }
        </div>
      }
    </div>
  `
})
export class AdminPlanListComponent implements OnInit {
  private billingService = inject(BillingService);
  private notificationService = inject(NotificationService);

  planos = signal<Plano[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.carregarPlanos();
  }

  carregarPlanos() {
    this.loading.set(true);
    this.billingService.getPlans().subscribe({
      next: (planos) => {
        this.planos.set(planos);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Erro ao carregar planos do servidor.');
        this.loading.set(false);
      }
    });
  }

  toggleStatus(plano: Plano) {
    const novoEstado = !plano.ativo;
    this.billingService.updatePlan(plano.id, { ...plano, ativo: novoEstado }).subscribe({
      next: () => {
        this.notificationService.success(`Plano "${plano.nome}" ${novoEstado ? 'ativado' : 'desativado'} com sucesso!`);
        this.carregarPlanos();
      },
      error: (err) => {
        this.notificationService.error(err?.error?.message || 'Erro ao alterar status do plano.');
      }
    });
  }
}

