import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface MetricCard {
  title: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  public loading = signal(true);
  public metrics = signal<MetricCard[]>([]);

  ngOnInit(): void {
    // Simula chamada de API com dados mockados
    of([
      { title: 'Supermercados Ativos', value: '14', icon: 'store', color: 'text-blue-500' },
      { title: 'Usuários Totais', value: '2,345', icon: 'group', color: 'text-green-500' },
      { title: 'Encartes Publicados', value: '189', icon: 'feed', color: 'text-orange-500' },
      { title: 'Novos Cadastros (Mês)', value: '3', icon: 'person_add', color: 'text-purple-500' },
    ]).pipe(delay(500)).subscribe(data => {
      this.metrics.set(data);
      this.loading.set(false);
    });
  }
}