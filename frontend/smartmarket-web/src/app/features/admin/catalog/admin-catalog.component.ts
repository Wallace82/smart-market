import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCatalogService, CatalogProduct } from './services/admin-catalog.service';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-catalog.component.html'
})
export class AdminCatalogComponent implements OnInit {
  private catalogService = inject(AdminCatalogService);
  
  products: CatalogProduct[] = [];
  loading = true;

  ngOnInit() {
    this.catalogService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      }
    });
  }
}
