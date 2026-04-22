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
    { id: 'o1', productName: 'Cerveja Artesanal IPA 500ml', imageUrl: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&w=400&q=80', originalPrice: 18.90, promotionalPrice: 12.99, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Bebidas' },
    { id: 'o2', productName: 'Picanha Bovina Resfriada (Kg)', imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80', originalPrice: 89.90, promotionalPrice: 65.90, supermarketId: '2', supermarketName: 'Mercado da Praça', category: 'Açougue' },
    { id: 'o3', productName: 'Fralda Descartável Mega Pct', imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80', originalPrice: 75.00, promotionalPrice: 59.90, supermarketId: '3', supermarketName: 'Hiper Econômico', category: 'Bebês' },
    { id: 'o4', productName: 'Café Torrado e Moído 500g', imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=400&q=80', originalPrice: 15.50, promotionalPrice: 11.49, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Mercearia' },
    { id: 'o5', productName: 'Azeite de Oliva Extra Virgem', imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', originalPrice: 28.90, promotionalPrice: 22.90, supermarketId: '2', supermarketName: 'Mercado da Praça', category: 'Mercearia' },
    { id: 'o6', productName: 'Detergente Líquido Maçã 500ml', imageUrl: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?auto=format&fit=crop&w=400&q=80', originalPrice: 2.99, promotionalPrice: 1.89, supermarketId: '3', supermarketName: 'Hiper Econômico', category: 'Limpeza' },
    { id: 'o7', productName: 'Vinho Tinto Chileno Reservado', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=400&q=80', originalPrice: 45.00, promotionalPrice: 29.90, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Bebidas' },
    { id: 'o8', productName: 'Maçã Gala (Kg)', imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80', originalPrice: 9.90, promotionalPrice: 5.99, supermarketId: '2', supermarketName: 'Mercado da Praça', category: 'Hortifruti' },
    { id: 'o9', productName: 'Arroz Agulhinha Tipo 1 5kg', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=400&q=80', originalPrice: 25.90, promotionalPrice: 21.90, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Mercearia' },
    { id: 'o10', productName: 'Feijão Carioca 1kg', imageUrl: 'https://images.unsplash.com/photo-1551529834-525807d6b4f3?auto=format&fit=crop&w=400&q=80', originalPrice: 8.50, promotionalPrice: 6.99, supermarketId: '3', supermarketName: 'Hiper Econômico', category: 'Mercearia' },
    { id: 'o11', productName: 'Leite Integral 1L', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', originalPrice: 5.50, promotionalPrice: 4.49, supermarketId: '2', supermarketName: 'Mercado da Praça', category: 'Laticínios' },
    { id: 'o12', productName: 'Queijo Mussarela (Kg)', imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80', originalPrice: 45.00, promotionalPrice: 38.90, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Laticínios' },
    { id: 'o13', productName: 'Sabão em Pó 1kg', imageUrl: 'https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&w=400&q=80', originalPrice: 12.90, promotionalPrice: 9.90, supermarketId: '3', supermarketName: 'Hiper Econômico', category: 'Limpeza' },
    { id: 'o14', productName: 'Biscoito Recheado Chocolate', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80', originalPrice: 3.50, promotionalPrice: 2.49, supermarketId: '1', supermarketName: 'Supermercado Central', category: 'Mercearia' },
    { id: 'o15', productName: 'Refrigerante Cola 2L', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80', originalPrice: 8.90, promotionalPrice: 6.99, supermarketId: '2', supermarketName: 'Mercado da Praça', category: 'Bebidas' }
  ];

  private mockFlyers: MockFlyer[] = [
    { id: 'f1', supermarketId: '1', supermarketName: 'Supermercado Central', title: 'Especial Churrasco & Bebidas', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', expiresInDays: 2 },
    { id: 'f2', supermarketId: '2', supermarketName: 'Mercado da Praça', title: 'Quinta do Hortifruti', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', expiresInDays: 1 },
    { id: 'f3', supermarketId: '3', supermarketName: 'Hiper Econômico', title: 'Quinzena da Limpeza', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', expiresInDays: 5 },
    { id: 'f4', supermarketId: '1', supermarketName: 'Supermercado Central', title: 'Festival de Inverno', imageUrl: 'https://images.unsplash.com/photo-1575037614876-c38e4d28dbd6?auto=format&fit=crop&w=600&q=80', expiresInDays: 7 },
    { id: 'f5', supermarketId: '2', supermarketName: 'Mercado da Praça', title: 'Fim de Semana Maluco', imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=600&q=80', expiresInDays: 3 }
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

  getAllFlyers(): Observable<MockFlyer[]> {
    return of(this.mockFlyers).pipe(delay(700)); // Simula latência de 700ms
  }

  requestUserLocation(): Promise<{lat: number, lng: number}> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: -23.5505, lng: -46.6333 }); // Fallback SP caso navegador não suporte
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.warn('Geolocalização bloqueada ou indisponível. Usando fallback.', error);
            resolve({ lat: -23.5505, lng: -46.6333 }); // Fallback SP
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    });
  }

  getSupermarketById(id: string): Observable<MockSupermarket | undefined> {
    const supermarket = this.mockSupermarkets.find(s => s.id === id);
    return of(supermarket).pipe(delay(500));
  }

  getOffersBySupermarket(id: string): Observable<MockOffer[]> {
    const offers = this.mockOffers.filter(o => o.supermarketId === id);
    return of(offers).pipe(delay(500));
  }

  getAllOffers(filters?: { search?: string, category?: string, supermarketId?: string }): Observable<MockOffer[]> {
    let filtered = [...this.mockOffers];
    if (filters) {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        filtered = filtered.filter(o => o.productName.toLowerCase().includes(term));
      }
      if (filters.category) {
        filtered = filtered.filter(o => o.category === filters.category);
      }
      if (filters.supermarketId) {
        filtered = filtered.filter(o => o.supermarketId === filters.supermarketId);
      }
    }
    return of(filtered).pipe(delay(600));
  }

  getFlyersBySupermarket(id: string): Observable<MockFlyer[]> {
    const flyers = this.mockFlyers.filter(f => f.supermarketId === id);
    return of(flyers).pipe(delay(500));
  }


  async getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    try {
      // Uso da API pública Nominatim (OpenStreetMap) para Reverse Geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      if (!response.ok) return 'Sua Localização';
      
      const data = await response.json();
      const street = data?.address?.road || data?.address?.suburb || 'Sua Localização';
      const city = data?.address?.city || data?.address?.town || '';
      return city ? `${street}, ${city}` : street;
    } catch (error) {
      return 'Sua Localização';
    }
  }
}