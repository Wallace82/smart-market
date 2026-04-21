import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Hotspot {
  x: number; // Porcentagem horizontal
  y: number; // Porcentagem vertical
  productName: string;
  price: number;
  oldPrice?: number;
  category: string;
}

interface FlyerPage {
  id: number;
  imageUrl: string;
  hotspots: Hotspot[];
}

@Component({
  selector: 'app-flyer-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './flyer-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlyerViewerComponent {
  
  // Mocks do Encarte (Simulando o retorno do backend)
  supermarketName = signal('Supermercado Central');
  flyerTitle = signal('Especial Churrasco & Bebidas');

  pages = signal<FlyerPage[]>([
    {
      id: 1,
      // Imagem ilustrativa simulando uma página de encarte de churrasco
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
      hotspots: [
        { x: 35, y: 45, productName: 'Picanha Bovina Maturada', price: 65.90, oldPrice: 89.90, category: 'Açougue' },
        { x: 75, y: 65, productName: 'Cerveja Artesanal IPA', price: 12.99, oldPrice: 18.90, category: 'Bebidas' }
      ]
    },
    {
      id: 2,
      // Imagem ilustrativa simulando hortifruti
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
      hotspots: [
        { x: 50, y: 50, productName: 'Maçã Fuji Premium (Kg)', price: 8.99, category: 'Hortifruti' },
        { x: 20, y: 80, productName: 'Uva Palmer (Bandeja)', price: 12.50, oldPrice: 15.00, category: 'Hortifruti' }
      ]
    }
  ]);

  // Controle de Navegação
  currentPageIndex = signal(0);
  currentPage = computed(() => this.pages()[this.currentPageIndex()]);

  nextPage() {
    if (this.currentPageIndex() < this.pages().length - 1) {
      this.currentPageIndex.update(i => i + 1);
    }
  }

  prevPage() {
    if (this.currentPageIndex() > 0) {
      this.currentPageIndex.update(i => i - 1);
    }
  }

  saveOffer(hotspot: Hotspot) {
    console.log('Oferta salva na lista do usuário: ', hotspot);
  }
}