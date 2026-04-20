import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: 'Ativo' | 'Inativo' | 'Sem Estoque';
  imageUrl: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  // Mock de Banco de Dados de Produtos utilizando as suas imagens locais
  public products = signal<Product[]>([
    { id: '101', name: 'Arroz Branco Tipo 1 5kg', category: 'Mercearia', price: '24,90', stock: 150, status: 'Ativo', imageUrl: 'assets/images/cache/arroz.jpg' },
    { id: '102', name: 'Cerveja Heineken 330ml', category: 'Bebidas', price: '6,50', stock: 85, status: 'Ativo', imageUrl: 'assets/images/cache/cerveja.png' },
    { id: '103', name: 'Costela Bovina Ripa 1kg', category: 'Açougue', price: '35,90', stock: 0, status: 'Sem Estoque', imageUrl: 'assets/images/cache/costela.png' },
    { id: '104', name: 'Detergente Líquido Ypê', category: 'Limpeza', price: '2,50', stock: 320, status: 'Ativo', imageUrl: 'assets/images/cache/detergente.png' },
    // Produto sem imagem local utilizando um placeholder padronizado
    { id: '105', name: 'Pão de Forma Tradicional', category: 'Padaria', price: '7,99', stock: 12, status: 'Inativo', imageUrl: 'https://ui-avatars.com/api/?name=Pao&background=f3f4f6&color=4b5563' },
  ]);

  // Contadores Reativos
  public totalProducts = signal(this.products().length);
  public outOfStock = signal(this.products().filter(p => p.status === 'Sem Estoque').length);
}