import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogService } from '@core/services/public-catalog.service';

@Component({
  selector: 'app-supermarket-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './supermarket-details.component.html'
})
export class SupermarketDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private catalogService = inject(PublicCatalogService);

  isLoading = signal<boolean>(true);
  supermarket = signal<any | undefined>(undefined);
  flyers = signal<any[]>([]);
  offers = signal<any[]>([]);

  brandPrimary = computed(() => this.supermarket()?.primaryColor || '#16a34a');
  brandSecondary = computed(() => this.supermarket()?.secondaryColor || '#0284c7');

  bgStyle = computed(() => {
    const primary = this.brandPrimary();
    return { 'background-color': primary };
  });

  hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
      : `rgba(0, 0, 0, ${alpha})`;
  }

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

    this.catalogService.getSupermarketById(id).subscribe({
      next: (data) => {
        this.supermarket.set(data);
        checkComplete();
      },
      error: () => {
        this.supermarket.set(undefined);
        checkComplete();
      }
    });

    this.catalogService.getFlyersBySupermarket(id).subscribe({
      next: (data) => {
        this.flyers.set(data);
        checkComplete();
      },
      error: () => {
        this.flyers.set([]);
        checkComplete();
      }
    });

    this.catalogService.getOffersBySupermarket(id).subscribe({
      next: (data) => {
        this.offers.set(data);
        checkComplete();
      },
      error: () => {
        this.offers.set([]);
        checkComplete();
      }
    });
  }
}
