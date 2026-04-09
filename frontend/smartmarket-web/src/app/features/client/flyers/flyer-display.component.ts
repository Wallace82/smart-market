import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { EncarteDigitalResponse, TemaEncarteResponse } from '../../../../core/models/encarte.model';
import { SupermarketResponse } from '../../../../core/models/supermarket.model';
import { EncarteService } from '../../../../core/services/encarte.service';
import { SupermarketService } from '../../../../core/services/supermarket.service';
import { OfertaService, OfertaSupermercado } from '../../../../core/services/oferta.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-flyer-display',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
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
      next: (encarteData) => {
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
              const ofertasIds = encarteData.itens.map(i => i.ofertaId);
              const ofertasRequests = ofertasIds.map(id => 
                this.ofertaService.buscarPorId(id).pipe(catchError(() => of(null)))
              );
              
              forkJoin(ofertasRequests).subscribe(detalhes => {
                this.detalhesOfertas.set(detalhes.filter(d => d !== null) as OfertaSupermercado[]);
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

  // Estilos Dinâmicos
  get pageStyle() {
    const tema = this.tema();
    return {
      'background-image': tema?.urlBackgroundDecorativo ? `url(${tema.urlBackgroundDecorativo})` : 'none',
      'background-color': tema?.corFundoHex || '#f4f4f4',
      'background-attachment': 'fixed',
      'background-size': 'cover'
    };
  }

  get brandPrimary() { return this.supermarket()?.corPrimariaHex || '#e11d48'; }
  get brandSecondary() { return this.supermarket()?.corSecundariaHex || '#ffffff'; }
}
