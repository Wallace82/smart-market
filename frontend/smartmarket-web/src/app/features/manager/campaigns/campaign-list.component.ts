import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Campaign {
  id: string;
  name: string;
  segment: string;
  radius: string;
  status: 'Ativa' | 'Pausada' | 'Concluída';
  pushesSent: number;
  conversions: number;
}

@Component({
  selector: 'app-campaign-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './campaign-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent {
  public campaigns = signal<Campaign[]>([
    { id: '1', name: 'Oferta de Picanha FDS', segment: 'Amantes de Churrasco', radius: '3 km', status: 'Ativa', pushesSent: 1540, conversions: 120 },
    { id: '2', name: 'Fraldas em Promoção', segment: 'Pais e Mães', radius: '5 km', status: 'Ativa', pushesSent: 890, conversions: 45 },
    { id: '3', name: 'Festival de Cervejas', segment: 'Bebidas Alcoólicas', radius: '2 km', status: 'Pausada', pushesSent: 3200, conversions: 310 },
    { id: '4', name: 'Limpeza Pesada', segment: 'Geral', radius: '1 km', status: 'Concluída', pushesSent: 500, conversions: 22 },
  ]);

  public activeCount = signal(this.campaigns().filter(c => c.status === 'Ativa').length);
  public totalConversions = signal(this.campaigns().reduce((acc, curr) => acc + curr.conversions, 0));
}