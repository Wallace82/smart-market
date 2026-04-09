import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupermarketResponse } from '../../../../core/models/supermarket.model';
import { SupermarketService } from '../../../../core/services/supermarket.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-identity-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './identity-settings.component.html',
  styleUrl: './identity-settings.component.scss'
})
export class IdentitySettingsComponent implements OnInit {
  form: FormGroup;
  supermarket = signal<SupermarketResponse | null>(null);
  logoPreview = signal<string | null>(null);
  selectedFile: File | null = null;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private supermarketService: SupermarketService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      corPrimariaHex: ['#000000', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      corSecundariaHex: ['#ffffff', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
    });

    // Efeito para reagir a mudanças no sinal de supermercado
    effect(() => {
      const market = this.supermarket();
      if (market) {
        this.form.patchValue({
          corPrimariaHex: market.corPrimariaHex || '#000000',
          corSecundariaHex: market.corSecundariaHex || '#ffffff'
        }, { emitEvent: false });
        if (market.urlLogomarca) {
          this.logoPreview.set(market.urlLogomarca);
        }
      }
    });
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    const user = this.authService.user();
    if (user && user.id) {
      this.supermarketService.buscarPorGestor(user.id).subscribe({
        next: (markets) => {
          if (markets && markets.length > 0) {
            this.supermarket.set(markets[0]);
          } else {
            this.exibirMensagem('Nenhum supermercado encontrado para este gestor.');
          }
        },
        error: () => this.exibirMensagem('Erro ao carregar dados do supermercado')
      });
    } else {
      this.exibirMensagem('Usuário não autenticado.');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.logoPreview.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  salvar(): void {
    const market = this.supermarket();
    if (!market || this.form.invalid) return;

    this.loading.set(true);
    const updateData = {
      ...market,
      corPrimariaHex: this.form.value.corPrimariaHex,
      corSecundariaHex: this.form.value.corSecundariaHex
    };

    this.supermarketService.atualizar(market.id, updateData).subscribe({
      next: (updatedMarket) => {
        this.supermarket.set(updatedMarket);
        if (this.selectedFile) {
          this.supermarketService.uploadLogomarca(market.id, this.selectedFile).subscribe({
            next: (marketWithLogo) => {
              this.supermarket.set(marketWithLogo);
              this.loading.set(false);
              this.exibirMensagem('Configurações e Logomarca salvas!');
            },
            error: () => {
              this.loading.set(false);
              this.exibirMensagem('Cores salvas, mas erro no upload do logo');
            }
          });
        } else {
          this.loading.set(false);
          this.exibirMensagem('Cores salvas com sucesso!');
        }
      },
      error: () => {
        this.loading.set(false);
        this.exibirMensagem('Erro ao salvar configurações');
      }
    });
  }

  private exibirMensagem(msg: string): void {
    this.snackBar.open(msg, 'Fechar', { duration: 3000 });
  }
}
