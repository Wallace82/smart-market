import { ChangeDetectionStrategy, Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services & Models
import { EncarteService } from '@core/services/encarte.service';
import { SupermarketService } from '@core/services/supermarket.service';
import { OfertaService, OfertaSupermercado } from '@core/services/oferta.service';
import { EncarteDigitalResponse, TemaEncarteResponse } from '@core/models/encarte.model';
import { SupermarketResponse } from '@core/models/supermarket.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WhitelabelThemeDirective } from '../../../shared/directives/whitelabel-theme.directive';

@Component({
  selector: 'app-flyer-viewer',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule,
    MatProgressSpinnerModule,
    WhitelabelThemeDirective
  ],
  templateUrl: './flyer-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlyerViewerComponent implements OnInit {
  
  // Estado do Encarte
  encarte = signal<EncarteDigitalResponse | null>(null);
  supermarket = signal<SupermarketResponse | null>(null);
  tema = signal<TemaEncarteResponse | null>(null);
  ofertas = signal<OfertaSupermercado[]>([]);
  
  loading = signal(true);
  error = signal(false);

  constructor(
    private route: ActivatedRoute,
    private encarteService: EncarteService,
    private supermarketService: SupermarketService,
    private ofertaService: OfertaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarEncarte(id);
    } else {
      this.error.set(true);
      this.loading.set(false);
    }
  }

  private carregarEncarte(id: string): void {
    this.loading.set(true);
    
    this.encarteService.buscarEncartePorId(id).subscribe({
      next: (encarte) => {
        this.encarte.set(encarte);
        this.carregarDadosComplementares(encarte);
      },
      error: () => {
        // Fallback para demonstração se o ID for mock ou falhar
        if (id.includes('mock')) {
          this.carregarMock();
        } else {
          this.error.set(true);
          this.loading.set(false);
        }
      }
    });
  }

  private carregarDadosComplementares(encarte: EncarteDigitalResponse): void {
    const requests: any = {
      supermarket: this.supermarketService.buscarPorId(encarte.supermercadoId),
      ofertas: this.ofertaService.buscarPorSupermercado(encarte.supermercadoId)
    };
 
    forkJoin(requests).subscribe({
      next: (res: any) => {
        this.supermarket.set(res.supermarket);
        
        // Se houver tema, busca de forma assíncrona na lista de temas
        if (encarte.temaId) {
          this.encarteService.listarTemas().pipe(
            catchError(() => of([]))
          ).subscribe(temas => {
            const t = temas.find(tema => tema.id === encarte.temaId);
            this.tema.set(t || null);
          });
        } else {
          this.tema.set(null);
        }
 
        // Filtra apenas as ofertas que pertencem ao encarte
        const ofertasDoEncarte = res.ofertas.filter((o: OfertaSupermercado) => 
          encarte.itens?.some(item => item.ofertaId === o.id)
        );
        this.ofertas.set(ofertasDoEncarte);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados complementares do encarte:', err);
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  private carregarMock(): void {
    // Simulação idêntica ao preview da criação
    this.supermarket.set({
      id: 'm1',
      nomeFantasia: 'Supermercado Central',
      corPrimariaHex: '#16a34a',
      urlLogomarca: 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png'
    } as any);

    this.tema.set({
      id: 't1',
      nome: 'Ofertas de Natal',
      urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1000&auto=format&fit=crop',
      corFundoHex: '#fff5f5'
    } as any);

    this.encarte.set({
      titulo: 'Ofertas Especiais',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 86400000 * 7).toISOString()
    } as any);

    this.ofertas.set([
      { id: 'o1', nomeProduto: 'Arroz Agulhinha Tipo 1 - 5kg', preco: 29.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop' },
      { id: 'o2', nomeProduto: 'Feijão Carioca Kicaldo - 1kg', preco: 8.45, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=200&auto=format&fit=crop' },
      { id: 'o3', nomeProduto: 'Óleo de Soja Liza - 900ml', preco: 6.89, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=200&auto=format&fit=crop' },
      { id: 'o4', nomeProduto: 'Café Melitta Vácuo - 500g', preco: 18.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200&auto=format&fit=crop' },
      { id: 'o5', nomeProduto: 'Leite Integral Italac - 1L', preco: 4.59, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1563636619-e9107daaf021?q=80&w=200&auto=format&fit=crop' },
      { id: 'o6', nomeProduto: 'Detergente Ipê Neutro - 500ml', preco: 2.25, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d1e?q=80&w=200&auto=format&fit=crop' },
      { id: 'o7', nomeProduto: 'Picanha Bovina Fatiada (kg)', preco: 69.90, unidadeMedida: 'KG', urlImagem: 'https://images.unsplash.com/photo-1558030006-45c675171f65?q=80&w=200&auto=format&fit=crop' },
      { id: 'o8', nomeProduto: 'Cerveja Heineken Long Neck 330ml', preco: 6.49, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=200&auto=format&fit=crop' },
      { id: 'o9', nomeProduto: 'Banana Prata Premium (kg)', preco: 5.98, unidadeMedida: 'KG', urlImagem: 'https://images.unsplash.com/photo-1571771894821-ad9902d83f4e?q=80&w=200&auto=format&fit=crop' },
      { id: 'o10', nomeProduto: 'Açúcar Cristal Delta - 5kg', preco: 16.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?q=80&w=200&auto=format&fit=crop' },
      { id: 'o11', nomeProduto: 'Sabão em Pó Omo 1.6kg', preco: 24.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?q=80&w=200&auto=format&fit=crop' },
      { id: 'o12', nomeProduto: 'Papel Higiênico Neve 12 rolos', preco: 19.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop' },
      { id: 'o13', nomeProduto: 'Maionese Hellmanns 500g', preco: 11.45, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1585325701166-38209ef8a191?q=80&w=200&auto=format&fit=crop' },
      { id: 'o14', nomeProduto: 'Refrigerante Coca-Cola 2L', preco: 9.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1622708782596-13d9744f9900?q=80&w=200&auto=format&fit=crop' },
      { id: 'o15', nomeProduto: 'Biscoito Recheado Passatempo', preco: 2.99, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1558961312-5034fab3930e?q=80&w=200&auto=format&fit=crop' },
      { id: 'o16', nomeProduto: 'Coração de Frango (kg)', preco: 22.90, unidadeMedida: 'KG', urlImagem: 'https://images.unsplash.com/photo-1606411594919-482466d97e20?q=80&w=200&auto=format&fit=crop' },
      { id: 'o17', nomeProduto: 'Tomate Italiano (kg)', preco: 7.45, unidadeMedida: 'KG', urlImagem: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=200&auto=format&fit=crop' },
      { id: 'o18', nomeProduto: 'Vinho Tinto Chileno 750ml', preco: 39.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=200&auto=format&fit=crop' },
      { id: 'o19', nomeProduto: 'Shampoo Dove 400ml', preco: 18.50, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=200&auto=format&fit=crop' },
      { id: 'o20', nomeProduto: 'Sabonete Rexona 84g', preco: 2.15, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1610555356070-d0efb6505f81?q=80&w=200&auto=format&fit=crop' }
    ] as any);

    this.loading.set(false);
  }

  get viewerStyle() {
    const t = this.tema();
    const isDark = t?.id === 't4' || t?.nome?.toLowerCase().includes('black');
    
    return {
      'background-image': t?.urlBackgroundDecorativo 
        ? `linear-gradient(${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'}, ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'}), url(${t.urlBackgroundDecorativo})` 
        : 'none',
      'background-size': 'cover',
      'background-position': 'center',
      'background-color': t?.corFundoHex || '#f8fafc',
      'color': isDark ? '#ffffff' : '#1f2937'
    };
  }
}