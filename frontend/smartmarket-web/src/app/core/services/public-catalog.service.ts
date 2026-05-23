import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, of, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupermarketService } from './supermarket.service';
import { EncarteService } from './encarte.service';
import { OfertaService } from './oferta.service';
import { CategoriaService } from './categoria.service';

export interface UserLocation {
  lat?: number;
  lng?: number;
  address: string;
  cep?: string;
  bairro?: string;
  isGps: boolean;
  isExplicit?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PublicCatalogService {
  private supermarketService = inject(SupermarketService);
  private encarteService = inject(EncarteService);
  private ofertaService = inject(OfertaService);
  private categoriaService = inject(CategoriaService);

  // Estados Reativos de Localização
  public currentLocation = signal<UserLocation | null>(null);
  public userSelectedRadius = signal<number>(10); // Raio padrão em KM

  /**
   * Inicializa a localização do usuário.
   * Tenta GPS primeiro. Se falhar, usa localização salva ou tenta enriquecer com coords via CEP.
   */
  async initializeLocation(): Promise<void> {
    // Se a localização em memória já estiver definida, permanece durante a navegação
    if (this.currentLocation()) {
      return;
    }

    const saved = localStorage.getItem('user_location');
    let savedLoc: UserLocation | null = null;
    
    if (saved) {
      savedLoc = JSON.parse(saved);
      // Se a localização salva foi explicitamente definida pelo usuário, mantemos e retornamos
      if (savedLoc && savedLoc.isExplicit) {
        if (!savedLoc.lat && savedLoc.cep) {
          const enriched = await this.enrichLocationWithCoords(savedLoc);
          this.currentLocation.set(enriched);
        } else {
          this.currentLocation.set(savedLoc);
        }
        return;
      }
    }

    // Se não há localização salva ou ela foi automática (GPS/fallback), tenta obter a localização atualizada via GPS
    try {
      const coords = await this.requestUserLocation();
      const address = await this.getAddressFromCoordinates(coords.lat, coords.lng);
      const loc: UserLocation = { ...coords, address, isGps: true, isExplicit: false };
      this.setLocation(loc);
    } catch (e) {
      // Se o GPS falhar e houver uma localização anteriormente salva, usamos ela como fallback secundário
      if (savedLoc) {
        if (!savedLoc.lat && savedLoc.cep) {
          const enriched = await this.enrichLocationWithCoords(savedLoc);
          this.currentLocation.set(enriched);
        } else {
          this.currentLocation.set(savedLoc);
        }
      } else {
        // Fallback final genérico: Brasília
        const loc: UserLocation = { lat: -15.7801, lng: -47.9292, address: 'Brasília, DF', isGps: false, isExplicit: false };
        this.setLocation(loc);
      }
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

      let nomData: any = null;

      // 1ª Tentativa: Logradouro + Cidade + Estado
      if (viaCepData.logradouro) {
        const query1 = `${viaCepData.logradouro} ${viaCepData.localidade} ${viaCepData.uf} Brasil`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query1)}&limit=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) nomData = data;
          }
        } catch (e) {
          console.warn('Nominatim tentativa 1 falhou:', e);
        }
      }

      // 2ª Tentativa (fallback): Bairro + Cidade + Estado
      if (!nomData && viaCepData.bairro) {
        const query2 = `${viaCepData.bairro} ${viaCepData.localidade} ${viaCepData.uf} Brasil`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query2)}&limit=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) nomData = data;
          }
        } catch (e) {
          console.warn('Nominatim tentativa 2 falhou:', e);
        }
      }

      // 3ª Tentativa (fallback): Cidade + Estado
      if (!nomData) {
        const query3 = `${viaCepData.localidade} ${viaCepData.uf} Brasil`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query3)}&limit=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) nomData = data;
          }
        } catch (e) {
          console.warn('Nominatim tentativa 3 falhou:', e);
        }
      }

      if (!nomData || !nomData.length) return loc;

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
    this.setLocation({ address, cep, isGps: false, isExplicit: true });
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
          // Se falhar na resolução de coordenadas, filtra por CEP/Bairro no backend
          return this.supermarketService.buscarPorLocalizacao(loc.cep, loc.bairro).pipe(
            map((res: any) => this.mapStores(res.content || res)),
            catchError(() => this.getAllActiveStores())
          );
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
    return forkJoin({
      stores: this.getNearbySupermarkets(),
      categorias: this.categoriaService.listar().pipe(catchError(() => of([])))
    }).pipe(
      switchMap(({ stores, categorias }) => {
        if (stores.length === 0) return of([]);
        const categoriasMap = new Map(categorias.map(c => [c.id, c.nome]));

        const requests = stores.map(s =>
          this.ofertaService.buscarPorSupermercado(s.id).pipe(
            map(ofertas => ofertas.filter((o: any) => o.ativo).map((o: any) => ({
              ...o,
              supermarketName: s.name,
              categoryName: o.produtoBase?.categoriaId ? (categoriasMap.get(o.produtoBase.categoriaId) || 'Mercearia') : 'Mercearia'
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
            category: o.categoryName
          })))
        );
      })
    );
  }

  getSupermarketById(id: string): Observable<any> {
    return this.supermarketService.buscarPorId(id).pipe(
      map(s => {
        const loc = this.currentLocation();
        let distanceKm: string | null = null;
        if (loc && loc.lat && loc.lng && s.latitude && s.longitude) {
          const dist = this.calculateDistance(loc.lat, loc.lng, s.latitude, s.longitude);
          distanceKm = dist.toFixed(1);
        }
        const cleanPrimary = (s.corPrimariaHex || '#16a34a').replace('#', '');
        return {
          id: s.id,
          name: s.nomeFantasia,
          logoUrl: s.urlLogomarca || `https://ui-avatars.com/api/?name=${s.nomeFantasia}&background=${cleanPrimary}&color=fff&size=128`,
          primaryColor: s.corPrimariaHex || '#16a34a',
          secondaryColor: s.corSecundariaHex || '#0284c7',
          distanceKm: distanceKm,
          cidade: s.cidade || 'Brasília',
          estado: s.estado || 'DF'
        };
      })
    );
  }

  getFlyersBySupermarket(supermercadoId: string): Observable<any[]> {
    return this.encarteService.listarEncartes(supermercadoId).pipe(
      map(encartes => encartes.filter(e => e.status === 'ATIVO').map(e => ({
        id: e.id,
        supermarketId: e.supermercadoId,
        title: e.titulo,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        expiresInDays: 3
      })))
    );
  }

  getOffersBySupermarket(supermercadoId: string): Observable<any[]> {
    return forkJoin({
      categorias: this.categoriaService.listar().pipe(catchError(() => of([]))),
      ofertas: this.ofertaService.buscarPorSupermercado(supermercadoId).pipe(catchError(() => of([])))
    }).pipe(
      map(({ categorias, ofertas }) => {
        const categoriasMap = new Map(categorias.map(c => [c.id, c.nome]));
        return ofertas.filter(o => o.ativo).map(o => ({
          id: o.id,
          productName: o.nomeProduto,
          imageUrl: o.urlImagem || 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=400&q=80',
          originalPrice: o.preco * 1.2,
          promotionalPrice: o.preco,
          supermarketId: o.supermercadoId,
          category: o.produtoBase?.categoriaId ? (categoriasMap.get(o.produtoBase.categoriaId) || 'Mercearia') : 'Mercearia'
        }));
      })
    );
  }

  getFilteredOffersNearby(filters?: { search?: string, category?: string, supermarketId?: string }): Observable<any[]> {
    return this.getTrendingOffersNearby().pipe(
      map(offers => {
        let filtered = [...offers];
        if (filters) {
          if (filters.search) {
            const term = filters.search.toLowerCase();
            filtered = filtered.filter(o => o.productName.toLowerCase().includes(term));
          }
          if (filters.category) {
            const cat = filters.category.toLowerCase();
            filtered = filtered.filter(o => o.category && o.category.toLowerCase() === cat);
          }
          if (filters.supermarketId) {
            filtered = filtered.filter(o => o.supermarketId === filters.supermarketId);
          }
        }
        return filtered;
      })
    );
  }

  private mapStores(stores: any[]): any[] {
    const loc = this.currentLocation();
    return (stores || []).map(s => {
      let distanceKm: string | null = null;
      
      if (loc && loc.lat && loc.lng && s.latitude && s.longitude) {
        const dist = this.calculateDistance(loc.lat, loc.lng, s.latitude, s.longitude);
        distanceKm = dist.toFixed(1);
      } else if (s.distance_meters) {
        distanceKm = (s.distance_meters / 1000).toFixed(1);
      }

      const cleanPrimary = (s.corPrimariaHex || '#16a34a').replace('#', '');
      return {
        id: s.id,
        name: s.nomeFantasia,
        logoUrl: s.urlLogomarca || `https://ui-avatars.com/api/?name=${s.nomeFantasia}&background=${cleanPrimary}&color=fff&size=128`,
        primaryColor: s.corPrimariaHex || '#16a34a',
        distanceKm: distanceKm,
        cidade: s.cidade || 'Brasília',
        estado: s.estado || 'DF'
      };
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
