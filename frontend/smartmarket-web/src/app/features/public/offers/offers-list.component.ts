import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogService } from '@core/services/public-catalog.service';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './offers-list.component.html'
})
export class OffersListComponent implements OnInit {
  private catalogService = inject(PublicCatalogService);

  isLoading = signal<boolean>(true);
  offers = signal<any[]>([]);
  supermarkets = signal<any[]>([]);

  // Filtros
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  selectedSupermarket = signal<string>('');

  categories = ['Açougue', 'Bebidas', 'Bebês', 'Hortifruti', 'Laticínios', 'Limpeza', 'Mercearia'];

  ngOnInit(): void {
    // Carregar supermercados para o filtro
    this.catalogService.getNearbySupermarkets().subscribe({
      next: (data) => {
        this.supermarkets.set(data);
      },
      error: () => {
        this.supermarkets.set([]);
      }
    });
    this.loadOffers();
  }

  loadOffers() {
    this.isLoading.set(true);
    const filters = {
      search: this.searchTerm(),
      category: this.selectedCategory(),
      supermarketId: this.selectedSupermarket()
    };
    
    this.catalogService.getFilteredOffersNearby(filters).subscribe({
      next: (data) => {
        this.offers.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.offers.set([]);
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange() {
    this.loadOffers();
  }

  setCategory(cat: string) {
    if (this.selectedCategory() === cat) {
      this.selectedCategory.set('');
    } else {
      this.selectedCategory.set(cat);
    }
    this.loadOffers();
  }

  setSupermarket(id: string) {
    this.selectedSupermarket.set(id);
    this.loadOffers();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedSupermarket.set('');
    this.loadOffers();
  }
}
