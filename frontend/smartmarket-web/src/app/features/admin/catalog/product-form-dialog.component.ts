import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="pfd-container">

      <!-- Header -->
      <div class="pfd-header">
        <div class="pfd-title-group">
          <div class="pfd-icon-wrap">
            <mat-icon>{{ isEdit ? 'edit_note' : 'add_circle' }}</mat-icon>
          </div>
          <div>
            <h2 class="pfd-title">{{ isEdit ? 'Editar Produto' : 'Novo Produto' }}</h2>
            <p class="pfd-subtitle">{{ isEdit ? 'Atualize as informações do catálogo global' : 'Cadastre um novo item no catálogo global' }}</p>
          </div>
        </div>
        <button mat-icon-button (click)="onCancel()" class="pfd-close-btn" aria-label="Fechar">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Body (scrollable) -->
      <div class="pfd-body">

        <!-- Loading state -->
        <div class="pfd-loading" *ngIf="isLoading()">
          <mat-spinner diameter="36"></mat-spinner>
          <span>Carregando dados...</span>
        </div>

        <form [formGroup]="productForm" class="pfd-form" *ngIf="!isLoading()">

          <!-- Layout 2 colunas: esquerda = imagem + status, direita = campos -->
          <div class="pfd-layout-two-col">

            <!-- Coluna Esquerda: Imagem + Status -->
            <div class="pfd-col-left">
              <div class="pfd-image-section">
                <div
                  class="pfd-image-preview"
                  [class.has-image]="previewUrl()"
                  (click)="fileInput.click()"
                  role="button"
                  tabindex="0"
                  (keydown.enter)="fileInput.click()"
                  aria-label="Clique para selecionar imagem do produto">
                  <img *ngIf="previewUrl()" [src]="previewUrl()!" alt="Preview do produto" class="pfd-img">
                  <div *ngIf="!previewUrl()" class="pfd-img-placeholder">
                    <mat-icon>add_a_photo</mat-icon>
                    <span>Foto do Produto</span>
                  </div>
                  <div class="pfd-img-overlay" *ngIf="previewUrl()">
                    <mat-icon>file_upload</mat-icon>
                    <span>Alterar foto</span>
                  </div>
                </div>
                <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="pfd-file-hidden">
                <p class="pfd-img-hint">PNG, JPG ou WEBP<br>Máx. 2MB</p>
              </div>

              <!-- Status Toggle (coluna esquerda) -->
              <div class="pfd-status-card" [class.active]="productForm.get('ativo')?.value">
                <div class="pfd-status-info">
                  <span class="pfd-status-label">Status</span>
                  <span class="pfd-status-sub">
                    {{ productForm.get('ativo')?.value ? 'Ativo no catálogo' : 'Desabilitado' }}
                  </span>
                </div>
                <div class="pfd-toggle-wrap">
                  <span class="pfd-badge" [class.active]="productForm.get('ativo')?.value">
                    {{ productForm.get('ativo')?.value ? 'ATIVO' : 'INATIVO' }}
                  </span>
                  <mat-slide-toggle formControlName="ativo" color="primary"></mat-slide-toggle>
                </div>
              </div>
            </div>

            <!-- Coluna Direita: Campos do Formulário -->
            <div class="pfd-col-right">

              <!-- Nome -->
              <mat-form-field appearance="outline" class="pfd-field-full">
                <mat-label>Nome do Produto *</mat-label>
                <input matInput formControlName="nome" placeholder="Ex: Arroz Integral 1kg" id="product-nome">
                <mat-icon matSuffix>shopping_bag</mat-icon>
                <mat-error *ngIf="productForm.get('nome')?.hasError('required')">Nome é obrigatório</mat-error>
                <mat-error *ngIf="productForm.get('nome')?.hasError('minlength')">Mínimo 2 caracteres</mat-error>
              </mat-form-field>

              <!-- Marca + EAN -->
              <div class="pfd-row">
                <mat-form-field appearance="outline" class="pfd-field-half">
                  <mat-label>Marca</mat-label>
                  <mat-select formControlName="marcaId" id="product-marca">
                    <mat-option value="">-- Sem marca --</mat-option>
                    <mat-option *ngFor="let m of marcas()" [value]="m.id">{{ m.nome }}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="pfd-field-half">
                  <mat-label>EAN / Código de Barras</mat-label>
                  <input matInput formControlName="ean" placeholder="789..." id="product-ean">
                  <mat-icon matSuffix>qr_code_2</mat-icon>
                </mat-form-field>
              </div>

              <!-- Categoria + Unidade + Peso -->
              <div class="pfd-row">
                <mat-form-field appearance="outline" class="pfd-field-grow">
                  <mat-label>Categoria</mat-label>
                  <mat-select formControlName="categoriaId" id="product-categoria">
                    <mat-option value="">-- Sem categoria --</mat-option>
                    <mat-option *ngFor="let cat of categorias()" [value]="cat.id">{{ cat.nome }}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="pfd-field-fixed-100">
                  <mat-label>Unidade</mat-label>
                  <mat-select formControlName="unidadeMedida" id="product-unidade">
                    <mat-option value="UN">UN</mat-option>
                    <mat-option value="KG">KG</mat-option>
                    <mat-option value="G">G</mat-option>
                    <mat-option value="L">L</mat-option>
                    <mat-option value="ML">ML</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="pfd-field-fixed-100">
                  <mat-label>Peso/Vol</mat-label>
                  <input matInput type="number" formControlName="pesoVolume" min="0" id="product-peso">
                </mat-form-field>
              </div>

              <!-- Descrição -->
              <mat-form-field appearance="outline" class="pfd-field-full">
                <mat-label>Descrição (Opcional)</mat-label>
                <textarea
                  matInput
                  formControlName="descricao"
                  rows="4"
                  placeholder="Descreva os principais atributos do produto..."
                  id="product-descricao">
                </textarea>
              </mat-form-field>

            </div>
            <!-- /Coluna Direita -->

          </div>
          <!-- /Layout 2 colunas -->

        </form>
      </div>

      <!-- Footer Actions -->
      <div class="pfd-footer">
        <button mat-button (click)="onCancel()" class="pfd-btn-cancel" id="btn-cancel-product">
          Cancelar
        </button>
        <button
          mat-raised-button
          class="pfd-btn-save"
          [disabled]="productForm.invalid || isLoading()"
          (click)="onSave()"
          id="btn-save-product">
          <mat-icon>{{ isEdit ? 'save' : 'check_circle' }}</mat-icon>
          {{ isEdit ? 'Salvar Alterações' : 'Finalizar Cadastro' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* ================================================
       PRODUCT FORM DIALOG - scoped styles
       ================================================ */

    .pfd-container {
      display: flex;
      flex-direction: column;
      font-family: 'Inter', system-ui, sans-serif;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      width: 100%;
      max-width: 1120px;
      min-width: 360px;
    }

    /* ---- Header ---- */
    .pfd-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 18px;
      border-bottom: 1px solid #f1f5f9;
      flex-shrink: 0;
    }

    .pfd-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pfd-icon-wrap {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(22, 163, 74, 0.09);
      color: #16a34a;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .pfd-icon-wrap mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .pfd-title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
    }

    .pfd-subtitle {
      margin: 2px 0 0;
      font-size: 0.73rem;
      color: #64748b;
    }

    .pfd-close-btn {
      color: #94a3b8;
      transition: all 0.2s;
    }

    .pfd-close-btn:hover {
      background: #f1f5f9;
      color: #334155;
    }

    /* ---- Body ---- */
    .pfd-body {
      padding: 20px 24px;
      overflow-y: auto;
      overflow-x: hidden;
      flex: 1;
      /* use max-height so dialog doesn't exceed viewport */
      max-height: calc(90vh - 150px);
      box-sizing: border-box;
    }

    /* ---- Loading ---- */
    .pfd-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 40px 0;
      color: #64748b;
      font-size: 0.85rem;
    }

    /* ---- Form ---- */
    .pfd-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }

    /* ---- Image Upload ---- */
    .pfd-image-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }

    .pfd-image-preview {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 2.5px dashed #cbd5e1;
      background: #f8fafc;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
      outline: none;
    }

    .pfd-image-preview:hover,
    .pfd-image-preview:focus {
      border-color: #16a34a;
      background: #f0fdf4;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(22, 163, 74, 0.12);
    }

    .pfd-image-preview.has-image {
      border-style: solid;
      border-radius: 14px;
      border-color: #e2e8f0;
    }

    .pfd-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .pfd-img-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: #64748b;
    }

    .pfd-img-placeholder mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .pfd-img-placeholder span {
      font-size: 0.68rem;
      font-weight: 700;
      color: #475569;
    }

    .pfd-img-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
      gap: 4px;
    }

    .pfd-img-overlay mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .pfd-img-overlay span { font-size: 0.62rem; font-weight: 600; }

    .pfd-image-preview:hover .pfd-img-overlay { opacity: 1; }

    .pfd-img-hint {
      font-size: 0.65rem;
      color: #94a3b8;
      margin: 0;
    }

    .pfd-file-hidden { display: none; }

    /* ---- 2-column layout ---- */
    .pfd-layout-two-col {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 28px;
      align-items: start;
      width: 100%;
    }

    .pfd-col-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding-top: 8px;
    }

    .pfd-col-right {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-width: 0;
    }

    /* ---- Image section in left col ---- */
    .pfd-col-left .pfd-image-section {
      width: 100%;
      align-items: center;
    }

    .pfd-col-left .pfd-image-preview {
      width: 160px;
      height: 160px;
    }

    .pfd-col-left .pfd-image-preview.has-image {
      width: 180px;
      height: 180px;
    }

    /* Status card fill left col width */
    .pfd-col-left .pfd-status-card {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      text-align: center;
    }

    .pfd-col-left .pfd-status-info {
      align-items: center;
    }

    .pfd-col-left .pfd-toggle-wrap {
      justify-content: center;
    }

    /* ---- Form field rows ---- */
    .pfd-field-full {
      width: 100%;
    }

    .pfd-row {
      display: flex;
      gap: 12px;
      width: 100%;
      flex-wrap: nowrap;
    }

    .pfd-field-half {
      flex: 1 1 0;
      min-width: 0;
    }

    .pfd-field-grow {
      flex: 1 1 0;
      min-width: 0;
    }

    .pfd-field-fixed-100 {
      flex: 0 0 105px;
      width: 105px;
    }

    .pfd-field-quarter {
      flex: 0 0 90px;
      min-width: 80px;
    }

    /* Make mat-form-field fill parent */
    ::ng-deep .pfd-field-full .mat-mdc-form-field,
    ::ng-deep .pfd-field-half .mat-mdc-form-field,
    ::ng-deep .pfd-field-quarter .mat-mdc-form-field,
    ::ng-deep .pfd-field-grow .mat-mdc-form-field,
    ::ng-deep .pfd-field-fixed-100 .mat-mdc-form-field {
      width: 100%;
    }

    /* Override mat-form-field to use full width */
    .pfd-field-full,
    .pfd-field-half,
    .pfd-field-quarter,
    .pfd-field-grow,
    .pfd-field-fixed-100 {
      display: block;
    }

    /* ---- Material field theming ---- */
    ::ng-deep .pfd-container .mdc-text-field--outlined {
      background: #f8fafc;
      border-radius: 10px;
      transition: background 0.2s;
    }

    ::ng-deep .pfd-container .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .pfd-container .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .pfd-container .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: #cbd5e1;
    }

    ::ng-deep .pfd-container .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__leading,
    ::ng-deep .pfd-container .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__notch,
    ::ng-deep .pfd-container .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__trailing {
      border-color: #94a3b8;
    }

    ::ng-deep .pfd-container .mdc-text-field--focused .mdc-notched-outline__leading,
    ::ng-deep .pfd-container .mdc-text-field--focused .mdc-notched-outline__notch,
    ::ng-deep .pfd-container .mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: #16a34a !important;
      border-width: 2px !important;
    }

    /* mat-select panel */
    ::ng-deep .mat-mdc-select-panel {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
    }

    ::ng-deep .mat-mdc-option {
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      color: #334155;
    }

    ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {
      background: rgba(22, 163, 74, 0.08);
      color: #16a34a;
    }

    /* ---- Status toggle ---- */
    .pfd-status-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 16px;
      transition: all 0.3s ease;
      gap: 12px;
    }

    .pfd-status-card.active {
      background: #f0fdf4;
      border-color: #86efac;
    }

    .pfd-status-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .pfd-status-label {
      font-weight: 700;
      font-size: 0.83rem;
      color: #334155;
    }

    .pfd-status-card.active .pfd-status-label { color: #15803d; }

    .pfd-status-sub {
      font-size: 0.68rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pfd-toggle-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .pfd-badge {
      font-size: 0.6rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 9999px;
      background: #e2e8f0;
      color: #64748b;
      letter-spacing: 0.5px;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .pfd-badge.active {
      background: #16a34a;
      color: white;
      box-shadow: 0 2px 6px rgba(22, 163, 74, 0.25);
    }

    /* ---- Footer ---- */
    .pfd-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      padding: 16px 24px 20px;
      border-top: 1px solid #f1f5f9;
      flex-shrink: 0;
      background: #ffffff;
    }

    .pfd-btn-cancel {
      color: #64748b !important;
      font-weight: 600 !important;
      border-radius: 10px !important;
      padding: 8px 18px !important;
    }

    .pfd-btn-cancel:hover {
      background: #f1f5f9 !important;
      color: #334155 !important;
    }

    .pfd-btn-save {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
      color: white !important;
      font-weight: 700 !important;
      padding: 8px 22px !important;
      border-radius: 10px !important;
      box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25) !important;
      border: none !important;
      transition: all 0.25s ease !important;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pfd-btn-save:hover:not([disabled]) {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(22, 163, 74, 0.35) !important;
    }

    .pfd-btn-save[disabled] {
      background: #cbd5e1 !important;
      color: #94a3b8 !important;
      box-shadow: none !important;
    }

    /* ---- Responsive ---- */
    @media (max-width: 480px) {
      .pfd-header { padding: 16px 16px 14px; }
      .pfd-body { padding: 16px; max-height: calc(100vh - 160px); }
      .pfd-footer { padding: 12px 16px 16px; }
      .pfd-row { flex-direction: column; }
      .pfd-field-half, .pfd-field-quarter { flex: 1 1 100%; min-width: unset; }
      .pfd-btn-save, .pfd-btn-cancel { flex: 1; justify-content: center; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductFormDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as ProductBaseResponse;
  private categoriaService = inject(CategoriaService);
  private marcaService = inject(MarcaService);
  private cdr = inject(ChangeDetectorRef);

  public productForm: FormGroup;
  public isEdit = false;

  // Signals - compatíveis com OnPush
  public categorias = signal<CategoriaResponse[]>([]);
  public marcas = signal<MarcaResponse[]>([]);
  public previewUrl = signal<string | null>(null);
  public isLoading = signal<boolean>(true);
  public selectedFile: File | null = null;

  private readonly FALLBACK_MARCAS: MarcaResponse[] = [
    { id: 'b01', nome: 'Coca-Cola', ativo: true },
    { id: 'b02', nome: 'Nestlé', ativo: true },
    { id: 'b03', nome: 'Ambev', ativo: true },
    { id: 'b04', nome: 'Unilever', ativo: true },
    { id: 'b05', nome: 'P&G', ativo: true },
    { id: 'b06', nome: 'Tio João', ativo: true },
    { id: 'b07', nome: 'Bauducco', ativo: true },
    { id: 'b08', nome: 'Sadia', ativo: true },
    { id: 'b09', nome: 'Perdigão', ativo: true },
    { id: 'b10', nome: 'Seara', ativo: true },
    { id: 'b11', nome: 'Danone', ativo: true },
    { id: 'b12', nome: 'Lacta', ativo: true },
    { id: 'b13', nome: 'Garoto', ativo: true },
    { id: 'b14', nome: 'Piracanjuba', ativo: true },
    { id: 'b15', nome: 'Qualy', ativo: true },
    { id: 'b16', nome: 'Omo', ativo: true },
    { id: 'b17', nome: 'Colgate', ativo: true },
    { id: 'b18', nome: 'Ypê', ativo: true },
    { id: 'b19', nome: '3 Corações', ativo: true },
    { id: 'b20', nome: 'Pilão', ativo: true },
    { id: 'b21', nome: 'Renata', ativo: true },
    { id: 'b22', nome: 'Camil', ativo: true },
    { id: 'b23', nome: 'Rexona', ativo: true },
    { id: 'b24', nome: 'Dove', ativo: true },
  ];

  private readonly FALLBACK_CATEGORIAS: CategoriaResponse[] = [
    { id: 'c01', nome: 'Geral', ativo: true },
    { id: 'c02', nome: 'Alimentos', ativo: true },
    { id: 'c03', nome: 'Bebidas', ativo: true },
    { id: 'c04', nome: 'Limpeza', ativo: true },
    { id: 'c05', nome: 'Higiene e Beleza', ativo: true },
    { id: 'c06', nome: 'Laticínios', ativo: true },
    { id: 'c07', nome: 'Padaria', ativo: true },
    { id: 'c08', nome: 'Frios e Embutidos', ativo: true },
    { id: 'c09', nome: 'Hortifruti', ativo: true },
    { id: 'c10', nome: 'Carnes', ativo: true },
    { id: 'c11', nome: 'Congelados', ativo: true },
    { id: 'c12', nome: 'Pet Shop', ativo: true },
  ];

  constructor() {
    this.isEdit = !!this.data;
    this.productForm = this.fb.group({
      id:            [this.data?.id || null],
      nome:          [this.data?.nome || '',  [Validators.required, Validators.minLength(2)]],
      descricao:     [this.data?.descricao || ''],
      marcaId:       [this.data?.marcaId || ''],
      ean:           [this.data?.ean || ''],
      unidadeMedida: [this.data?.unidadeMedida || 'UN'],
      pesoVolume:    [this.data?.pesoVolume ?? 1],
      categoriaId:   [this.data?.categoriaId || ''],
      ativo:         [this.data?.ativo !== false],
    });

    if (this.data?.urlImagem) {
      this.previewUrl.set(this.data.urlImagem);
    }
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading.set(true);

    // Carrega marcas e categorias em paralelo com fallback garantido
    forkJoin({
      marcas: this.marcaService.listar().pipe(
        catchError(err => {
          console.warn('[ProductFormDialog] Falha ao carregar marcas, usando fallback.', err);
          return of([] as MarcaResponse[]);
        })
      ),
      categorias: this.categoriaService.listar().pipe(
        catchError(err => {
          console.warn('[ProductFormDialog] Falha ao carregar categorias, usando fallback.', err);
          return of([] as CategoriaResponse[]);
        })
      )
    }).subscribe({
      next: ({ marcas, categorias }) => {
        // Aplica fallback se API retornar lista vazia
        this.marcas.set(marcas?.length > 0 ? marcas : this.FALLBACK_MARCAS);
        this.categorias.set(categorias?.length > 0 ? categorias : this.FALLBACK_CATEGORIAS);
        this.isLoading.set(false);
        // Notifica o OnPush sobre as mudanças assíncronas
        this.cdr.markForCheck();
      },
      error: () => {
        // Nunca deve chegar aqui por causa dos catchError individuais
        this.marcas.set(this.FALLBACK_MARCAS);
        this.categorias.set(this.FALLBACK_CATEGORIAS);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem muito grande. O tamanho máximo é 2MB.');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.dialogRef.close({
        produto: this.productForm.value,
        imagem: this.selectedFile
      });
    } else {
      this.productForm.markAllAsTouched();
      this.cdr.markForCheck();
    }
  }
}
