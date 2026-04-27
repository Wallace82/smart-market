import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  ean: string;
  imageUrl: string;
  status: 'active' | 'review' | 'inactive';
  usageCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminCatalogService {
  
  getProducts(): Observable<CatalogProduct[]> {
    return of<CatalogProduct[]>([
      {
        id: 'P001',
        name: 'Coca-Cola Original 2L',
        brand: 'Coca-Cola',
        category: 'Bebidas',
        ean: '7894900011517',
        imageUrl: 'https://placehold.co/100x100/e5e7eb/6b7280?text=Coca-Cola',
        status: 'active',
        usageCount: 1542
      },
      {
        id: 'P002',
        name: 'Leite Integral Italac 1L',
        brand: 'Italac',
        category: 'Laticínios',
        ean: '7898080640232',
        imageUrl: 'https://placehold.co/100x100/e5e7eb/6b7280?text=Leite',
        status: 'active',
        usageCount: 3290
      },
      {
        id: 'P003',
        name: 'Arroz Agulhinha Tipo 1 Camil 5kg',
        brand: 'Camil',
        category: 'Mercearia',
        ean: '7896006711116',
        imageUrl: 'https://placehold.co/100x100/e5e7eb/6b7280?text=Arroz',
        status: 'active',
        usageCount: 2105
      },
      {
        id: 'P004',
        name: 'Feijão Carioca Kicaldo 1kg',
        brand: 'Kicaldo',
        category: 'Mercearia',
        ean: '7898132920045',
        imageUrl: 'https://placehold.co/100x100/e5e7eb/6b7280?text=Feijao',
        status: 'active',
        usageCount: 1890
      },
      {
        id: 'P005',
        name: 'Cerveja Heineken Long Neck 330ml',
        brand: 'Heineken',
        category: 'Bebidas',
        ean: '7891991010856',
        imageUrl: 'https://placehold.co/100x100/e5e7eb/6b7280?text=Heineken',
        status: 'review',
        usageCount: 0
      },
      {
        id: 'P006',
        name: 'Sabão em Pó Omo Lavagem Perfeita 1,6kg',
        brand: 'Omo',
        category: 'Limpeza',
        ean: '7891150061868',
        imageUrl: 'https://placehold.co/100x100/e5e7eb/6b7280?text=Omo',
        status: 'active',
        usageCount: 950
      }
    ]);
  }
}
