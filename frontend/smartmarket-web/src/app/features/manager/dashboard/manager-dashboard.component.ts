import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './manager-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent implements OnInit {
  public loading = signal(true);
  
  // Dados Reativos
  public metrics = signal<{title: string, value: string, icon: string, color: string, bgColor: string}[]>([]);
  public salesChart = signal<{day: string, value: number, height: string}[]>([]);
  public topProducts = signal<{name: string, category: string, views: number, trend: 'up' | 'down', imageUrl: string}[]>([]);

  ngOnInit(): void {
    // Mock de Métricas (Foco em Vendas e Engajamento)
    of([
      { title: 'Vendas Hoje', value: 'R$ 4.250', icon: 'payments', color: 'text-green-600', bgColor: 'bg-green-50' },
      { title: 'Pedidos Pendentes', value: '12', icon: 'shopping_basket', color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'Produtos Ativos', value: '1.430', icon: 'inventory_2', color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { title: 'Visualizações de Encartes', value: '8.902', icon: 'visibility', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    ]).pipe(delay(400)).subscribe(data => this.metrics.set(data));

    // Mock do Gráfico de Vendas Semanais
    of([
      { day: 'Seg', value: 3200, height: '45%' },
      { day: 'Ter', value: 4100, height: '60%' },
      { day: 'Qua', value: 2800, height: '35%' },
      { day: 'Qui', value: 5000, height: '75%' },
      { day: 'Sex', value: 7200, height: '100%' }, // Pico na sexta-feira
      { day: 'Sáb', value: 6800, height: '90%' },
      { day: 'Dom', value: 5400, height: '80%' },
    ]).pipe(delay(500)).subscribe(data => this.salesChart.set(data));

    // Mock de Produtos mais acessados
    of([
      { name: 'Costela Bovina Ripa', category: 'Açougue', views: 450, trend: 'up' as const, imageUrl: 'assets/images/cache/costela.png' },
      { name: 'Cerveja Heineken 330ml', category: 'Bebidas', views: 380, trend: 'up' as const, imageUrl: 'assets/images/cache/cerveja.png' },
      { name: 'Detergente em Pó Ypê', category: 'Limpeza', views: 210, trend: 'down' as const, imageUrl: 'assets/images/cache/detergente.png' },
      { name: 'Arroz Branco Tipo 1 5kg', category: 'Mercearia', views: 195, trend: 'up' as const, imageUrl: 'assets/images/cache/arroz.jpg' },
    ]).pipe(delay(600)).subscribe(data => this.topProducts.set(data));

    // Libera a tela
    of(true).pipe(delay(700)).subscribe(() => this.loading.set(false));
  }
}