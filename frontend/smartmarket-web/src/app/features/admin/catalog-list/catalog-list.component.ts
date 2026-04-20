import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface GlobalProduct {
  id: string;
  ean: string;
  name: string;
  category: string;
  status: 'Aprovado' | 'Em Revisão' | 'Inativo';
  imageUrl: string;
}

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './catalog-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogListComponent {
  // Mock do Banco de Dados do Catálogo Global (SmartMarket)
  public globalCatalog = signal<GlobalProduct[]>([
    { id: 'P001', ean: '7891010101010', name: 'Arroz Branco Tipo 1 5kg', category: 'Mercearia', status: 'Aprovado', imageUrl: 'assets/images/cache/arroz.jpg' },
    { id: 'P002', ean: '7892020202020', name: 'Cerveja Heineken 330ml', category: 'Bebidas', status: 'Aprovado', imageUrl: 'assets/images/cache/cerveja.png' },
    { id: 'P003', ean: '7893030303030', name: 'Costela Bovina Ripa 1kg', category: 'Açougue', status: 'Em Revisão', imageUrl: 'assets/images/cache/costela.png' },
    { id: 'P004', ean: '7894040404040', name: 'Detergente Líquido Ypê', category: 'Limpeza', status: 'Aprovado', imageUrl: 'assets/images/cache/detergente.png' },
    { id: 'P005', ean: '7895050505050', name: 'Leite Integral Parmalat 1L', category: 'Laticínios', status: 'Inativo', imageUrl: 'assets/images/cache/leite.jpg' }
  ]);

  // Contadores Reativos para o Topo da Página
  public totalProducts = signal(this.globalCatalog().length);
  public pendingReview = signal(
    this.globalCatalog().filter((p) => p.status === 'Em Revisão').length
  );
  public categoriesCount = signal(5); // Valor demonstrativo
}