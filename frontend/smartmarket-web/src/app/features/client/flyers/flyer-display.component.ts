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
  
  themeType = computed(() => {
    const name = this.tema()?.nome?.toLowerCase() || '';
    if (name) {
      if (name.includes('mãe') || name.includes('mae')) return 'mothersday';
      if (name.includes('páscoa') || name.includes('pascoa')) return 'easter';
      if (name.includes('natal') || name.includes('fim de ano')) return 'christmas';
      if (name.includes('black') || name.includes('sexta')) return 'blackfriday';
      return 'default';
    }
    const title = this.encarte()?.titulo?.toLowerCase() || '';
    if (title.includes('mãe') || title.includes('mae')) return 'mothersday';
    if (title.includes('páscoa') || title.includes('pascoa')) return 'easter';
    if (title.includes('natal') || title.includes('fim de ano')) return 'christmas';
    if (title.includes('black') || title.includes('sexta')) return 'blackfriday';
    return 'default';
  });
  
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
                const list = detalhes.filter((d: any) => d !== null) as OfertaSupermercado[];
                
                // Algoritmo de Mistura para Destaques (Estilo Encarte Real)
                const supers = list.filter(o => o.superOferta);
                const normals = list.filter(o => !o.superOferta);
                const misturadas: OfertaSupermercado[] = [];
                let superIdx = 0;
                let normalIdx = 0;
                
                while (superIdx < supers.length || normalIdx < normals.length) {
                  if (superIdx < supers.length) {
                    misturadas.push(supers[superIdx++]);
                  }
                  for (let i = 0; i < 3 && normalIdx < normals.length; i++) {
                    misturadas.push(normals[normalIdx++]);
                  }
                }
                
                this.detalhesOfertas.set(misturadas);
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
