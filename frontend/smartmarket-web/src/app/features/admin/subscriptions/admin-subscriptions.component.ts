import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Services & Models
import { BillingService } from '@core/services/billing.service';
import { SubscriptionResponse } from '@core/models/billing.model';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-subscriptions',
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './admin-subscriptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSubscriptionsComponent implements OnInit {
  private billingService = inject(BillingService);
  private snackBar = inject(MatSnackBar);
  
  // Estados Reativos
  public subs = signal<SubscriptionResponse[]>([]);
  public loading = signal(true);

  ngOnInit() {
    this.loadSubscriptions();
  }

  public loadSubscriptions() {
    this.loading.set(true);
    this.billingService.getSubscriptions().subscribe({
      next: (res) => {
        this.subs.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar assinaturas', err);
        this.loading.set(false);
      }
    });
  }

  public toggleSubscriptionStatus(sub: SubscriptionResponse) {
    const action = sub.status === 'CANCELED' 
      ? this.billingService.reactivateSubscription(sub.id)
      : this.billingService.cancelSubscription(sub.id);

    const message = sub.status === 'CANCELED' ? 'Assinatura reativada!' : 'Assinatura cancelada!';

    action.subscribe({
      next: () => {
        this.snackBar.open(message, 'Sucesso', { duration: 3000 });
        this.loadSubscriptions();
      },
      error: (err) => {
        console.error('Erro ao alterar status da assinatura', err);
        this.snackBar.open('Erro ao alterar status', 'Fechar', { duration: 3000 });
      }
    });
  }
}
