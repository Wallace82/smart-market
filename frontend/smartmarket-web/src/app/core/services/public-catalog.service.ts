import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupermarketService } from './supermarket.service';
import { EncarteService } from './encarte.service';
import { OfertaService } from './oferta.service';
import { SupermarketResponse } from '../models/supermarket.model';
import { EncarteDigitalResponse } from '../models/encarte.model';
import { OfertaSupermercado } from './oferta.service';

export interface UserLocation {
  lat?: number;
  lng?: number;
  address: string;
  cep?: string;
  bairro?: string;
  isGps: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PublicCatalogService {
  private supermarketService = inject(SupermarketService);
  private encarteService = inject(EncarteService);
  private ofertaService = inject(OfertaService);

  // Estados Reativos de Localização
  public currentLocation = signal<UserLocation | null>(null);
  public userSelectedRadius = signal<number>(3); // Raio padrão em KM

  /**
   * Inicializa a localização do usuário. 
   * Tenta GPS primeiro, se falhar ou se já houver preferência salva, usa a salva.
   */
  async initializeLocation(): Promise<void> {
    const saved = localStorage.getItem('user_location');
    if (saved) {
      this.currentLocation.set(JSON.parse(saved));
      return;
    }

    try {
      const coords = await this.requestUserLocation();
      const address = await this.getAddressFromCoordinates(coords.lat, coords.lng);
      const loc: UserLocation = { ...coords, address, isGps: true };
      this.setLocation(loc);
    } catch (e) {
      // Fallback para localização padrão (ex: São Paulo) se GPS falhar
      const loc: UserLocation = { lat: -23.5505, lng: -46.6333, address: 'São Paulo, SP', isGps: false };
      this.setLocation(loc);
    }
  }

  setLocation(loc: UserLocation) {
    this.currentLocation.set(loc);
    localStorage.setItem('user_location', JSON.stringify(loc));
  }

  setManualLocation(cep: string, address: string) {
    this.setLocation({ address, cep, isGps: false });
  }

  getNearbySupermarkets(): Observable<any[]> {
    const loc = this.currentLocation();
    if (!loc) return of([]);

    if (loc.isGps && loc.lat && loc.lng) {
      return this.supermarketService.listarProximos(loc.lat, loc.lng, this.userSelectedRadius() * 1000).pipe(
        map(stores => this.mapStores(stores))
      );
    } else {
      return this.supermarketService.buscarPorLocalizacao(loc.cep, loc.bairro).pipe(
        map(res => this.mapStores(res.content || res))
      );
    }
  }

  getActiveFlyersNearby(): Observable<any[]> {
    return this.getNearbySupermarkets().pipe(
      switchMap(stores => {
        if (stores.length === 0) return of([]);
        
        const requests = stores.map(s => 
          this.encarteService.listarEncartes(s.id).pipe(
            map(encartes => encartes.filter(e => e.status === 'PUBLICADO').map(e => ({
              ...e,
              supermarketName: s.name,
              supermarketLogo: s.logoUrl
            }))),
            catchError(() => of([]))
          )
        );
        
        return forkJoin(requests).pipe(
          map(results => results.flat().map(e => ({
            id: e.id,
            supermarketId: e.supermercadoId,
            supermarketName: e.supermarketName,
            supermarketLogo: e.supermarketLogo,
            title: e.titulo,
            imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
            expiresInDays: 3
          })))
        );
      })
    );
  }

  getTrendingOffersNearby(): Observable<any[]> {
    return this.getNearbySupermarkets().pipe(
      switchMap(stores => {
        if (stores.length === 0) return of([]);
        
        const requests = stores.map(s => 
          this.ofertaService.buscarPorSupermercado(s.id).pipe(
            map(ofertas => ofertas.filter(o => o.ativo).map(o => ({
              ...o,
              supermarketName: s.name
            }))),
            catchError(() => of([]))
          )
        );
        
        return forkJoin(requests).pipe(
          map(results => results.flat().map(o => ({
            id: o.id,
            productName: o.nomeProduto,
            imageUrl: o.urlImagem || 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=400&q=80',
            originalPrice: o.preco * 1.2,
            promotionalPrice: o.preco,
            supermarketId: o.supermercadoId,
            supermarketName: o.supermarketName,
            category: 'Geral'
          })))
        );
      })
    );
  }

  private mapStores(stores: any[]): any[] {
    return (stores || []).map(s => ({
      id: s.id,
      name: s.nomeFantasia,
      logoUrl: s.urlLogomarca || `https://ui-avatars.com/api/?name=${s.nomeFantasia}&background=16a34a&color=fff&size=128`,
      primaryColor: s.corPrimariaHex || '#16a34a',
      distanceKm: s.distance_meters ? (s.distance_meters / 1000).toFixed(1) : '0.5'
    }));
  }

  async requestUserLocation(): Promise<{lat: number, lng: number}> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
      } else {
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          (err) => reject(err),
          { timeout: 5000 }
        );
      }
    });
  }

  async getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      if (!response.ok) return 'Sua Localização';
      const data = await response.json();
      const street = data?.address?.road || data?.address?.suburb || 'Sua Localização';
      const city = data?.address?.city || data?.address?.town || '';
      return city ? `${street}, ${city}` : street;
    } catch {
      return 'Sua Localização';
    }
  }
}
