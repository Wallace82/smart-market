import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CicloCobranca } from '@core/models/billing.model';

@Component({
  selector: 'app-billing-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center space-x-4 mb-8">
      <span [class.text-primary]="currentCycle() === 'MENSAL'" class="text-sm font-medium transition-colors">Mensal</span>
      
      <div class="relative inline-flex h-8 w-64 items-center rounded-full bg-gray-100 p-1">
        <button
          (click)="select('MENSAL')"
          class="flex-1 text-xs font-semibold z-10 transition-colors"
          [class.text-white]="currentCycle() === 'MENSAL'"
        >
          Mensal
        </button>
        <button
          (click)="select('SEMESTRAL')"
          class="flex-1 text-xs font-semibold z-10 transition-colors"
          [class.text-white]="currentCycle() === 'SEMESTRAL'"
        >
          Semestral
          <span class="block text-[8px] opacity-80" [class.text-white]="currentCycle() === 'SEMESTRAL'">10% OFF</span>
        </button>
        <button
          (click)="select('ANUAL')"
          class="flex-1 text-xs font-semibold z-10 transition-colors"
          [class.text-white]="currentCycle() === 'ANUAL'"
        >
          Anual
          <span class="block text-[8px] font-bold" [class.text-white]="currentCycle() === 'ANUAL'">20% OFF</span>
        </button>
        
        <div
          class="absolute h-6 w-[calc(100%/3-4px)] rounded-full bg-primary transition-all duration-300 ease-out"
          [style.left]="indicatorPosition()"
        ></div>
      </div>

      <span [class.text-primary]="currentCycle() === 'ANUAL'" class="text-sm font-medium transition-colors">Anual</span>
    </div>
  `
})
export class BillingToggleComponent {
  currentCycle = input.required<CicloCobranca>();
  cycleChange = output<CicloCobranca>();

  indicatorPosition() {
    switch (this.currentCycle()) {
      case 'MENSAL': return '2px';
      case 'SEMESTRAL': return 'calc(100%/3 + 2px)';
      case 'ANUAL': return 'calc(200%/3 + 2px)';
      default: return '2px';
    }
  }

  select(cycle: CicloCobranca) {
    this.cycleChange.emit(cycle);
  }
}
