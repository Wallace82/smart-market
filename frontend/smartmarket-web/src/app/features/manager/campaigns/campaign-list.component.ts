import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/auth/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';
import { CampaignService } from '@core/services/campaign.service';
import { NotificationService } from '@core/services/notification.service';
import { Campaign } from '@core/models/campaign.model';
import { CampaignFormDialogComponent } from './campaign-form-dialog.component';

@Component({
  selector: 'app-campaign-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './campaign-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent implements OnInit {
  private authService = inject(AuthService);
  private supermarketService = inject(SupermarketService);
  private campaignService = inject(CampaignService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);

  public campaigns = signal<Campaign[]>([]);
  public loading = signal(true);
  public supermercadoId = signal<string | null>(null);

  public activeCount = computed(() => this.campaigns().filter(c => c.status === 'Ativa').length);
  public totalConversions = computed(() => this.campaigns().reduce((acc, curr) => acc + (curr.conversoes || 0), 0));

  ngOnInit() {
    const user = this.authService.user();
    if (user && user.id) {
      this.supermarketService.buscarPorGestor(user.id).subscribe({
        next: (supermarkets) => {
          if (supermarkets && supermarkets.length > 0) {
            const id = supermarkets[0].id;
            this.supermercadoId.set(id);
            this.carregarCampanhas(id);
          } else {
            this.loading.set(false);
            this.notification.warn('Nenhum supermercado encontrado para este gestor.');
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.notification.error('Erro ao buscar informações do supermercado.');
        }
      });
    } else {
      this.loading.set(false);
      this.notification.error('Usuário não autenticado.');
    }
  }

  carregarCampanhas(superId: string) {
    this.loading.set(true);
    this.campaignService.listarPorSupermercado(superId).subscribe({
      next: (data) => {
        this.campaigns.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.notification.error('Erro ao carregar as campanhas.');
      }
    });
  }

  novaCampanha() {
    const id = this.supermercadoId();
    if (!id) {
      this.notification.warn('Identificação do supermercado não encontrada.');
      return;
    }

    const dialogRef = this.dialog.open(CampaignFormDialogComponent, {
      width: '500px',
      data: { supermercadoId: id },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.campaignService.cadastrar(result).subscribe({
          next: () => {
            this.notification.success('Campanha criada com sucesso!');
            this.carregarCampanhas(id);
          },
          error: (err) => {
            this.notification.error('Erro ao cadastrar a campanha.');
          }
        });
      }
    });
  }

  alterarStatus(campaignId: string, status: 'Ativa' | 'Pausada' | 'Concluída') {
    const id = this.supermercadoId();
    if (!id) return;

    this.campaignService.alterarStatus(campaignId, status).subscribe({
      next: () => {
        this.notification.success(`Campanha atualizada para status ${status}!`);
        this.carregarCampanhas(id);
      },
      error: (err) => {
        this.notification.error('Erro ao atualizar status da campanha.');
      }
    });
  }

  deletarCampanha(campaignId: string) {
    const id = this.supermercadoId();
    if (!id) return;

    this.campaignService.deletar(campaignId).subscribe({
      next: () => {
        this.notification.success('Campanha excluída com sucesso!');
        this.carregarCampanhas(id);
      },
      error: (err) => {
        this.notification.error('Erro ao excluir a campanha.');
      }
    });
  }
}