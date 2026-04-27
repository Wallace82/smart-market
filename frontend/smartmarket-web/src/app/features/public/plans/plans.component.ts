import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlansService, Plan } from './services/plans.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plans.component.html'
})
export class PlansComponent implements OnInit {
  private plansService = inject(PlansService);
  
  plans: Plan[] = [];
  loading = true;

  ngOnInit() {
    this.plansService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
