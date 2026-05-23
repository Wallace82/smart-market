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
  favoritos = signal<Set<string>>(new Set());
  
  loading = signal(true);
  error = signal(false);

  // Computeds de Tema e Whitelabel
  themeType = computed(() => {
    const name = this.tema()?.nome?.toLowerCase() || '';
    
    // Prioridade absoluta para o Tema Sazonal cadastrado e selecionado no select
    if (name) {
      if (name.includes('mãe') || name.includes('mae')) {
        return 'mothersday';
      }
      if (name.includes('páscoa') || name.includes('pascoa')) {
        return 'easter';
      }
      if (name.includes('natal') || name.includes('fim de ano')) {
        return 'christmas';
      }
      if (name.includes('black') || name.includes('sexta')) {
        return 'blackfriday';
      }
      return 'default'; // Para outros temas cadastrados sem sazonalidade específica (ex: Semana do Consumidor)
    }

    // Fallback secundário pelo título do encarte apenas se NENHUM tema foi vinculado no select
    const title = this.encarte()?.titulo?.toLowerCase() || '';
    if (title.includes('mãe') || title.includes('mae')) {
      return 'mothersday';
    }
    if (title.includes('páscoa') || title.includes('pascoa')) {
      return 'easter';
    }
    if (title.includes('natal') || title.includes('fim de ano')) {
      return 'christmas';
    }
    if (title.includes('black') || title.includes('sexta')) {
      return 'blackfriday';
    }
    
    return 'default';
  });

  themeSubtitle = computed(() => {
    const type = this.themeType();
    switch (type) {
      case 'mothersday':
        return 'Especial Dia das Mães — O carinho que ela merece com a economia que você precisa!';
      case 'easter':
        return 'Especial de Páscoa — Ofertas doces e preços imperdíveis para toda a família!';
      case 'christmas':
        return 'Natal Solidário e Feliz — Celebre as festas com os melhores preços!';
      case 'blackfriday':
        return 'Black Friday SmartMarket — Descontos insanos e estoque limitado!';
      default:
        return 'Aproveite nossas ofertas exclusivas!';
    }
  });

  hasBrand = computed(() => {
    const s = this.supermarket();
    return !!s?.urlLogomarca || !!s?.corPrimariaHex || !!s?.corSecundariaHex;
  });

  constructor(
    private route: ActivatedRoute,
    private encarteService: EncarteService,
    private supermarketService: SupermarketService,
    private ofertaService: OfertaService
  ) {}

  ngOnInit(): void {
    // Carrega favoritos salvos localmente
    const saved = localStorage.getItem('smartmarket_favoritos');
    if (saved) {
      try {
        this.favoritos.set(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Erro ao carregar favoritos:', e);
      }
    }

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

  hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
      : `rgba(0, 0, 0, ${alpha})`;
  }

  get viewerStyle() {
    const t = this.tema();
    const type = this.themeType();
    
    let bgColor = t?.corFundoHex || '#f8fafc';
    let color = '#1f2937';
    let bgImage = 'none';

    if (type === 'blackfriday') {
      bgColor = '#050505'; // Absolute black
      color = '#ffffff';
    } else if (type === 'mothersday') {
      bgColor = '#fff5f7'; // Soft pastel pink rose
      color = '#1f2937';
    } else if (type === 'easter') {
      bgColor = '#fffbeb'; // Warm soft cream/amber
      color = '#1f2937';
    } else if (type === 'christmas') {
      bgColor = '#f3f7f4'; // Festive snowy mint
      color = '#1f2937';
    }

    if (t?.urlBackgroundDecorativo) {
      const isDark = type === 'blackfriday';
      bgImage = `linear-gradient(${isDark ? 'rgba(5,5,5,0.93)' : 'rgba(255,255,255,0.90)'}, ${isDark ? 'rgba(5,5,5,0.93)' : 'rgba(255,255,255,0.90)'}), url(${t.urlBackgroundDecorativo})`;
    } else if (!t && this.supermarket()) {
      const market = this.supermarket()!;
      const primary = market.corPrimariaHex || '#16a34a';
      const secondary = market.corSecundariaHex || '#0284c7';
      bgImage = `linear-gradient(135deg, ${this.hexToRgba(primary, 0.08)} 0%, ${this.hexToRgba(secondary, 0.04)} 50%, #ffffff 100%)`;
      bgColor = '#ffffff';
    }

    return {
      'background-image': bgImage,
      'background-size': 'cover',
      'background-position': 'center',
      'background-color': bgColor,
      'color': color
    };
  }

  get headerStyle() {
    const t = this.tema();
    const type = this.themeType();
    let bg = '';

    if (type === 'mothersday') {
      bg = 'linear-gradient(to right, #f43f5e, #ec4899, #f43f5e)';
    } else if (type === 'easter') {
      bg = 'linear-gradient(to right, #451a03, #78350f, #451a03)';
    } else if (type === 'christmas') {
      bg = 'linear-gradient(to right, #b91c1c, #115e59, #b91c1c)';
    } else if (type === 'blackfriday') {
      bg = 'linear-gradient(to right, #09090b, #18181b, #09090b)';
    } else {
      bg = 'linear-gradient(to right, var(--color-primary), var(--color-secondary))';
    }

    if (t?.urlBackgroundDecorativo) {
      const isDark = type === 'blackfriday' || type === 'easter' || type === 'christmas';
      const overlayStart = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(244,63,94,0.2)';
      const overlayEnd = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(244,63,94,0.35)';
      bg = `linear-gradient(${overlayStart}, ${overlayEnd}), url(${t.urlBackgroundDecorativo})`;
    }

    return {
      'background-image': bg,
      'background-size': 'cover',
      'background-position': 'center'
    };
  }

  toggleFavorito(ofertaId: string): void {
    const favs = new Set(this.favoritos());
    if (favs.has(ofertaId)) {
      favs.delete(ofertaId);
    } else {
      favs.add(ofertaId);
    }
    this.favoritos.set(favs);
    localStorage.setItem('smartmarket_favoritos', JSON.stringify(Array.from(favs)));
  }

  isFavorito(ofertaId: string): boolean {
    return this.favoritos().has(ofertaId);
  }
}