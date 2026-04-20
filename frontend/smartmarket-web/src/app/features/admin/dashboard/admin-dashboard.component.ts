import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// Componentes
import { MetricCardComponent } from './metric-card.component';

interface MetricCard {
  title: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MetricCardComponent],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  public loading = signal(true);
  public metrics = signal<MetricCard[]>([]);
  
  // Novos dados mockados para interatividade
  public chartData = signal<{label: string, value: number, height: string}[]>([]);
  public recentActivities = signal<{store: string, action: string, time: string, status: string}[]>([]);

  ngOnInit(): void {
    // Simula chamada de API para Métricas Iniciais
    of([
      // Cores atualizadas conforme logomarca (Verde, Azul, Laranja)
      { title: 'Supermercados Ativos', value: '14', icon: 'store', color: 'text-green-600' },
      { title: 'Usuários Totais', value: '2,345', icon: 'group', color: 'text-blue-600' },
      { title: 'Encartes Publicados', value: '189', icon: 'feed', color: 'text-orange-600' },
      { title: 'Novos Cadastros (Mês)', value: '3', icon: 'person_add', color: 'text-green-600' },
    ]).pipe(delay(500)).subscribe(data => {
      this.metrics.set(data);
    });

    // Simula chamada de API para Gráfico de Acessos
    of([
      { label: 'Seg', value: 120, height: '40%' },
      { label: 'Ter', value: 210, height: '70%' },
      { label: 'Qua', value: 150, height: '50%' },
      { label: 'Qui', value: 300, height: '100%' }, // Pico
      { label: 'Sex', value: 250, height: '80%' },
      { label: 'Sáb', value: 180, height: '60%' },
      { label: 'Dom', value: 90,  height: '30%' },
    ]).pipe(delay(500)).subscribe(data => {
      this.chartData.set(data);
    });

    // Simula chamada de API para Tabela de Atividades
    of([
      { store: 'Supermercado Nova Era', action: 'Publicou um novo encarte', time: 'Há 5 min', status: 'success' },
      { store: 'Mercadão Central', action: 'Atualizou preços de hortifruti', time: 'Há 45 min', status: 'info' },
      { store: 'Loja do Bairro', action: 'Assinatura próxima do vencimento', time: 'Há 2 horas', status: 'warning' },
      { store: 'Atacadista Silva', action: 'Novo cadastro na plataforma', time: 'Há 3 horas', status: 'success' },
    ]).pipe(delay(500)).subscribe(data => {
      this.recentActivities.set(data);
    });

    // Libera a tela após o loading simulado
    of(true).pipe(delay(600)).subscribe(() => {
      this.loading.set(false);
    });
  }
}