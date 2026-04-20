import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

export interface Flyer {
  id: string;
  title: string;
  status: 'Ativo' | 'Rascunho' | 'Expirado';
  validUntil: string;
  views: number;
  coverUrl: string;
}

@Component({
  selector: 'app-manager-flyers',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './manager-flyers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerFlyersComponent {
  // Mock de Encartes
  public flyers = signal<Flyer[]>([
    { id: '1', title: 'Ofertas de Fim de Semana', status: 'Ativo', validUntil: '25/04/2026', views: 1240, coverUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=Fim+de+Semana' },
    { id: '2', title: 'Especial de Carnes', status: 'Rascunho', validUntil: '30/04/2026', views: 0, coverUrl: 'https://placehold.co/600x400/ea580c/ffffff?text=Especial+Carnes' },
    { id: '3', title: 'Limpeza em Dobro', status: 'Expirado', validUntil: '15/04/2026', views: 3450, coverUrl: 'https://placehold.co/600x400/9ca3af/ffffff?text=Limpeza' },
    { id: '4', title: 'Festival de Inverno', status: 'Ativo', validUntil: '10/05/2026', views: 890, coverUrl: 'https://placehold.co/600x400/0284c7/ffffff?text=Inverno' },
  ]);

  // Métricas rápidas
  public activeCount = signal(this.flyers().filter(f => f.status === 'Ativo').length);
  public totalViews = signal(this.flyers().reduce((acc, f) => acc + f.views, 0));
}