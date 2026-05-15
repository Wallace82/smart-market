import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Services & Models
import { BillingService } from '@core/services/billing.service';
import { FinancialSummaryResponse } from '@core/models/billing.model';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-financial',
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './admin-financial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminFinancialComponent implements OnInit {
  private billingService = inject(BillingService);
  
  // Estados Reativos
  public data = signal<FinancialSummaryResponse | null>(null);
  public loading = signal(true);
  public error = signal<string | null>(null);

  ngOnInit() {
    this.loadFinancialData();
  }

  public loadFinancialData() {
    this.loading.set(true);
    this.error.set(null);
    
    this.billingService.getFinancialSummary().subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados financeiros', err);
        this.error.set('Não foi possível carregar as métricas financeiras no momento.');
        this.loading.set(false);
      }
    });
  }
}
