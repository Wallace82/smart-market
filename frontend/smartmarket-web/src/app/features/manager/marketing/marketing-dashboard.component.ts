import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services
import { AuthService } from '@core/auth/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';

// Models
import { SupermarketResponse } from '@core/models/supermarket.model';

@Component({
  selector: 'app-marketing-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './marketing-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketingDashboardComponent {
  // Services
  private authService = inject(AuthService);
  private supermarketService = inject(SupermarketService);
  private snackBar = inject(MatSnackBar);

  // States
  public isLoading = signal(false);
  public supermarketId = signal<string | null>(null);
  public qrCodeUrl = signal<string | null>(null);

  // Efeito para carregar o QR Code quando o usuário (gestor) estiver disponível
  private _loadEffect = effect(() => {
    const user = this.authService.user();
    if (user && 'id' in user) {
      this.loadSupermarket(user.id);
    }
  });

  private loadSupermarket(userId: string) {
    this.isLoading.set(true);
    this.supermarketService.buscarPorGestor(userId).subscribe({
      next: (supermarkets: SupermarketResponse[]) => {
        if (supermarkets.length > 0) {
          const sm = supermarkets[0];
          this.supermarketId.set(sm.id);
          this.qrCodeUrl.set(this.supermarketService.getQRCodeUrl(sm.id));
        }
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar supermercado para QR Code', err);
        this.isLoading.set(false);
        this.snackBar.open('Erro ao carregar dados da loja.', 'Fechar', { duration: 3000 });
      }
    });
  }

  public downloadQRCode() {
    const url = this.qrCodeUrl();
    if (!url) return;

    // Cria um link temporário para download
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-smartmarket-${this.supermarketId()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.snackBar.open('Download iniciado!', 'Fechar', { duration: 2000 });
  }

  public copyStoreLink() {
    const smId = this.supermarketId();
    if (!smId) return;

    // URL da vitrine pública conforme REQUIREMENTS.md
    const storeUrl = `${window.location.origin}/loja/${smId}?utm_source=totem`;
    
    navigator.clipboard.writeText(storeUrl).then(() => {
      this.snackBar.open('Link copiado para a área de transferência!', 'Fechar', { duration: 3000 });
    }).catch(err => {
      console.error('Erro ao copiar link', err);
      this.snackBar.open('Erro ao copiar link.', 'Fechar', { duration: 3000 });
    });
  }
}