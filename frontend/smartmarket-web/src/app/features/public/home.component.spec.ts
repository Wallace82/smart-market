import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeComponent } from './home.component';
import { PublicCatalogService } from '@core/services/public-catalog.service';
import { AuthService } from '@core/auth/auth.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let catalogServiceSpy: jasmine.SpyObj<PublicCatalogService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  // WritableSignals de mock
  let mockLocation: WritableSignal<any>;
  let mockRadius: WritableSignal<number>;
  let mockUser: WritableSignal<any>;

  beforeEach(waitForAsync(() => {
    mockLocation = signal(null);
    mockRadius = signal(10);
    mockUser = signal(null);

    const catalogSpy = jasmine.createSpyObj('PublicCatalogService', [
      'initializeLocation',
      'getTrendingOffersNearby',
      'getActiveFlyersNearby',
      'getNearbySupermarkets'
    ]);

    // Mockar as propriedades de Signals obrigatórias
    Object.defineProperty(catalogSpy, 'currentLocation', { get: () => mockLocation });
    Object.defineProperty(catalogSpy, 'userSelectedRadius', { get: () => mockRadius });

    catalogSpy.initializeLocation.and.returnValue(Promise.resolve());
    catalogSpy.getTrendingOffersNearby.and.returnValue(of([]));
    catalogSpy.getActiveFlyersNearby.and.returnValue(of([]));
    catalogSpy.getNearbySupermarkets.and.returnValue(of([]));

    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    Object.defineProperty(authSpy, 'user', { get: () => mockUser });
    authSpy.isAuthenticated.and.returnValue(false);

    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        HomeComponent // Como é standalone, importamos diretamente no imports
      ],
      providers: [
        { provide: PublicCatalogService, useValue: catalogSpy },
        { provide: AuthService, useValue: authSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map() }
          }
        }
      ]
    }).compileComponents();

    catalogServiceSpy = TestBed.inject(PublicCatalogService) as jasmine.SpyObj<PublicCatalogService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading()).toBeTrue();
  });

  it('deve inicializar a localização no ngOnInit se ela não estiver definida', () => {
    mockLocation.set(null);
    fixture.detectChanges(); // Roda ngOnInit

    expect(catalogServiceSpy.initializeLocation).toHaveBeenCalled();
  });

  it('não deve inicializar a localização no ngOnInit se ela já estiver definida', () => {
    mockLocation.set({ address: 'São Paulo', lat: -23, lng: -46, isGps: true });
    fixture.detectChanges(); // Roda ngOnInit

    expect(catalogServiceSpy.initializeLocation).not.toHaveBeenCalled();
  });

  it('deve carregar dados de ofertas, folhetos e supermercados com sucesso quando a localização estiver ativa', () => {
    const mockOffers = [{ id: '1', productName: 'Leite', promotionalPrice: 4.5 }];
    const mockFlyers = [{ id: '1', title: 'Encarte de Verão' }];
    const mockSupermarkets = [{ id: '1', name: 'Supermercado A' }];

    catalogServiceSpy.getTrendingOffersNearby.and.returnValue(of(mockOffers));
    catalogServiceSpy.getActiveFlyersNearby.and.returnValue(of(mockFlyers));
    catalogServiceSpy.getNearbySupermarkets.and.returnValue(of(mockSupermarkets));

    // Definir a localização ativa para acionar o effect reativo
    mockLocation.set({ address: 'Brasília, DF', lat: -15, lng: -47, isGps: true });
    fixture.detectChanges(); // Roda change detection e propaga os effects

    expect(catalogServiceSpy.getTrendingOffersNearby).toHaveBeenCalled();
    expect(catalogServiceSpy.getActiveFlyersNearby).toHaveBeenCalled();
    expect(catalogServiceSpy.getNearbySupermarkets).toHaveBeenCalled();

    expect(component.offers()).toEqual(mockOffers);
    expect(component.flyers()).toEqual(mockFlyers);
    expect(component.supermarkets()).toEqual(mockSupermarkets);
    expect(component.isLoading()).toBeFalse();
  });

  it('deve lidar com falhas de APIs graciosamente definindo listas vazias e desativando loading', () => {
    catalogServiceSpy.getTrendingOffersNearby.and.returnValue(throwError(() => new Error('Erro')));
    catalogServiceSpy.getActiveFlyersNearby.and.returnValue(throwError(() => new Error('Erro')));
    catalogServiceSpy.getNearbySupermarkets.and.returnValue(throwError(() => new Error('Erro')));

    mockLocation.set({ address: 'Brasília, DF', lat: -15, lng: -47, isGps: true });
    fixture.detectChanges();

    expect(component.offers()).toEqual([]);
    expect(component.flyers()).toEqual([]);
    expect(component.supermarkets()).toEqual([]);
    expect(component.isLoading()).toBeFalse();
  });
});
