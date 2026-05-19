import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, of, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupermarketService } from './supermarket.service';
import { EncarteService } from './encarte.service';
import { OfertaService } from './oferta.service';

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
  public userSelectedRadius = signal<number>(10); // Raio padrão em KM

  /**
   * Inicializa a localização do usuário.
   * Tenta GPS primeiro. Se falhar, usa localização salva ou tenta enriquecer com coords via CEP.
   */
  async initializeLocation(): Promise<void> {
    const saved = localStorage.getItem('user_location');
    if (saved) {
      const loc: UserLocation = JSON.parse(saved);
      // Se a localização salva não tem coordenadas, tenta enriquecer via CEP
      if (!loc.lat && loc.cep) {
        const enriched = await this.enrichLocationWithCoords(loc);
        this.currentLocation.set(enriched);
      } else {
        this.currentLocation.set(loc);
      }
      return;
    }

    try {
      const coords = await this.requestUserLocation();
      const address = await this.getAddressFromCoordinates(coords.lat, coords.lng);
      const loc: UserLocation = { ...coords, address, isGps: true };
      this.setLocation(loc);
    } catch (e) {
      // GPS falhou: usa Brasília como coordenada de fallback genérica
      const loc: UserLocation = { lat: -15.7801, lng: -47.9292, address: 'Brasília, DF', isGps: false };
      this.setLocation(loc);
    }
  }

  /**
   * Enriquece uma localização sem coordenadas usando ViaCEP + Nominatim.
   */
  private async enrichLocationWithCoords(loc: UserLocation): Promise<UserLocation> {
    if (!loc.cep) return loc;
    try {
      const cepNorm = loc.cep.replace(/-/g, '');
      // ViaCEP para obter logradouro/cidade
      const viaCepRes = await fetch(`https://viacep.com.br/ws/${cepNorm}/json/`);
      if (!viaCepRes.ok) return loc;
      const viaCepData = await viaCepRes.json();
      if (viaCepData.erro) return loc;

      const query = `${viaCepData.logradouro || ''} ${viaCepData.localidade} ${viaCepData.uf} Brasil`;
      const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      if (!nomRes.ok) return loc;
      const nomData = await nomRes.json();
      if (!nomData?.length) return loc;

      return {
        ...loc,
        lat: parseFloat(nomData[0].lat),
        lng: parseFloat(nomData[0].lon),
        address: `${viaCepData.logradouro || ''}, ${viaCepData.localidade} - ${viaCepData.uf}`.trim()
      };
    } catch {
      return loc;
    }
  }

  setLocation(loc: UserLocation) {
    this.currentLocation.set(loc);
    localStorage.setItem('user_location', JSON.stringify(loc));
  }

  setManualLocation(cep: string, address: string) {
    this.setLocation({ address, cep, isGps: false });
  }

  /**
   * Busca supermercados próximos usando coordenadas.
   * Se não houver coords, tenta enriquecer via CEP antes de usar fallback total.
   */
  getNearbySupermarkets(): Observable<any[]> {
    const loc = this.currentLocation();
    if (!loc) return this.getAllActiveStores();

    if (loc.lat && loc.lng) {
      // Temos coordenadas: usa Haversine
      return this.supermarketService.listarProximos(loc.lat, loc.lng, this.userSelectedRadius() * 1000).pipe(
        map(stores => this.mapStores(stores)),
        catchError(() => this.getAllActiveStores())
      );
    }

    // Sem coordenadas: tenta enriquecer via CEP e retry
    if (loc.cep) {
      return from(this.enrichLocationWithCoords(loc)).pipe(
        switchMap(enriched => {
          if (enriched.lat && enriched.lng) {
            // Atualiza localização com as coords obtidas (sem salvar no localStorage para não sobrescrever)
            this.currentLocation.set(enriched);
            return this.supermarketService.listarProximos(enriched.lat, enriched.lng, this.userSelectedRadius() * 1000).pipe(
              map(stores => this.mapStores(stores)),
              catchError(() => this.getAllActiveStores())
            );
          }
          return this.getAllActiveStores();
        })
      );
    }

    return this.getAllActiveStores();
  }

  private getAllActiveStores(): Observable<any[]> {
    return this.supermarketService.listarTodos(0, 50).pipe(
      map((res: any) => this.mapStores(res.content || res)),
      catchError(() => of([]))
    );
  }

  getActiveFlyersNearby(): Observable<any[]> {
    return this.getNearbySupermarkets().pipe(
      switchMap(stores => {
        if (stores.length === 0) return of([]);

        const requests = stores.map(s =>
          this.encarteService.listarEncartes(s.id).pipe(
            map(encartes => encartes.filter(e => e.status === 'ATIVO').map(e => ({
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
            map(ofertas => ofertas.filter((o: any) => o.ativo).map((o: any) => ({
              ...o,
              supermarketName: s.name
            }))),
            catchError(() => of([]))
          )
        );

        return forkJoin(requests).pipe(
          map(results => results.flat().map((o: any) => ({
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
      distanceKm: s.distance_meters ? (s.distance_meters / 1000).toFixed(1) : '< 1'
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
