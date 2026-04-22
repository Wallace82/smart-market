import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

export interface Offer {
  id: string;
  productName: string;
  category: string;
  originalPrice: string;
  discountPrice: string;
  status: 'Ativa' | 'Programada' | 'Expirada';
  validUntil: string;
  imageUrl: string;
}

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule, 
    MatMenuModule
  ],
  templateUrl: './offer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferListComponent {
  public offers = signal<Offer[]>([
    { id: '1', productName: 'Arroz Branco Tipo 1 5kg', category: 'Mercearia', originalPrice: '24,90', discountPrice: '19,90', status: 'Ativa', validUntil: '30/04/2026', imageUrl: 'assets/images/cache/arroz.jpg' },
    { id: '2', productName: 'Cerveja Heineken 330ml', category: 'Bebidas', originalPrice: '6,50', discountPrice: '4,99', status: 'Ativa', validUntil: '25/04/2026', imageUrl: 'assets/images/cache/cerveja.png' },
    { id: '3', productName: 'Costela Bovina Ripa 1kg', category: 'Açougue', originalPrice: '35,90', discountPrice: '29,90', status: 'Programada', validUntil: '05/05/2026', imageUrl: 'assets/images/cache/costela.png' },
    { id: '4', productName: 'Detergente Líquido Ypê', category: 'Limpeza', originalPrice: '2,50', discountPrice: '1,99', status: 'Expirada', validUntil: '15/04/2026', imageUrl: 'assets/images/cache/detergente.png' },
  ]);

  public activeOffersCount = signal(this.offers().filter(o => o.status === 'Ativa').length);
  public totalOffersCount = signal(this.offers().length);
}