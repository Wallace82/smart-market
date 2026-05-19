import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupermarketResponse } from '@core/models/supermarket.model';
import { SupermarketService } from '@core/services/supermarket.service';
import { AuthService } from '@core/auth/auth.service';
import { WhitelabelThemeDirective } from '../../../../shared/directives/whitelabel-theme.directive';

@Component({
  selector: 'app-identity-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    WhitelabelThemeDirective
  ],
  templateUrl: './identity-settings.component.html',
  styleUrl: './identity-settings.component.scss'
})
export class IdentitySettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supermarketService = inject(SupermarketService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  supermarket = signal<SupermarketResponse | null>(null);
  logoPreview = signal<string | null>(null);
  selectedFile: File | null = null;
  loading = signal(false);

  constructor() {
    this.form = this.fb.group({
      corPrimariaHex: ['#000000', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      corSecundariaHex: ['#ffffff', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
    });

    // Efeito para reagir a mudanças no sinal de supermercado
    effect(() => {
      const market = this.supermarket();
      if (market) {
        this.form.patchValue({
          corPrimariaHex: market.corPrimariaHex || '#16a34a',
          corSecundariaHex: market.corSecundariaHex || '#0284c7'
        }, { emitEvent: false });
        if (market.urlLogomarca) {
          this.logoPreview.set(market.urlLogomarca);
        }
      }
    });

    // NOVO: Efeito para carregar os dados iniciais assim que o usuário estiver disponível
    effect(() => {
      const user = this.authService.user();
      if (user?.id) {
        this.carregarDados(user.id);
      }
    });

    // Sincronizar mudanças do form com o preview via sinal
    this.form.valueChanges.subscribe(val => {
      const current = this.supermarket();
      if (current) {
        this.supermarket.set({
          ...current,
          corPrimariaHex: val.corPrimariaHex,
          corSecundariaHex: val.corSecundariaHex
        });
      }
    });
  }

  ngOnInit(): void {
    // O carregamento inicial agora é tratado pelo effect reativo
  }

  carregarDados(userId: string): void {
    this.supermarketService.buscarPorGestor(userId).subscribe({
      next: (markets: SupermarketResponse[]) => {
        if (markets && markets.length > 0) {
          this.supermarket.set(markets[0]);
        } else {
          this.exibirMensagem('Nenhum supermercado encontrado para seu perfil.');
        }
      },
      error: () => this.exibirMensagem('Erro ao conectar com o serviço de supermercados.')
    });
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
      next: (updatedMarket: SupermarketResponse) => {
        this.supermarket.set(updatedMarket);
        if (this.selectedFile) {
          this.supermarketService.uploadLogomarca(market.id, this.selectedFile).subscribe({
            next: (marketWithLogo: SupermarketResponse) => {
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
