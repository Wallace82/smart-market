import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService } from '../services/billing.service';
import { PlanCardComponent } from '../components/plan-card.component';
import { BillingToggleComponent } from '../components/billing-toggle.component';
import { Plano, Assinatura, CicloCobranca } from '@core/models/billing.model';
import { SupermarketService } from '@core/services/supermarket.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule, PlanCardComponent, BillingToggleComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center mb-16">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Escolha o plano ideal para seu negócio
        </h1>
        <p class="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Potencialize suas ofertas e alcance mais clientes com as ferramentas certas do SmartMarket.
        </p>
      </div>

      <app-billing-toggle 
        [currentCycle]="cycle()" 
        (cycleChange)="cycle.set($event)"
      />

      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        @for (plano of plans(); track plano.id) {
          <app-plan-card
            [plano]="plano"
            [cycle]="cycle()"
            [isCurrent]="plano.id === currentSubscription()?.plano?.id"
            (onSelect)="onSelectPlan(plano)"
          />
        } @empty {
          <div class="col-span-full py-12 text-center">
            <div class="animate-pulse flex flex-col items-center">
              <div class="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-7xl px-8">
                <div class="h-96 bg-gray-200 rounded-2xl"></div>
                <div class="h-96 bg-gray-200 rounded-2xl"></div>
                <div class="h-96 bg-gray-200 rounded-2xl"></div>
                <div class="h-96 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="mt-20 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Dúvidas Frequentes</h2>
        <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h3 class="font-bold text-gray-900">Posso trocar de plano a qualquer momento?</h3>
            <p class="text-sm text-gray-600 mt-2">Sim! O upgrade é imediato e o valor pago é creditado na nova assinatura.</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Como funciona o cancelamento?</h3>
            <p class="text-sm text-gray-600 mt-2">Você pode cancelar a renovação automática pelo painel. O plano continuará ativo até o fim do ciclo pago.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PricingPageComponent implements OnInit {
  private billingService = inject(BillingService);
  private supermarketService = inject(SupermarketService);
  private notificationService = inject(NotificationService);

  plans = signal<Plano[]>([]);
  currentSubscription = signal<Assinatura | null>(null);
  cycle = signal<CicloCobranca>('MENSAL');

  ngOnInit() {
    this.loadPlans();
    this.loadCurrentSubscription();
  }

  loadPlans() {
    this.billingService.getPlans().subscribe(plans => this.plans.set(plans));
  }

  loadCurrentSubscription() {
    // Busca o ID do supermercado atual do context/user service
    const supermercadoId = localStorage.getItem('current_supermercado_id');
    if (supermercadoId) {
      this.billingService.getCurrentSubscription(supermercadoId).subscribe({
        next: (sub) => {
          this.currentSubscription.set(sub);
          this.cycle.set(sub.ciclo);
        },
        error: () => this.currentSubscription.set(null)
      });
    }
  }

  onSelectPlan(plano: Plano) {
    const supermercadoId = localStorage.getItem('current_supermercado_id');
    if (!supermercadoId) {
      this.notificationService.error('Selecione um supermercado primeiro.');
      return;
    }

    if (confirm(`Deseja contratar o plano ${plano.nome} no ciclo ${this.cycle()}?`)) {
      this.billingService.subscribe(supermercadoId, plano.id, this.cycle()).subscribe({
        next: (sub) => {
          this.currentSubscription.set(sub);
          this.notificationService.success(`Plano ${plano.nome} contratado com sucesso!`);
        },
        error: (err) => this.notificationService.error('Erro ao contratar plano: ' + err.message)
      });
    }
  }
}
