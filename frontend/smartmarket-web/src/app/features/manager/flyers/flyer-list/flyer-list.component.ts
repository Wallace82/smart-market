import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Flyer {
  id: string;
  title: string;
  theme: string;
  startDate: string;
  endDate: string;
  status: 'Ativo' | 'Programado' | 'Expirado';
  views: number;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-flyer-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './flyer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlyerListComponent {
  public flyers = signal<Flyer[]>([
    { id: '1', title: 'Especial de Aniversário', theme: 'Festa da Loja', startDate: '20/04/2026', endDate: '30/04/2026', status: 'Ativo', views: 1245, thumbnailUrl: 'https://ui-avatars.com/api/?name=Aniversario&background=f59e0b&color=fff' },
    { id: '2', title: 'Festival de Inverno', theme: 'Estações', startDate: '01/06/2026', endDate: '15/06/2026', status: 'Programado', views: 0, thumbnailUrl: 'https://ui-avatars.com/api/?name=Inverno&background=0284c7&color=fff' },
    { id: '3', title: 'Semana do Consumidor', theme: 'Padrão / Clean', startDate: '10/03/2026', endDate: '20/03/2026', status: 'Expirado', views: 3450, thumbnailUrl: 'https://ui-avatars.com/api/?name=Consumidor&background=16a34a&color=fff' },
    { id: '4', title: 'Ofertas de Páscoa', theme: 'Páscoa', startDate: '25/03/2026', endDate: '05/04/2026', status: 'Expirado', views: 5620, thumbnailUrl: 'https://ui-avatars.com/api/?name=Pascoa&background=8b5cf6&color=fff' },
  ]);

  public activeCount = signal(this.flyers().filter(f => f.status === 'Ativo').length);
  public totalViews = signal(this.flyers().reduce((acc, curr) => acc + curr.views, 0));
}