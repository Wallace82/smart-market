import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogMockService, MockOffer, MockSupermarket, MockFlyer } from '../../public/public-catalog-mock.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-home',
  standalone: true,
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
  private catalogService = inject(PublicCatalogMockService);

  // Sinais de Estado
  isLoading = signal<boolean>(true);
  locationGranted = signal<boolean>(false);
  userAddress = signal<string>('Buscando seu endereço...');
  
  // Sinais de Dados
  offers = signal<MockOffer[]>([]);
  supermarkets = signal<MockSupermarket[]>([]);
  flyers = signal<MockFlyer[]>([]);

  ngOnInit(): void {
    this.loadCatalog();
  }

  private async loadCatalog() {
    this.isLoading.set(true);
    try {
      const loc = await this.catalogService.requestUserLocation();
      this.locationGranted.set(true);
      
      // Busca o endereço real por extenso (Reverse Geocoding)
      const address = await this.catalogService.getAddressFromCoordinates(loc.lat, loc.lng);
      this.userAddress.set(address);

      this.catalogService.getTrendingOffersNearby().subscribe(data => this.offers.set(data));
      this.catalogService.getActiveFlyersNearby().subscribe(data => this.flyers.set(data));
      this.catalogService.getNearbySupermarkets(loc.lat, loc.lng).subscribe(data => {
        this.supermarkets.set(data);
        this.isLoading.set(false);
      });
    } catch (e) {
      this.isLoading.set(false);
    }
  }
}