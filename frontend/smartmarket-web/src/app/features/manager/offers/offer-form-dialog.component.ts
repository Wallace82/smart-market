import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductBaseService } from '@core/services/product-base.service';
import { ProductBaseResponse } from '@core/models/product.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
 
@Component({
  selector: 'app-offer-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './offer-form-dialog.component.html',
  styles: [`
    /* Scrollbar minimalista para a modal */
    mat-dialog-content::-webkit-scrollbar {
      width: 6px;
    }
    mat-dialog-content::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.3);
    }
    mat-dialog-content::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.2);
      border-radius: 99px;
    }
    mat-dialog-content::-webkit-scrollbar-thumb:hover {
      background: rgba(148, 163, 184, 0.4);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<OfferFormDialogComponent>);
  private productBaseService = inject(ProductBaseService);
  private dialogData = inject(MAT_DIALOG_DATA, { optional: true });
 
  public offerForm: FormGroup;
  public selectedProduct = signal<ProductBaseResponse | null>(null);
  public isSearchingProducts = signal(false);
  public searchedProducts = signal<ProductBaseResponse[]>([]);
  public hasSearched = signal(false);
  public isSubmitting = signal(false);
  public isEditMode = signal(false);
  private originalOfferActive = true;
 
  private searchSubject = new Subject<string>();
 
  constructor() {
    let precoAtual = '';
    let precoPromocional = '';
    let dataInicioPromocao = new Date().toISOString().split('T')[0];
    let dataFimPromocao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
 
    const offer = this.dialogData?.offer;
    if (offer) {
      this.isEditMode.set(true);
      this.originalOfferActive = offer.ativo !== undefined ? offer.ativo : true;
      precoAtual = offer.precoAtual?.toString() || offer.preco?.toString() || '';
      precoPromocional = offer.precoPromocional?.toString() || offer.preco?.toString() || '';
      
      if (offer.dataInicioPromocao) {
        dataInicioPromocao = offer.dataInicioPromocao.split('T')[0];
      }
      if (offer.dataFimPromocao) {
        dataFimPromocao = offer.dataFimPromocao.split('T')[0];
      }
      
      // Carregar produto base no formulário
      if (offer.produtoBase) {
        this.selectedProduct.set(offer.produtoBase);
      }
    }
 
    this.offerForm = this.fb.group({
      precoAtual: [precoAtual, [Validators.required, Validators.min(0.01)]],
      precoPromocional: [precoPromocional, [Validators.required, Validators.min(0.01)]],
      dataInicioPromocao: [dataInicioPromocao, [Validators.required]],
      dataFimPromocao: [dataFimPromocao, [Validators.required]]
    });
  }
 
  ngOnInit() {
    // Configura busca reativa com debounce
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(term => {
      this.performSearch(term);
    });
  }
 
  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    if (!term || term.trim().length < 2) {
      this.searchedProducts.set([]);
      this.isSearchingProducts.set(false);
      this.hasSearched.set(false);
      return;
    }
    this.isSearchingProducts.set(true);
    this.searchSubject.next(term.trim());
  }
 
  private performSearch(term: string) {
    this.productBaseService.listarTodos(0, 50, term).subscribe({
      next: (res) => {
        // Se a resposta contiver content (paginado)
        const products = res.content || res || [];
        this.searchedProducts.set(products);
        this.isSearchingProducts.set(false);
        this.hasSearched.set(true);
      },
      error: () => {
        this.searchedProducts.set([]);
        this.isSearchingProducts.set(false);
        this.hasSearched.set(true);
      }
    });
  }
 
  selectProduct(product: ProductBaseResponse) {
    if (this.isEditMode()) return; // Não permitir alterar produto ao editar
    this.selectedProduct.set(product);
    this.searchedProducts.set([]);
    this.hasSearched.set(false);
  }
 
  deselectProduct() {
    if (this.isEditMode()) return; // Não permitir desmarcar produto ao editar
    this.selectedProduct.set(null);
  }
 
  onCancel() {
    this.dialogRef.close();
  }
 
  onSave() {
    if (this.offerForm.valid && this.selectedProduct()) {
      const formVal = this.offerForm.value;
      const result = {
        produtoBaseId: this.selectedProduct()!.id,
        precoAtual: formVal.precoAtual,
        precoPromocional: formVal.precoPromocional,
        dataInicioPromocao: `${formVal.dataInicioPromocao}T00:00:00`,
        dataFimPromocao: `${formVal.dataFimPromocao}T23:59:59`,
        ativo: this.originalOfferActive
      };
      this.dialogRef.close(result);
    }
  }
}
