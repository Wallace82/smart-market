import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { EncarteDigitalResponse, TemaEncarteResponse } from '../../../core/models/encarte.model';
import { SupermarketResponse } from '../../../core/models/supermarket.model';
import { EncarteService } from '../../../core/services/encarte.service';
import { SupermarketService } from '../../../core/services/supermarket.service';
import { OfertaService, OfertaSupermercado } from '../../../core/services/oferta.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WhitelabelThemeDirective } from '../../../shared/directives/whitelabel-theme.directive';

@Component({
  selector: 'app-flyer-display',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, WhitelabelThemeDirective],
  templateUrl: './flyer-display.component.html',
  styleUrl: './flyer-display.component.scss'
})
export class FlyerDisplayComponent implements OnInit {
  encarte = signal<EncarteDigitalResponse | null>(null);
  supermarket = signal<SupermarketResponse | null>(null);
  tema = signal<TemaEncarteResponse | null>(null);
  detalhesOfertas = signal<OfertaSupermercado[]>([]);
  
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private encarteService: EncarteService,
    private supermarketService: SupermarketService,
    private ofertaService: OfertaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarDadosCompletos(id);
    }
  }

  private carregarDadosCompletos(encarteId: string): void {
    this.loading.set(true);
    
    this.encarteService.buscarEncartePorId(encarteId).subscribe({
      next: (encarteData: EncarteDigitalResponse) => {
        this.encarte.set(encarteData);
        
        // Agora buscamos Supermercado, Tema e Detalhes das Ofertas em paralelo
        const obs: any = {
          supermarket: this.supermarketService.buscarPorId(encarteData.supermercadoId),
          tema: encarteData.temaId ? this.encarteService.buscarTemaPorId(encarteData.temaId) : of(null)
        };

        forkJoin(obs).subscribe({
          next: (res: any) => {
            this.supermarket.set(res.supermarket);
            this.tema.set(res.tema);
            
            // Buscar detalhes de cada oferta selecionada no encarte
            if (encarteData.itens && encarteData.itens.length > 0) {
              const ofertasIds = encarteData.itens.map((i: any) => i.ofertaId);
              const ofertasRequests = ofertasIds.map((id: string) => 
                this.ofertaService.buscarPorId(id).pipe(catchError(() => of(null)))
              );
              
              forkJoin(ofertasRequests).subscribe((detalhes: any[]) => {
                this.detalhesOfertas.set(detalhes.filter((d: any) => d !== null) as OfertaSupermercado[]);
                this.loading.set(false);
              });
            } else {
              this.loading.set(false);
            }
          },
          error: () => {
            this.error.set('Erro ao carregar dados do encarte.');
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.error.set('Encarte não encontrado.');
        this.loading.set(false);
      }
    });
  }

  hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
      : `rgba(0, 0, 0, ${alpha})`;
  }

  // Estilos Dinâmicos
  get pageStyle() {
    const tema = this.tema();
    const market = this.supermarket();
    
    let bgImage = 'none';
    let bgColor = '#f4f4f4';

    if (tema) {
      bgImage = tema.urlBackgroundDecorativo ? `url(${tema.urlBackgroundDecorativo})` : 'none';
      bgColor = tema.corFundoHex || '#f4f4f4';
    } else if (market) {
      const primary = market.corPrimariaHex || '#16a34a';
      const secondary = market.corSecundariaHex || '#0284c7';
      bgImage = `linear-gradient(135deg, ${this.hexToRgba(primary, 0.08)} 0%, ${this.hexToRgba(secondary, 0.04)} 50%, #ffffff 100%)`;
      bgColor = '#ffffff';
    }

    return {
      'background-image': bgImage,
      'background-color': bgColor,
      'background-attachment': 'fixed',
      'background-size': 'cover'
    };
  }

  get brandPrimary() { return this.supermarket()?.corPrimariaHex || '#e11d48'; }
  get brandSecondary() { return this.supermarket()?.corSecundariaHex || '#ffffff'; }
}
