import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardService, FinancialData } from '../services/admin-dashboard.service';

@Component({
  selector: 'app-admin-financial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-financial.component.html'
})
export class AdminFinancialComponent implements OnInit {
  private service = inject(AdminDashboardService);
  
  data: FinancialData | null = null;
  loading = true;

  ngOnInit() {
    this.service.getFinancialSummary().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      }
    });
  }
}
