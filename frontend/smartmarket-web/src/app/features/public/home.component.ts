import { ChangeDetectionStrategy, Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogService } from '@core/services/public-catalog.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { CampaignService } from '@core/services/campaign.service';
import { NotificationService } from '@core/services/notification.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-public-home',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private catalogService = inject(PublicCatalogService);
  public authService = inject(AuthService);
  private campaignService = inject(CampaignService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Sinais de Estado
  isLoading = signal<boolean>(true);
  location = this.catalogService.currentLocation;
  userRadius = this.catalogService.userSelectedRadius;

  // Sinais de Dados
  offers = signal<any[]>([]);
  supermarkets = signal<any[]>([]);
  flyers = signal<any[]>([]);

  private notifiedCampaignIds = new Set<string>();

  // Efeito: Recarrega o catálogo sempre que a localização ou o raio mudarem
  private _loadEffect = effect(() => {
    const loc = this.location();
    const radius = this.userRadius();
    if (loc) {
      this.loadCatalogData();
    }
  });

  ngOnInit(): void {
    if (!this.location()) {
      this.catalogService.initializeLocation().then(() => {
        // O effect cuidará de chamar loadCatalogData
      });
    }
  }

  private loadCatalogData() {
    this.isLoading.set(true);
    
    // Busca paralela de dados baseada na localização atual
    this.catalogService.getTrendingOffersNearby().subscribe({
      next: (data) => this.offers.set(data),
      error: () => this.offers.set([])
    });

    this.catalogService.getActiveFlyersNearby().subscribe({
      next: (data) => this.flyers.set(data),
      error: () => this.flyers.set([])
    });

    this.catalogService.getNearbySupermarkets().subscribe({
      next: (data) => {
        this.supermarkets.set(data);
        this.isLoading.set(false);
        this.checkGeofencedCampaigns(data);
      },
      error: () => {
        this.supermarkets.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private checkGeofencedCampaigns(supermarkets: any[]) {
    if (supermarkets.length === 0) return;
    
    // Request permission gracefully on load
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const requests = supermarkets.map(s => 
      this.campaignService.listarPorSupermercado(s.id).pipe(
        map(campaigns => campaigns.map(c => ({ ...c, supermarketName: s.name, supermarketId: s.id }))),
        catchError(() => of([]))
      )
    );

    forkJoin(requests).subscribe(results => {
      const allCampaigns = results.flat();
      const activeCampaigns = allCampaigns.filter(c => c.status === 'Ativa');
      
      activeCampaigns.forEach(camp => {
        if (this.notifiedCampaignIds.has(camp.id)) {
          return;
        }

        this.notifiedCampaignIds.add(camp.id);

        // Registrar disparo (push enviado) no backend
        this.campaignService.registrarDisparo(camp.id).subscribe();

        // 1. Mostrar notificação nativa do navegador
        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification(`SmartMarket - ${camp.supermarketName}`, {
            body: `${camp.nome}\nToque para ver promoções exclusivas!`,
            requireInteraction: true
          });
          notification.onclick = () => {
            window.focus();
            this.campaignService.registrarConversao(camp.id).subscribe();
            this.router.navigate(['/supermarket', camp.supermarketId]);
          };
        }

        // 2. Mostrar Snackbar interativo no layout web (como Web Push Simulation)
        const snackRef = this.snackBar.open(
          `🔔 Push: [${camp.supermarketName}] ${camp.nome}`,
          'VER OFERTAS',
          {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['smart-toast-success']
          }
        );

        snackRef.onAction().subscribe(() => {
          this.campaignService.registrarConversao(camp.id).subscribe();
          this.router.navigate(['/supermarket', camp.supermarketId]);
        });
      });
    });
  }
}