import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogMockService, MockSupermarket, MockFlyer, MockOffer } from '../public-catalog-mock.service';

@Component({
  selector: 'app-supermarket-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './supermarket-details.component.html'
})
export class SupermarketDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private catalogService = inject(PublicCatalogMockService);

  isLoading = signal<boolean>(true);
  supermarket = signal<MockSupermarket | undefined>(undefined);
  flyers = signal<MockFlyer[]>([]);
  offers = signal<MockOffer[]>([]);

  bgStyle = computed(() => {
    const primary = this.supermarket()?.primaryColor || '#16a34a';
    return { 'background-color': primary };
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(id);
    } else {
      this.isLoading.set(false);
    }
  }

  private loadData(id: string) {
    this.isLoading.set(true);
    let loadedCount = 0;
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === 3) this.isLoading.set(false);
    };

    this.catalogService.getSupermarketById(id).subscribe(data => {
      this.supermarket.set(data);
      checkComplete();
    });

    this.catalogService.getFlyersBySupermarket(id).subscribe(data => {
      this.flyers.set(data);
      checkComplete();
    });

    this.catalogService.getOffersBySupermarket(id).subscribe(data => {
      this.offers.set(data);
      checkComplete();
    });
  }
}
