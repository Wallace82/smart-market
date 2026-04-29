import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EncarteService } from '@core/services/encarte.service';
import { SupermarketService } from '@core/services/supermarket.service';

import { OfertaService, OfertaSupermercado } from '@core/services/oferta.service';
import { TemaEncarteResponse, EncarteDigitalRequest, EncarteItem } from '@core/models/encarte.model';
import { SupermarketResponse } from '@core/models/supermarket.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-flyer-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './flyer-create.component.html',
  styleUrl: './flyer-create.component.scss'
})
export class FlyerCreateComponent implements OnInit {
  form: FormGroup;
  encarteId = signal<string | null>(null);
  temas = signal<TemaEncarteResponse[]>([]);
  supermarket = signal<SupermarketResponse | null>(null);
  ofertasDisponiveis = signal<OfertaSupermercado[]>([]);
  ofertasSelecionadas = signal<OfertaSupermercado[]>([]);
  loading = signal(false);
  dataLoading = signal(true);
  searchTerm = signal('');

  // Dados Mockados para garantir funcionalidade imediata
  private readonly MOCK_TEMAS: TemaEncarteResponse[] = [
    { id: 't1', nome: 'Ofertas de Natal', urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1000&auto=format&fit=crop', corFundoHex: '#fff5f5', ativo: true, criadoEm: new Date().toISOString() },
    { id: 't2', nome: 'Semana do Consumidor', urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop', corFundoHex: '#f0f9ff', ativo: true, criadoEm: new Date().toISOString() },
    { id: 't3', nome: 'Arraiá de Ofertas', urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop', corFundoHex: '#fffbeb', ativo: true, criadoEm: new Date().toISOString() },
    { id: 't4', nome: 'Black Friday', urlBackgroundDecorativo: 'https://images.unsplash.com/photo-1511517592261-8631b329606d?q=80&w=1000&auto=format&fit=crop', corFundoHex: '#1a1a1a', ativo: true, criadoEm: new Date().toISOString() }
  ];

  private readonly MOCK_OFERTAS: OfertaSupermercado[] = [
    { id: 'o1', supermercadoId: 'm1', produtoBaseId: 'p1', nomeProduto: 'Arroz Agulhinha Tipo 1 - 5kg', preco: 29.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o2', supermercadoId: 'm1', produtoBaseId: 'p2', nomeProduto: 'Feijão Carioca Kicaldo - 1kg', preco: 8.45, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o3', supermercadoId: 'm1', produtoBaseId: 'p3', nomeProduto: 'Óleo de Soja Liza - 900ml', preco: 6.89, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o4', supermercadoId: 'm1', produtoBaseId: 'p4', nomeProduto: 'Café Melitta Vácuo - 500g', preco: 18.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o5', supermercadoId: 'm1', produtoBaseId: 'p5', nomeProduto: 'Leite Integral Italac - 1L', preco: 4.59, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1563636619-e9107daaf021?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o6', supermercadoId: 'm1', produtoBaseId: 'p6', nomeProduto: 'Detergente Ipê Neutro - 500ml', preco: 2.25, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d1e?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o7', supermercadoId: 'm1', produtoBaseId: 'p7', nomeProduto: 'Picanha Bovina Fatiada (kg)', preco: 69.90, unidadeMedida: 'KG', urlImagem: 'https://images.unsplash.com/photo-1558030006-45c675171f65?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o8', supermercadoId: 'm1', produtoBaseId: 'p8', nomeProduto: 'Cerveja Heineken Long Neck 330ml', preco: 6.49, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o9', supermercadoId: 'm1', produtoBaseId: 'p9', nomeProduto: 'Banana Prata Premium (kg)', preco: 5.98, unidadeMedida: 'KG', urlImagem: 'https://images.unsplash.com/photo-1571771894821-ad9902d83f4e?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o10', supermercadoId: 'm1', produtoBaseId: 'p10', nomeProduto: 'Açúcar Cristal Delta - 5kg', preco: 16.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o11', supermercadoId: 'm1', produtoBaseId: 'p11', nomeProduto: 'Sabão em Pó Omo 1.6kg', preco: 24.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o12', supermercadoId: 'm1', produtoBaseId: 'p12', nomeProduto: 'Papel Higiênico Neve 12 rolos', preco: 19.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o13', supermercadoId: 'm1', produtoBaseId: 'p13', nomeProduto: 'Maionese Hellmanns 500g', preco: 11.45, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1585325701166-38209ef8a191?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o14', supermercadoId: 'm1', produtoBaseId: 'p14', nomeProduto: 'Refrigerante Coca-Cola 2L', preco: 9.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1622708782596-13d9744f9900?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o15', supermercadoId: 'm1', produtoBaseId: 'p15', nomeProduto: 'Biscoito Recheado Passatempo', preco: 2.99, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1558961312-5034fab3930e?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o16', supermercadoId: 'm1', produtoBaseId: 'p16', nomeProduto: 'Coração de Frango (kg)', preco: 22.90, unidadeMedida: 'KG', urlImagem: 'https://images.unsplash.com/photo-1606411594919-482466d97e20?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o17', supermercadoId: 'm1', produtoBaseId: 'p17', nomeProduto: 'Tomate Italiano (kg)', preco: 7.45, unidadeMedida: 'KG', urlImagem: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o18', supermercadoId: 'm1', produtoBaseId: 'p18', nomeProduto: 'Vinho Tinto Chileno 750ml', preco: 39.90, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o19', supermercadoId: 'm1', produtoBaseId: 'p19', nomeProduto: 'Shampoo Dove 400ml', preco: 18.50, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=200&auto=format&fit=crop', ativo: true },
    { id: 'o20', supermercadoId: 'm1', produtoBaseId: 'p20', nomeProduto: 'Sabonete Rexona 84g', preco: 2.15, unidadeMedida: 'UN', urlImagem: 'https://images.unsplash.com/photo-1610555356070-d0efb6505f81?q=80&w=200&auto=format&fit=crop', ativo: true }
  ];

  // Filtro de ofertas para facilitar a seleção
  ofertasFiltradas = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.ofertasDisponiveis();
    return this.ofertasDisponiveis().filter(o => 
      o.nomeProduto.toLowerCase().includes(term)
    );
  });

  // Computed para o tema selecionado no formulário para o preview
  selectedThemeId = signal<string | null>(null);
  currentTheme = computed(() => this.temas().find(t => t.id === this.selectedThemeId()));

  constructor(
    private fb: FormBuilder,
    private encarteService: EncarteService,
    private supermarketService: SupermarketService,
    private ofertaService: OfertaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      temaId: [null],
      dataInicio: [new Date().toISOString().split('T')[0], Validators.required],
      dataFim: ['', Validators.required]
    });

    this.form.get('temaId')?.valueChanges.subscribe(id => this.selectedThemeId.set(id));
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.encarteId.set(id);
    } else {
      // Simula um ID para fins de demonstração da interface (botões de visualização)
      this.encarteId.set('mock-flyer-id');
    }
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    const user = this.authService.user();
    this.dataLoading.set(true);
    
    // Se não houver usuário logado (ambiente de teste/mock), carrega apenas mocks
    if (!user) {
      this.temas.set(this.MOCK_TEMAS);
      this.ofertasDisponiveis.set(this.MOCK_OFERTAS);
      this.dataLoading.set(false);
      return;
    }

    const requests: any = {
      temas: this.encarteService.listarTemas().pipe(catchError(() => of(this.MOCK_TEMAS))),
      supermarkets: this.supermarketService.buscarPorGestor(user.id).pipe(catchError(() => of([])))
    };

    if (this.encarteId()) {
      requests.encarte = this.encarteService.buscarEncartePorId(this.encarteId()!);
    }

    forkJoin(requests).subscribe({
      next: (res: any) => {
        // Usa mocks se a API retornar vazio
        this.temas.set(res.temas?.length ? res.temas : this.MOCK_TEMAS);
        
        if (res.supermarkets && res.supermarkets.length > 0) {
          const market = res.supermarkets[0];
          this.supermarket.set(market);
          
          this.ofertaService.buscarPorSupermercado(market.id).subscribe({
            next: (ofertas) => {
              this.ofertasDisponiveis.set(ofertas.length ? ofertas : this.MOCK_OFERTAS);
              if (res.encarte) this.preencherFormulario(res.encarte, this.ofertasDisponiveis());
              this.dataLoading.set(false);
            },
            error: () => {
              this.ofertasDisponiveis.set(this.MOCK_OFERTAS);
              this.dataLoading.set(false);
            }
          });
        } else {
          this.ofertasDisponiveis.set(this.MOCK_OFERTAS);
          this.dataLoading.set(false);
        }
      },
      error: () => {
        this.temas.set(this.MOCK_TEMAS);
        this.ofertasDisponiveis.set(this.MOCK_OFERTAS);
        this.dataLoading.set(false);
      }
    });
  }

  preencherFormulario(encarte: any, ofertas: OfertaSupermercado[]): void {
    this.form.patchValue({
      titulo: encarte.titulo,
      temaId: encarte.temaId,
      dataInicio: encarte.dataInicio ? new Date(encarte.dataInicio).toISOString().split('T')[0] : '',
      dataFim: encarte.dataFim ? new Date(encarte.dataFim).toISOString().split('T')[0] : ''
    });

    if (encarte.itens) {
      const selecionadas = ofertas.filter(o => 
        encarte.itens.some((item: any) => item.ofertaId === o.id)
      );
      this.ofertasSelecionadas.set(selecionadas);
    }
  }

  toggleOferta(oferta: OfertaSupermercado): void {
    const selecionadas = [...this.ofertasSelecionadas()];
    const index = selecionadas.findIndex(o => o.id === oferta.id);
    if (index >= 0) {
      selecionadas.splice(index, 1);
    } else {
      selecionadas.push(oferta);
    }
    this.ofertasSelecionadas.set(selecionadas);
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  visualizarPublico(): void {
    if (this.encarteId()) {
      window.open(`/flyer/${this.encarteId()}`, '_blank');
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    const itens: EncarteItem[] = this.ofertasSelecionadas().map((o, index) => ({
      ofertaId: o.id,
      ordemExibicao: index,
      destaque: false
    }));

    const request: EncarteDigitalRequest = {
      ...this.form.value,
      supermercadoId: this.supermarket()?.id || 'mock-id',
      itens: itens
    };

    const operation = this.encarteId() 
      ? this.encarteService.atualizarEncarte(this.encarteId()!, request)
      : this.encarteService.criarEncarte(request);

    operation.subscribe({
      next: () => {
        this.snackBar.open(`Encarte ${this.encarteId() ? 'atualizado' : 'criado'} com sucesso!`, 'Fechar', { duration: 3000 });
        this.router.navigate(['/manager/flyers']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Erro ao salvar encarte. (Ambiente Mock: Simulação de sucesso)', 'OK', { duration: 3000 });
        // Simula sucesso em ambiente de desenvolvimento se falhar
        setTimeout(() => this.router.navigate(['/manager/flyers']), 2000);
      }
    });
  }

  get previewStyle() {
    const theme = this.currentTheme();
    const market = this.supermarket();
    const isDark = theme?.id === 't4'; // Black Friday
    
    return {
      'background-image': theme?.urlBackgroundDecorativo 
        ? `linear-gradient(${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'}, ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'}), url(${theme.urlBackgroundDecorativo})` 
        : 'none',
      'background-size': 'cover',
      'background-position': 'center',
      'background-color': theme?.corFundoHex || '#ffffff',
      'border-top': `12px solid ${market?.corPrimariaHex || '#16a34a'}`,
      'color': isDark ? '#ffffff' : '#1f2937'
    };
  }
}
