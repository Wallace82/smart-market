import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProductBaseResponse, CategoriaResponse, MarcaResponse } from '@core/models/product.model';
import { CategoriaService } from '@core/services/categoria.service';
import { MarcaService } from '@core/services/marca.service';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="product-form-container">
      <div class="dialog-header">
        <div class="title-group">
          <mat-icon color="primary">{{ isEdit ? 'edit_note' : 'add_circle' }}</mat-icon>
          <h2 class="dialog-title">{{ isEdit ? 'Editar Produto' : 'Novo Produto Global' }}</h2>
        </div>
        <button mat-icon-button (click)="onCancel()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <form [formGroup]="productForm" class="form-grid mt-4">
          
          <!-- Image Upload Section -->
          <div class="image-upload-section">
            <div class="image-preview" (click)="fileInput.click()">
              <img *ngIf="previewUrl()" [src]="previewUrl()" alt="Preview">
              <div *ngIf="!previewUrl()" class="placeholder">
                <mat-icon>add_a_photo</mat-icon>
                <span>Upload Foto</span>
              </div>
              <div class="hover-overlay">
                <mat-icon>file_upload</mat-icon>
                <span>Alterar Imagem</span>
              </div>
            </div>
            <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
            <p class="text-xs text-gray-500 mt-2 text-center">JPG, PNG ou WEBP (Máx. 2MB)</p>
          </div>

          <div class="form-fields">
            <!-- Nome -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Nome do Produto</mat-label>
              <input matInput formControlName="nome" placeholder="Ex: Arroz Integral 1kg">
              <mat-error *ngIf="productForm.get('nome')?.hasError('required')">Nome é obrigatório</mat-error>
            </mat-form-field>

            <div class="row">
              <!-- Marca Dropdown -->
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Marca</mat-label>
                <mat-select formControlName="marcaId">
                  <mat-option *ngFor="let marca of marcas()" [value]="marca.id">{{ marca.nome }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- EAN -->
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>EAN / Código de Barras</mat-label>
                <input matInput formControlName="ean" placeholder="789...">
              </mat-form-field>
            </div>

            <div class="row">
              <!-- Categoria Dropdown -->
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Categoria</mat-label>
                <mat-select formControlName="categoriaId">
                  <mat-option *ngFor="let cat of categorias()" [value]="cat.id">{{ cat.nome }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Unidade -->
              <mat-form-field appearance="outline" class="w-32">
                <mat-label>Unidade</mat-label>
                <mat-select formControlName="unidadeMedida">
                  <mat-option value="UN">UN</mat-option>
                  <mat-option value="KG">KG</mat-option>
                  <mat-option value="G">G</mat-option>
                  <mat-option value="L">L</mat-option>
                  <mat-option value="ML">ML</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Peso -->
              <mat-form-field appearance="outline" class="w-32">
                <mat-label>Peso/Vol</mat-label>
                <input matInput type="number" formControlName="pesoVolume">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Descrição Completa (Opcional)</mat-label>
              <textarea matInput formControlName="descricao" rows="2"></textarea>
            </mat-form-field>

            <div class="status-toggle">
              <span class="label">Status do Produto</span>
              <mat-slide-toggle formControlName="ativo" color="primary">
                {{ productForm.get('ativo')?.value ? 'ATIVO' : 'INATIVO' }}
              </mat-slide-toggle>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" class="btn-cancel">Cancelar</button>
        <button mat-raised-button color="primary" 
                class="btn-save"
                [disabled]="productForm.invalid" 
                (click)="onSave()">
          <mat-icon>{{ isEdit ? 'save' : 'check_circle' }}</mat-icon>
          {{ isEdit ? 'Salvar Alterações' : 'Finalizar Cadastro' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .product-form-container { padding: 10px; }
    .dialog-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;
    }
    .title-group { display: flex; align-items: center; gap: 10px; }
    .dialog-title { margin: 0; font-weight: 800; font-size: 1.5rem; letter-spacing: -0.5px; }
    
    .form-grid { 
      display: grid; 
      grid-template-columns: 200px 1fr; 
      gap: 24px;
    }

    .image-upload-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .image-preview {
      width: 180px;
      height: 180px;
      border-radius: 12px;
      border: 2px dashed #e2e8f0;
      background: #f8fafc;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .image-preview:hover {
      border-color: var(--color-primary);
      background: #f1f5f9;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-cover: cover;
    }

    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #94a3b8;
      gap: 8px;
    }

    .hover-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.4);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .image-preview:hover .hover-overlay { opacity: 1; }

    .row { display: flex; gap: 16px; width: 100%; }
    .status-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 8px;
    }
    .status-toggle .label { font-weight: 600; color: #475569; font-size: 0.9rem; }

    .btn-save { padding: 0 24px; font-weight: 700; border-radius: 8px; }
    .btn-cancel { color: #64748b; font-weight: 600; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductFormDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as ProductBaseResponse;
  private categoriaService = inject(CategoriaService);
  private marcaService = inject(MarcaService);

  public productForm: FormGroup;
  public isEdit = false;
  
  // Signals para listas e preview
  public categorias = signal<CategoriaResponse[]>([]);
  public marcas = signal<MarcaResponse[]>([]);
  public previewUrl = signal<string | null>(null);
  public selectedFile: File | null = null;

  constructor() {
    this.isEdit = !!this.data;
    this.productForm = this.fb.group({
      id: [this.data?.id || null],
      nome: [this.data?.nome || '', [Validators.required]],
      descricao: [this.data?.descricao || ''],
      marcaId: [this.data?.marcaId || ''],
      ean: [this.data?.ean || ''],
      unidadeMedida: [this.data?.unidadeMedida || 'UN'],
      pesoVolume: [this.data?.pesoVolume || 1],
      categoriaId: [this.data?.categoriaId || ''],
      ativo: [this.data?.ativo !== false]
    });

    if (this.data?.urlImagem) {
      this.previewUrl.set(this.data.urlImagem);
    }
  }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.categoriaService.listar().subscribe(res => this.categorias.set(res));
    this.marcaService.listar().subscribe(res => this.marcas.set(res));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.productForm.valid) {
      // Retorna o formulário e o arquivo selecionado
      this.dialogRef.close({
        produto: this.productForm.value,
        imagem: this.selectedFile
      });
    }
  }
}
