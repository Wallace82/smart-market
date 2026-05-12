import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupermarketService } from './supermarket.service';
import { EncarteService } from './encarte.service';
import { OfertaService } from './oferta.service';
import { SupermarketResponse } from '../models/supermarket.model';
import { EncarteDigitalResponse } from '../models/encarte.model';
import { OfertaSupermercado } from './oferta.service';

@Injectable({
  providedIn: 'root'
})
export class PublicCatalogService {
  private supermarketService = inject(SupermarketService);
  private encarteService = inject(EncarteService);
  private ofertaService = inject(OfertaService);

  public userSelectedAddress = signal<string | null>(null);
  public userSelectedRadius = signal<number>(5); // Default 5km

  getNearbySupermarkets(lat: number, lng: number): Observable<any[]> {
    return this.supermarketService.listarProximos(lat, lng, this.userSelectedRadius() * 1000).pipe(
      map(stores => stores.map(s => ({
        id: s.id,
        name: s.nomeFantasia,
        logoUrl: s.urlLogomarca || `https://ui-avatars.com/api/?name=${s.nomeFantasia}&background=16a34a&color=fff&size=128`,
        primaryColor: s.corPrimariaHex || '#16a34a',
        distanceKm: 0.5 // Mock distance for now as backend might not return it
      })))
    );
  }

  getActiveFlyersNearby(lat: number, lng: number): Observable<any[]> {
    // Orquestração: Busca lojas e depois encartes dessas lojas
    return this.supermarketService.listarProximos(lat, lng, this.userSelectedRadius() * 1000).pipe(
      switchMap(stores => {
        if (stores.length === 0) return of([]);
        
        const requests = stores.map(s => 
          this.encarteService.listarEncartes(s.id).pipe(
            map(encartes => encartes.filter(e => e.status === 'PUBLICADO').map(e => ({
              ...e,
              supermarketName: s.nomeFantasia
            }))),
            catchError(() => of([]))
          )
        );
        
        return forkJoin(requests).pipe(
          map(results => results.flat().map(e => ({
            id: e.id,
            supermarketId: e.supermercadoId,
            supermarketName: e.supermarketName,
            title: e.titulo,
            imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', // Fallback image
            expiresInDays: 3 // Mocked
          })))
        );
      })
    );
  }

  getTrendingOffersNearby(lat: number, lng: number): Observable<any[]> {
    // Similar à lógica de encartes, mas para ofertas avulsas
    return this.supermarketService.listarProximos(lat, lng, this.userSelectedRadius() * 1000).pipe(
      switchMap(stores => {
        if (stores.length === 0) return of([]);
        
        const requests = stores.map(s => 
          this.ofertaService.buscarPorSupermercado(s.id).pipe(
            map(ofertas => ofertas.filter(o => o.ativo).map(o => ({
              ...o,
              supermarketName: s.nomeFantasia
            }))),
            catchError(() => of([]))
          )
        );
        
        return forkJoin(requests).pipe(
          map(results => results.flat().map(o => ({
            id: o.id,
            productName: o.nomeProduto,
            imageUrl: o.urlImagem || 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=400&q=80',
            originalPrice: o.preco * 1.2, // Mocked
            promotionalPrice: o.preco,
            supermarketId: o.supermercadoId,
            supermarketName: o.supermarketName,
            category: 'Geral'
          })))
        );
      })
    );
  }

  async requestUserLocation(): Promise<{lat: number, lng: number}> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: -23.5505, lng: -46.6333 });
      } else {
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve({ lat: -23.5505, lng: -46.6333 }),
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
