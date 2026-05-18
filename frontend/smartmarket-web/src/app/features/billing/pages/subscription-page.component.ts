import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService } from '../services/billing.service';
import { Assinatura, CicloCobranca } from '@core/models/billing.model';
import { NotificationService } from '@core/services/notification.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Minha Assinatura</h1>
          <p class="text-sm text-gray-500">Gerencie seu plano e acompanhe o uso de recursos.</p>
        </div>
        <a routerLink="/planos" class="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors">
          Fazer Upgrade
        </a>
      </div>

      @if (subscription(); as sub) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Plano Atual</span>
            <div class="mt-2 text-xl font-extrabold text-primary">{{ sub.plano.nome }}</div>
            <div class="text-xs text-gray-500 mt-1">Ciclo {{ sub.ciclo | titlecase }}</div>
          </div>
          
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</span>
            <div class="mt-2 flex items-center">
              <span 
                class="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                [class.bg-green-100]="sub.status === 'ATIVA'"
                [class.text-green-700]="sub.status === 'ATIVA'"
                [class.bg-yellow-100]="sub.status === 'AGUARDANDO_PAGAMENTO'"
                [class.text-yellow-700]="sub.status === 'AGUARDANDO_PAGAMENTO'"
              >
                {{ sub.status }}
              </span>
            </div>
            <div class="text-xs text-gray-500 mt-1">Desde {{ sub.dataInicio | date:'dd/MM/yyyy' }}</div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Próxima Cobrança</span>
            <div class="mt-2 text-xl font-extrabold text-gray-900">{{ sub.dataFim | date:'dd/MM/yyyy' }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ sub.renovacaoAutomatica ? 'Renovação Automática' : 'Expira em breve' }}</div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Uso de Recursos (Mês Atual)</h2>
          
          <div class="space-y-8">
            <!-- Ofertas -->
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="font-medium text-gray-700">Ofertas Ativas</span>
                <span class="text-gray-500">12 / {{ sub.plano.limiteOfertasMensais }}</span>
              </div>
              <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-primary transition-all duration-500" [style.width]="'40%'"></div>
              </div>
            </div>

            <!-- Encartes -->
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="font-medium text-gray-700">Encartes Ativos</span>
                <span class="text-gray-500">1 / {{ sub.plano.limiteEncartesAtivos }}</span>
              </div>
              <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-primary transition-all duration-500" [style.width]="'33%'"></div>
              </div>
            </div>

            <!-- Concierge -->
            @if (sub.plano.possuiConcierge) {
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="font-medium text-gray-700">Solicitações Concierge</span>
                  <span class="text-gray-500">
                    {{ sub.plano.conciergeUploadsMensais ? '0 / ' + sub.plano.conciergeUploadsMensais : 'Uso Ilimitado' }}
                  </span>
                </div>
                <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-500" [style.width]="'5%'"></div>
                </div>
              </div>
            } @else {
              <div class="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <span class="material-icons mr-3">lock</span>
                  Concierge não disponível no seu plano.
                </div>
                <a routerLink="/planos" class="text-xs font-bold text-primary hover:underline">Ver planos</a>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div class="text-gray-400 mb-4">
            <span class="material-icons text-5xl">payments</span>
          </div>
          <h2 class="text-xl font-bold text-gray-900">Nenhuma assinatura ativa</h2>
          <p class="text-gray-500 mt-2 mb-8">Comece agora a divulgar suas ofertas com o SmartMarket.</p>
          <a routerLink="/planos" class="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
            Ver Planos Disponíveis
          </a>
        </div>
      }
    </div>
  `
})
export class SubscriptionPageComponent implements OnInit {
  private billingService = inject(BillingService);
  private notificationService = inject(NotificationService);

  subscription = signal<Assinatura | null>(null);

  ngOnInit() {
    this.loadSubscription();
  }

  loadSubscription() {
    const supermercadoId = localStorage.getItem('current_supermercado_id');
    if (supermercadoId) {
      this.billingService.getCurrentSubscription(supermercadoId).subscribe({
        next: (sub) => this.subscription.set(sub),
        error: () => this.subscription.set(null)
      });
    }
  }
}
