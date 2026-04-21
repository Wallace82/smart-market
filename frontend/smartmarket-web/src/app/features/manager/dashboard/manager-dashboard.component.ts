import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

interface Metric { title: string; value: string; icon: string; colorClass: string; }
interface ChartData { day: string; pushes: number; visits: number; heightPush: string; heightVisit: string; }

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './manager-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagerDashboardComponent implements OnInit {
  loading = signal(true);
  metrics = signal<Metric[]>([]);
  chartData = signal<ChartData[]>([]);
  
  ngOnInit() {
     // Simula a busca de métricas principais
     of([
        { title: 'Encartes Ativos', value: '3', icon: 'auto_stories', colorClass: 'text-blue-500' },
        { title: 'Pushes Enviados (Raio 3km)', value: '1.240', icon: 'campaign', colorClass: 'text-orange-500' },
        { title: 'Taxa de Abertura (CTR)', value: '18.5%', icon: 'ads_click', colorClass: 'text-green-500' },
        { title: 'Visitas Físicas (Geofence)', value: '312', icon: 'directions_walk', colorClass: 'text-purple-500' }
     ]).pipe(delay(600)).subscribe(m => this.metrics.set(m));

     // Simula a busca de dados para o gráfico de conversão Físico-Digital
     of([
        { day: 'Seg', pushes: 150, visits: 20, heightPush: '40%', heightVisit: '20%' },
        { day: 'Ter', pushes: 200, visits: 35, heightPush: '50%', heightVisit: '35%' },
        { day: 'Qua', pushes: 100, visits: 15, heightPush: '30%', heightVisit: '15%' },
        { day: 'Qui', pushes: 300, visits: 80, heightPush: '80%', heightVisit: '60%' },
        { day: 'Sex', pushes: 400, visits: 120, heightPush: '100%', heightVisit: '90%' },
        { day: 'Sáb', pushes: 350, visits: 110, heightPush: '90%', heightVisit: '85%' },
        { day: 'Dom', pushes: 250, visits: 60, heightPush: '70%', heightVisit: '50%' },
     ]).pipe(delay(800)).subscribe(d => {
        this.chartData.set(d);
        this.loading.set(false); // Remove o loading após carregar tudo
     });
  }
}