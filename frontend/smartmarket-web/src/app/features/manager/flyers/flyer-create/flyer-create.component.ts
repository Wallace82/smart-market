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
import { ActivatedRoute, Router } from '@angular/router';
import { EncarteService } from '../../../../core/services/encarte.service';
import { SupermarketService } from '../../../../core/services/supermarket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { OfertaService, OfertaSupermercado } from '../../../../core/services/oferta.service';
import { TemaEncarteResponse, EncarteDigitalRequest, EncarteItem } from '../../../../core/models/encarte.model';
import { SupermarketResponse } from '../../../../core/models/supermarket.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-flyer-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
      dataInicio: [new Date(), Validators.required],
      dataFim: [null, Validators.required]
    });

    this.form.get('temaId')?.valueChanges.subscribe(id => this.selectedThemeId.set(id));
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.encarteId.set(id);
    }
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    const user = this.authService.user();
    if (!user) return;

    this.dataLoading.set(true);
    
    // Lista de requests iniciais
    const requests: any = {
      temas: this.encarteService.listarTemas(),
      supermarkets: this.supermarketService.buscarPorGestor(user.id)
    };

    // Se for edição, busca o encarte também
    if (this.encarteId()) {
      requests.encarte = this.encarteService.buscarEncartePorId(this.encarteId()!);
    }

    forkJoin(requests).subscribe({
      next: (res: any) => {
        this.temas.set(res.temas);
        
        if (res.supermarkets.length > 0) {
          const market = res.supermarkets[0];
          this.supermarket.set(market);
          
          // Carrega ofertas do supermercado
          this.ofertaService.buscarPorSupermercado(market.id).subscribe(ofertas => {
            this.ofertasDisponiveis.set(ofertas);
            
            // Se for edição, sincroniza as ofertas selecionadas
            if (res.encarte) {
              this.preencherFormulario(res.encarte, ofertas);
            }
            this.dataLoading.set(false);
          });
        } else {
          this.dataLoading.set(false);
        }
      },
      error: () => {
        this.dataLoading.set(false);
        this.snackBar.open('Erro ao carregar dados.', 'Fechar', { duration: 3000 });
      }
    });
  }

  preencherFormulario(encarte: any, ofertas: OfertaSupermercado[]): void {
    this.form.patchValue({
      titulo: encarte.titulo,
      temaId: encarte.temaId,
      dataInicio: new Date(encarte.dataInicio),
      dataFim: new Date(encarte.dataFim)
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

  salvar(): void {
    if (this.form.invalid || !this.supermarket()) return;

    this.loading.set(true);
    const itens: EncarteItem[] = this.ofertasSelecionadas().map((o, index) => ({
      ofertaId: o.id,
      ordemExibicao: index,
      destaque: false
    }));

    const request: EncarteDigitalRequest = {
      ...this.form.value,
      supermercadoId: this.supermarket()!.id,
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
        this.snackBar.open('Erro ao salvar encarte.', 'Fechar', { duration: 3000 });
      }
    });
  }

  get previewStyle() {
    const theme = this.currentTheme();
    const market = this.supermarket();
    return {
      'background-image': theme?.urlBackgroundDecorativo ? `url(${theme.urlBackgroundDecorativo})` : 'none',
      'background-color': theme?.corFundoHex || '#ffffff',
      'border-top': `10px solid ${market?.corPrimariaHex || '#eeeeee'}`
    };
  }
}
