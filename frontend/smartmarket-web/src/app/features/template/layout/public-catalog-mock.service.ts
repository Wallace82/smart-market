import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface MockSupermarket {
  id: string;
  name: string;
  distanceKm: number;
  logoUrl: string;
  primaryColor: string;
}

export interface MockOffer {
  id: string;
  productName: string;
  imageUrl: string;
  originalPrice: number;
  promotionalPrice: number;
  supermarketId: string;
  supermarketName: string;
  category: string;
}

export interface MockFlyer {
  id: string;
  supermarketId: string;
  supermarketName: string;
  title: string;
  imageUrl: string;
  expiresInDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class PublicCatalogMockService {

  private mockSupermarkets: MockSupermarket[] = [
    { id: '1', name: 'Supermercado Central', distanceKm: 0.8, logoUrl: 'https://ui-avatars.com/api/?name=SC&background=16a34a&color=fff&size=128', primaryColor: '#16a34a' },
    { id: '2', name: 'Mercado da Praça', distanceKm: 1.5, logoUrl: 'https://ui-avatars.com/api/?name=MP&background=0284c7&color=fff&size=128', primaryColor: '#0284c7' },
    { id: '3', name: 'Hiper Econômico', distanceKm: 2.9, logoUrl: 'https://ui-avatars.com/api/?name=HE&background=ea580c&color=fff&size=128', primaryColor: '#ea580c' }
  ];

  private mockOffers: MockOffer[] = [
    { id: 'o1', productName: 'Cerveja Artesanal IPA 500ml', imageUrl: 'https://images.unsplash.com/photo-1655060855734-706a1a1f0a5e?auto=format&fit=crop&w=400&q=80', originalPrice: 18.90, promotionalPrice: 12.99, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Bebidas' },
    { id: 'o2', productName: 'Picanha Bovina Resfriada (Kg)', imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=400&q=80', originalPrice: 89.90, promotionalPrice: 65.90, supermarketId: '2', supermarketName: 'Mercado da Praça', category: 'Açougue' },
    { id: 'o3', productName: 'Fralda Descartável Mega Pct', imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80', originalPrice: 75.00, promotionalPrice: 59.90, supermarketId: '3', supermarketName: 'Hiper Econômico', category: 'Bebês' },
    { id: 'o4', productName: 'Café Torrado e Moído 500g', imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=400&q=80', originalPrice: 15.50, promotionalPrice: 11.49, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Mercearia' },
    { id: 'o5', productName: 'Azeite de Oliva Extra Virgem', imageUrl: 'https://images.unsplash.com/photo-1474965044302-7c385c7c25bc?auto=format&fit=crop&w=400&q=80', originalPrice: 28.90, promotionalPrice: 22.90, supermarketId: '2', supermarketName: 'Mercado da Praça', category: 'Mercearia' },
    { id: 'o6', productName: 'Detergente Líquido Maçã 500ml', imageUrl: 'https://images.unsplash.com/photo-1584820927498-cafea62174dc?auto=format&fit=crop&w=400&q=80', originalPrice: 2.99, promotionalPrice: 1.89, supermarketId: '3', supermarketName: 'Hiper Econômico', category: 'Limpeza' },
    { id: 'o7', productName: 'Vinho Tinto Chileno Reservado', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=400&q=80', originalPrice: 45.00, promotionalPrice: 29.90, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Bebidas' },
    { id: 'o8', productName: 'Maçã Gala (Kg)', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=400&q=80', originalPrice: 9.90, promotionalPrice: 5.99, supermarketId: '2', supermarketName: 'Mercado da Praça', category: 'Hortifruti' }
  ];

  private mockFlyers: MockFlyer[] = [
    { id: 'f1', supermarketId: '1', supermarketName: 'Supermercado Central', title: 'Especial Churrasco & Bebidas', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', expiresInDays: 2 },
    { id: 'f2', supermarketId: '2', supermarketName: 'Mercado da Praça', title: 'Quinta do Hortifruti', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', expiresInDays: 1 },
    { id: 'f3', supermarketId: '3', supermarketName: 'Hiper Econômico', title: 'Quinzena da Limpeza', imageUrl: 'https://images.unsplash.com/photo-1584820927508-cade28014bd0?auto=format&fit=crop&w=600&q=80', expiresInDays: 5 }
  ];

  getNearbySupermarkets(lat: number, lng: number): Observable<MockSupermarket[]> {
    const nearby = this.mockSupermarkets.filter(s => s.distanceKm <= 3.0);
    return of(nearby).pipe(delay(800)); // Simula latência de 800ms
  }

  getTrendingOffersNearby(): Observable<MockOffer[]> {
    return of(this.mockOffers).pipe(delay(1000)); // Simula latência de 1s
  }

  getActiveFlyersNearby(): Observable<MockFlyer[]> {
    return of(this.mockFlyers).pipe(delay(900)); // Simula latência de 900ms
  }

  requestUserLocation(): Promise<{lat: number, lng: number}> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ lat: -23.5505, lng: -46.6333 }), 500);
    });
  }
}