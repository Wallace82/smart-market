import { ChangeDetectionStrategy, Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogService } from '@core/services/public-catalog.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-public-home',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private catalogService = inject(PublicCatalogService);
  public authService = inject(AuthService);

  // Sinais de Estado
  isLoading = signal<boolean>(true);
  location = this.catalogService.currentLocation;
  userRadius = this.catalogService.userSelectedRadius;

  // Sinais de Dados
  offers = signal<any[]>([]);
  supermarkets = signal<any[]>([]);
  flyers = signal<any[]>([]);

  // Efeito: Recarrega o catálogo sempre que a localização ou o raio mudarem
  private _loadEffect = effect(() => {
    const loc = this.location();
    const radius = this.userRadius();
    if (loc) {
      this.loadCatalogData();
    }
  });

  ngOnInit(): void {
    if (!this.location()) {
      this.catalogService.initializeLocation().then(() => {
        // O effect cuidará de chamar loadCatalogData
      });
    }
  }

  private loadCatalogData() {
    this.isLoading.set(true);
    
    // Busca paralela de dados baseada na localização atual
    this.catalogService.getTrendingOffersNearby().subscribe({
      next: (data) => this.offers.set(data),
      error: () => this.offers.set([])
    });

    this.catalogService.getActiveFlyersNearby().subscribe({
      next: (data) => this.flyers.set(data),
      error: () => this.flyers.set([])
    });

    this.catalogService.getNearbySupermarkets().subscribe({
      next: (data) => {
        this.supermarkets.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.supermarkets.set([]);
        this.isLoading.set(false);
      }
    });
  }
}