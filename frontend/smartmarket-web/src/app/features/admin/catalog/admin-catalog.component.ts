import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

// Services & Models
import { ProductBaseService } from '@core/services/product-base.service';
import { NotificationService } from '@core/services/notification.service';
import { ProductBaseResponse } from '@core/models/product.model';
import { ProductFormDialogComponent } from './product-form-dialog.component';

@Component({
  selector: 'app-admin-catalog',
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, MatDialogModule, MatIconModule],
  templateUrl: './admin-catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCatalogComponent implements OnInit {
  private catalogService = inject(ProductBaseService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  
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

  public openProductDialog(product?: ProductBaseResponse) {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '600px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salvarProduto(result.produto, result.imagem);
      }
    });
  }

  private salvarProduto(product: any, imagem?: File) {
    this.loading.set(true);
    this.catalogService.salvar(product, imagem).subscribe({
      next: () => {
        this.notificationService.success(product.id ? 'Produto atualizado!' : 'Produto cadastrado!');
        this.loadProducts();
      },
      error: (err) => {
        console.error('Erro ao salvar produto', err);
        this.notificationService.error('Erro ao salvar produto no catálogo.');
        this.loading.set(false);
      }
    });
  }
}
