import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Services & Models
import { ProductBaseService } from '@core/services/product-base.service';
import { ProductBaseResponse } from '@core/models/product.model';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-catalog',
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './admin-catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCatalogComponent implements OnInit {
  private catalogService = inject(ProductBaseService);
  
  // Estados Reativos
  public products = signal<ProductBaseResponse[]>([]);
  public loading = signal(true);
  public searchTerm = signal('');
  public page = signal(0);
  public totalElements = signal(0);

  ngOnInit() {
    this.loadProducts();
  }

  public loadProducts() {
    this.loading.set(true);
    this.catalogService.listarTodos(this.page(), 20, this.searchTerm()).subscribe({
      next: (data) => {
        this.products.set(data.content || data);
        this.totalElements.set(data.totalElements || data.length);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar catálogo', err);
        this.loading.set(false);
      }
    });
  }

  public onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.page.set(0); // Volta para primeira página
    this.loadProducts();
  }

  public changePage(newPage: number) {
    this.page.set(newPage);
    this.loadProducts();
  }
}
