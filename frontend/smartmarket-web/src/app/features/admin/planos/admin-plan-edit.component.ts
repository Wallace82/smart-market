import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { BillingService } from '../../billing/services/billing.service';
import { NotificationService } from '@core/services/notification.service';
import { Plano } from '@core/models/billing.model';

@Component({
  selector: 'app-admin-plan-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule, MatProgressSpinnerModule, MatButtonModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 justify-between">
        <div class="flex items-center gap-4">
          <a mat-icon-button routerLink="/admin/planos" 
             class="text-gray-500 hover:text-gray-900 bg-white rounded-2xl p-2.5 shadow-sm border border-gray-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
            <mat-icon>arrow_back</mat-icon>
          </a>
          <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">{{ isNew() ? 'Criar Novo Plano' : 'Editar Plano' }}</h1>
            <p class="text-gray-500 mt-1 text-sm">{{ isNew() ? 'Defina os preços, limites de recursos e regras para o novo pacote SaaS.' : 'Ajuste os parâmetros operacionais e financeiros deste plano.' }}</p>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="flex flex-col justify-center items-center py-32 gap-4">
          <mat-spinner diameter="44" color="primary"></mat-spinner>
          <span class="text-gray-500 font-bold text-sm">Carregando detalhes do plano...</span>
        </div>
      } @else if (form) {
        <form [formGroup]="form" (ngSubmit)="salvar()" class="space-y-8">
          
          <!-- MAIN CARD: General info & pricing -->
          <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 space-y-8">
            
            <!-- SECTION 1: Informações Gerais -->
            <div>
              <div class="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                <mat-icon class="text-primary">info</mat-icon>
                <h2 class="text-lg font-black text-gray-900 uppercase tracking-wide">Informações Gerais</h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nome Comercial do Plano</label>
                  <input type="text" formControlName="nome" placeholder="Ex: Premium, Start, Escala..."
                         class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-semibold text-gray-900">
                </div>
                
                <div class="flex items-center h-[50px] pb-1">
                  <label class="flex items-center space-x-3 cursor-pointer group bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-xl px-4 py-3 w-full transition-colors">
                    <input type="checkbox" formControlName="ativo" class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-gray-700">Disponível para Venda</span>
                      <span class="text-[10px] text-gray-400 font-semibold uppercase">Status Ativo</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- SECTION 2: Precificação -->
            <div>
              <div class="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                <mat-icon class="text-primary">payments</mat-icon>
                <h2 class="text-lg font-black text-gray-900 uppercase tracking-wide">Tabela de Precificação</h2>
              </div>
              
              <div class="bg-slate-55 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-inner border border-slate-700/50">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mensalidade (R$)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-3 text-slate-400 font-bold text-sm">R$</span>
                    <input type="number" formControlName="precoMensal" step="0.01"
                           class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold">
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Semestralidade (R$)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-3 text-slate-400 font-bold text-sm">R$</span>
                    <input type="number" formControlName="precoSemestral" step="0.01"
                           class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold">
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Anuidade (R$)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-3 text-slate-400 font-bold text-sm">R$</span>
                    <input type="number" formControlName="precoAnual" step="0.01"
                           class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold">
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 3: Limites Operacionais -->
            <div>
              <div class="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                <mat-icon class="text-primary">tune</mat-icon>
                <h2 class="text-lg font-black text-gray-900 uppercase tracking-wide">Limites Operacionais</h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Limite Ofertas Mensais (0 = Ilimitado)</label>
                  <input type="number" formControlName="limiteOfertasMensais"
                         class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-semibold text-gray-900">
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Limite Encartes Ativos (0 = Ilimitado)</label>
                  <input type="number" formControlName="limiteEncartesAtivos"
                         class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-semibold text-gray-900">
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Raio de Atuação (Km)</label>
                  <input type="number" formControlName="raioAtuacaoKm"
                         class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-semibold text-gray-900">
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notificações Pushes / Mês (0 = Ilimitado)</label>
                  <input type="number" formControlName="limiteNotificacoesMensais"
                         class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-semibold text-gray-900">
                </div>
              </div>
            </div>

            <!-- SECTION 4: Concierge & SLA -->
            <div>
              <div class="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                <mat-icon class="text-primary">support_agent</mat-icon>
                <h2 class="text-lg font-black text-gray-900 uppercase tracking-wide">Suporte & Concierge</h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <label class="flex items-center space-x-3 mb-4 cursor-pointer group bg-white border border-gray-100 rounded-xl px-4 py-3 transition-colors hover:bg-gray-50">
                    <input type="checkbox" formControlName="possuiConcierge" class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-gray-700">Habilitar Suporte Concierge</span>
                      <span class="text-[10px] text-gray-400 font-semibold uppercase">Operação assistida ativa</span>
                    </div>
                  </label>
                  
                  <div [class.opacity-50]="!form.get('possuiConcierge')?.value">
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Uploads Concierge / Mês (0 = Ilimitado)</label>
                    <input type="number" formControlName="conciergeUploadsMensais"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-semibold text-gray-900">
                  </div>
                </div>
                
                <div class="flex flex-col justify-between">
                  <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">SLA de Atendimento (Horas)</label>
                    <input type="number" formControlName="slaAtendimentoHoras"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-semibold text-gray-900">
                    <p class="text-[10px] text-gray-400 mt-1 font-semibold uppercase">Tempo de SLA para resolução de chamados</p>
                  </div>
                  
                  <div class="mt-4">
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Prioridade da Fila (Concierge)</label>
                    <select formControlName="prioridadeFila" 
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-gray-700 cursor-pointer">
                      <option value="BAIXA">BAIXA</option>
                      <option value="NORMAL">NORMAL</option>
                      <option value="ALTA">ALTA</option>
                      <option value="MAXIMA">MÁXIMA</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom bar: Actions -->
          <div class="flex justify-end gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-md">
            <button type="button" routerLink="/admin/planos" 
                    class="px-6 py-3.5 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Cancelar
            </button>
            <button type="submit" [disabled]="form.invalid || saving()" 
                    class="px-8 py-3.5 rounded-2xl font-bold text-white bg-primary hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              @if (saving()) {
                <mat-spinner diameter="20" class="!text-white"></mat-spinner> Salvando Plano...
              } @else {
                <mat-icon>save</mat-icon> Confirmar e Salvar Plano
              }
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class AdminPlanEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private billingService = inject(BillingService);
  private notificationService = inject(NotificationService);

  form!: FormGroup;
  loading = signal(true);
  saving = signal(false);
  planoId = signal<string>('');
  isNew = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.planoId.set(id);
      this.carregarPlano();
    } else {
      this.isNew.set(true);
      this.criarFormulario({
        nome: '',
        limiteOfertasMensais: 0,
        limiteEncartesAtivos: 0,
        raioAtuacaoKm: 3, // default minimal according to design/requirements
        limiteNotificacoesMensais: 0,
        possuiConcierge: false,
        conciergeUploadsMensais: 0,
        slaAtendimentoHoras: 6, // default SLA for starter
        prioridadeFila: 'NORMAL',
        precoMensal: 0,
        precoSemestral: 0,
        precoAnual: 0,
        ativo: true
      } as Plano);
      this.loading.set(false);
    }
  }

  carregarPlano() {
    this.loading.set(true);
    this.billingService.getPlanById(this.planoId()).subscribe({
      next: (plano) => {
        this.criarFormulario(plano);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Erro ao carregar os dados do plano.');
        this.router.navigate(['/admin/planos']);
      }
    });
  }

  criarFormulario(plano: Plano) {
    this.form = this.fb.group({
      nome: [plano.nome, Validators.required],
      limiteOfertasMensais: [plano.limiteOfertasMensais, [Validators.required, Validators.min(0)]],
      limiteEncartesAtivos: [plano.limiteEncartesAtivos, [Validators.required, Validators.min(0)]],
      raioAtuacaoKm: [plano.raioAtuacaoKm, [Validators.required, Validators.min(1)]],
      limiteNotificacoesMensais: [plano.limiteNotificacoesMensais, [Validators.required, Validators.min(0)]],
      possuiConcierge: [plano.possuiConcierge],
      conciergeUploadsMensais: [plano.conciergeUploadsMensais],
      slaAtendimentoHoras: [plano.slaAtendimentoHoras, [Validators.required, Validators.min(1)]],
      prioridadeFila: [plano.prioridadeFila || 'NORMAL', Validators.required],
      precoMensal: [plano.precoMensal, [Validators.required, Validators.min(0)]],
      precoSemestral: [plano.precoSemestral, [Validators.required, Validators.min(0)]],
      precoAnual: [plano.precoAnual, [Validators.required, Validators.min(0)]],
      ativo: [plano.ativo !== undefined ? plano.ativo : true]
    });

    // Handle toggle behaviour for concierge limits field
    this.form.get('possuiConcierge')?.valueChanges.subscribe(val => {
      const uploadCtrl = this.form.get('conciergeUploadsMensais');
      if (!val) {
        uploadCtrl?.disable();
        uploadCtrl?.setValue(0);
      } else {
        uploadCtrl?.enable();
      }
    });

    if (!plano.possuiConcierge) {
      this.form.get('conciergeUploadsMensais')?.disable();
    }
  }

  salvar() {
    if (this.form.invalid) return;

    this.saving.set(true);
    
    // Make sure we include disabled fields when sending
    const dadosForm = this.form.getRawValue();
    
    const obs$ = this.isNew() 
      ? this.billingService.createPlan(dadosForm)
      : this.billingService.updatePlan(this.planoId(), dadosForm);

    obs$.subscribe({
      next: () => {
        this.notificationService.success(`Plano "${dadosForm.nome}" ${this.isNew() ? 'criado' : 'atualizado'} com sucesso!`);
        this.router.navigate(['/admin/planos']);
      },
      error: (err) => {
        this.notificationService.error(err?.error?.message || 'Ocorreu um erro ao salvar o plano.');
        this.saving.set(false);
      }
    });
  }
}
