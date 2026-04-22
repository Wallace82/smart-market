import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogMockService, MockOffer, MockSupermarket } from '../public-catalog-mock.service';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './offers-list.component.html'
})
export class OffersListComponent implements OnInit {
  private catalogService = inject(PublicCatalogMockService);

  isLoading = signal<boolean>(true);
  offers = signal<MockOffer[]>([]);
  supermarkets = signal<MockSupermarket[]>([]);

  // Filtros
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  selectedSupermarket = signal<string>('');

  categories = ['Açougue', 'Bebidas', 'Bebês', 'Hortifruti', 'Laticínios', 'Limpeza', 'Mercearia'];

  ngOnInit(): void {
    // Carregar supermercados para o filtro
    this.catalogService.getNearbySupermarkets(0, 0).subscribe(data => {
      this.supermarkets.set(data);
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
    
    this.catalogService.getAllOffers(filters).subscribe(data => {
      this.offers.set(data);
      this.isLoading.set(false);
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
