import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardService, SubscriptionData } from '../services/admin-dashboard.service';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-subscriptions.component.html'
})
export class AdminSubscriptionsComponent implements OnInit {
  private service = inject(AdminDashboardService);
  
  subs: SubscriptionData[] = [];
  loading = true;

  ngOnInit() {
    this.service.getSubscriptions().subscribe({
      next: (res) => {
        this.subs = res;
        this.loading = false;
      }
    });
  }
}
