import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/auth/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';
import { CampaignService } from '@core/services/campaign.service';
import { NotificationService } from '@core/services/notification.service';
import { OfertaService, OfertaSupermercado } from '@core/services/oferta.service';
import { EncarteService } from '@core/services/encarte.service';
import { EncarteDigitalResponse } from '@core/models/encarte.model';
import { Campaign, CampaignRequest } from '@core/models/campaign.model';

@Component({
  selector: 'app-campaign-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './campaign-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent implements OnInit {
  private authService = inject(AuthService);
  private supermarketService = inject(SupermarketService);
  private campaignService = inject(CampaignService);
  private notification = inject(NotificationService);
  private ofertaService = inject(OfertaService);
  private encarteService = inject(EncarteService);
  private fb = inject(FormBuilder);

  public campaigns = signal<Campaign[]>([]);
  public loading = signal(true);
  public supermercadoId = signal<string | null>(null);

  // Form & Drawer signals
  public showDrawer = signal(false);
  public isSubmitting = signal(false);
  public campaignForm!: FormGroup;
  
  public offers = signal<OfertaSupermercado[]>([]);
  public flyers = signal<EncarteDigitalResponse[]>([]);
  public loadingTargets = signal(false);

  public activeCount = computed(() => 
    this.campaigns().filter(c => c.status === 'Ativa' || c.status === 'ATIVA').length
  );
  
  public totalConversions = computed(() => 0); // Computed locally as geofence logs are in history

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    const user = this.authService.user();
    if (user && user.id) {
      this.supermarketService.buscarPorGestor(user.id).subscribe({
        next: (supermarkets) => {
          if (supermarkets && supermarkets.length > 0) {
            const id = supermarkets[0].id;
            this.supermercadoId.set(id);
            this.carregarCampanhas(id);
            this.carregarAlvos(id);
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

  private initForm() {
    this.campaignForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
      radiusMeters: [3000, [Validators.required, Validators.min(100), Validators.max(50000)]],
      dailyLimitPerClient: [3, [Validators.required, Validators.min(1), Validators.max(100)]],
      targetType: ['NONE', [Validators.required]],
      targetReferenceId: [null]
    });

    // Handle targetType changes dynamically
    this.campaignForm.get('targetType')?.valueChanges.subscribe((type) => {
      const refControl = this.campaignForm.get('targetReferenceId');
      if (type === 'NONE') {
        refControl?.clearValidators();
        refControl?.setValue(null);
      } else {
        refControl?.setValidators([Validators.required]);
      }
      refControl?.updateValueAndValidity();
    });
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

  carregarAlvos(superId: string) {
    this.loadingTargets.set(true);
    // Fetch offers
    this.ofertaService.buscarPorSupermercado(superId).subscribe({
      next: (ofertas) => {
        this.offers.set(ofertas.filter(o => o.ativo));
      },
      error: () => logError('ofertas')
    });

    // Fetch flyers
    this.encarteService.listarEncartes(superId).subscribe({
      next: (encartes) => {
        this.flyers.set(encartes.filter(e => e.status !== 'ENCERRADO'));
        this.loadingTargets.set(false);
      },
      error: () => {
        logError('encartes');
        this.loadingTargets.set(false);
      }
    });

    const logError = (name: string) => {
      this.notification.warn(`Erro ao carregar ${name} para o supermercado. Vínculos podem ficar indisponíveis.`);
    };
  }

  novaCampanha() {
    this.campaignForm.reset({
      title: '',
      message: '',
      radiusMeters: 3000,
      dailyLimitPerClient: 3,
      targetType: 'NONE',
      targetReferenceId: null
    });
    this.showDrawer.set(true);
  }

  fecharDrawer() {
    this.showDrawer.set(false);
  }

  salvarCampanha() {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    const id = this.supermercadoId();
    if (!id) {
      this.notification.warn('Identificação do supermercado não encontrada.');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.campaignForm.value;
    
    const request: CampaignRequest = {
      supermarketId: id,
      title: formVal.title,
      message: formVal.message,
      radiusMeters: Number(formVal.radiusMeters),
      dailyLimitPerClient: Number(formVal.dailyLimitPerClient),
      target: formVal.targetType !== 'NONE' ? {
        type: formVal.targetType,
        referenceId: formVal.targetReferenceId
      } : null
    };

    this.campaignService.cadastrar(request).subscribe({
      next: () => {
        this.notification.success('Campanha criada com sucesso!');
        this.carregarCampanhas(id);
        this.fecharDrawer();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Erro ao cadastrar a campanha.';
        this.notification.error(errorMsg);
        this.isSubmitting.set(false);
      }
    });
  }

  alterarStatus(campaignId: string, status: 'ATIVA' | 'PAUSADA' | 'CONCLUIDA' | 'Ativa' | 'Pausada' | 'Concluída') {
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

  public getTargetName(campaign: Campaign): string {
    if (!campaign.target || campaign.target.type === 'NONE') {
      return 'Nenhum';
    }
    const refId = campaign.target.referenceId;
    if (campaign.target.type === 'PRODUCT') {
      const offer = this.offers().find(o => o.id === refId);
      return offer ? `Oferta: ${offer.nomeProduto}` : 'Oferta de Produto';
    }
    if (campaign.target.type === 'FLYER') {
      const flyer = this.flyers().find(f => f.id === refId);
      return flyer ? `Encarte: ${flyer.titulo}` : 'Encarte Digital';
    }
    return 'Nenhum';
  }
}