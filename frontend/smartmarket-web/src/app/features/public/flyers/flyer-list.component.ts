import { ChangeDetectionStrategy, Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogService } from '@core/services/public-catalog.service';
 
@Component({
  selector: 'app-flyer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './flyer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlyerListComponent implements OnInit {
  private catalogService = inject(PublicCatalogService);
 
  isLoading = signal<boolean>(true);
  flyers = signal<any[]>([]);
  location = this.catalogService.currentLocation;
 
  constructor() {
    effect(() => {
      if (this.location()) {
        this.loadFlyers();
      }
    });
  }
 
  ngOnInit(): void {
    if (!this.location()) {
      this.catalogService.initializeLocation();
    }
  }
 
  private loadFlyers() {
    this.isLoading.set(true);
    this.catalogService.getActiveFlyersNearby().subscribe({
      next: (data) => {
        this.flyers.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}