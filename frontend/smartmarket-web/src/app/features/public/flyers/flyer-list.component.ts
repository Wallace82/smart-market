import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogMockService, MockFlyer } from '../public-catalog-mock.service';

@Component({
  selector: 'app-flyer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './flyer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlyerListComponent implements OnInit {
  private catalogService = inject(PublicCatalogMockService);

  isLoading = signal<boolean>(true);
  flyers = signal<MockFlyer[]>([]);

  ngOnInit(): void {
    this.catalogService.getAllFlyers().subscribe(data => {
      this.flyers.set(data);
      this.isLoading.set(false);
    });
  }
}