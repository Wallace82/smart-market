import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plano, CicloCobranca } from '@core/models/billing.model';

@Component({
  selector: 'app-plan-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl h-full"
      [class.border-primary]="isPopular()"
      [class.border-gray-100]="!isPopular()"
      [class.scale-105]="isPopular()"
      [class.z-10]="isPopular()"
      [class.bg-white]="true"
    >
      @if (isPopular()) {
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
          Mais Popular
        </div>
      }

      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-900">{{ plano().nome }}</h3>
        <p class="text-sm text-gray-500 mt-1">Ideal para {{ planDescription() }}</p>
      </div>

      <div class="mb-6">
        <div class="flex items-baseline">
          <span class="text-3xl font-extrabold text-gray-900">R$ {{ displayPrice() }}</span>
          <span class="text-gray-500 ml-1">/mês</span>
        </div>
        @if (cycle() !== 'MENSAL') {
          <p class="text-xs text-green-600 font-semibold mt-1">
            Cobrado anualmente (Economia de {{ discountPercent() }}%)
          </p>
        }
      </div>

      <ul class="flex-1 space-y-4 mb-8">
        <li class="flex items-start text-sm text-gray-600">
          <span class="material-icons text-primary text-base mr-3 mt-1">check_circle</span>
          <span>Até <strong>{{ plano().limiteOfertasMensais }}</strong> ofertas/mês</span>
        </li>
        <li class="flex items-start text-sm text-gray-600">
          <span class="material-icons text-primary text-base mr-3 mt-1">check_circle</span>
          <span>{{ plano().limiteEncartesAtivos }} encartes ativos</span>
        </li>
        <li class="flex items-start text-sm text-gray-600">
          <span class="material-icons text-primary text-base mr-3 mt-1">check_circle</span>
          <span>Raio de {{ plano().raioAtuacaoKm }}km</span>
        </li>
        <li class="flex items-start text-sm text-gray-600">
          <span class="material-icons text-primary text-base mr-3 mt-1">check_circle</span>
          <span>{{ plano().limiteNotificacoesMensais > 0 ? plano().limiteNotificacoesMensais : 'Sem' }} notificações/mês</span>
        </li>
        
        @if (plano().possuiConcierge) {
          <li class="flex items-start text-sm text-gray-600">
            <span class="material-icons text-primary text-base mr-3 mt-1">auto_fix_high</span>
            <span>Concierge: <strong>{{ plano().conciergeUploadsMensais || 'Ilimitado' }}</strong> envios</span>
          </li>
        } @else {
          <li class="flex items-start text-sm text-gray-400 line-through">
            <span class="material-icons text-gray-300 text-base mr-3 mt-1">block</span>
            <span>Sem serviço de Concierge</span>
          </li>
        }

        <li class="flex items-start text-sm text-gray-600 font-medium">
          <span class="material-icons text-primary text-base mr-3 mt-1">schedule</span>
          <span>SLA de {{ plano().slaAtendimentoHoras }}h</span>
        </li>
      </ul>

      <button 
        (click)="onSelect.emit()"
        class="w-full py-3 px-6 rounded-xl font-bold transition-all duration-300"
        [class.bg-primary]="!isCurrent()"
        [class.text-white]="!isCurrent()"
        [class.hover:bg-primary-dark]="!isCurrent()"
        [class.bg-gray-100]="isCurrent()"
        [class.text-gray-400]="isCurrent()"
        [class.cursor-not-allowed]="isCurrent()"
        [disabled]="isCurrent()"
      >
        {{ isCurrent() ? 'Plano Atual' : 'Escolher Plano' }}
      </button>
    </div>
  `
})
export class PlanCardComponent {
  plano = input.required<Plano>();
  cycle = input.required<CicloCobranca>();
  isCurrent = input<boolean>(false);
  onSelect = output<void>();

  isPopular = computed(() => this.plano().nome === 'PRO');

  displayPrice = computed(() => {
    const p = this.plano();
    switch (this.cycle()) {
      case 'MENSAL': return p.precoMensal;
      case 'SEMESTRAL': return (p.precoSemestral / 6).toFixed(2);
      case 'ANUAL': return (p.precoAnual / 12).toFixed(2);
      default: return p.precoMensal;
    }
  });

  discountPercent = computed(() => {
    switch (this.cycle()) {
      case 'SEMESTRAL': return 10;
      case 'ANUAL': return 20;
      default: return 0;
    }
  });

  planDescription() {
    switch (this.plano().nome) {
      case 'STARTER': return 'pequenos mercados';
      case 'ESSENCIAL': return 'negócios em crescimento';
      case 'PRO': return 'médios supermercados';
      case 'PREMIUM': return 'grandes redes';
      default: return '';
    }
  }
}
