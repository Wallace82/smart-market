import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClienteService } from '@core/services/client.service';
import { AuthService } from '@core/auth/auth.service';
import { PublicCatalogService } from '@core/services/public-catalog.service';
import { CategoriaService } from '@core/services/categoria.service';
import { ProductBaseService } from '@core/services/product-base.service';
import { LocalFavorito, LocalFavoritoRequest, PreferenciaProduto, PreferenciaProdutoRequest } from '@core/models/cliente-preferencias.model';
import { catchError, of } from 'rxjs';

type ActiveTab = 'locais' | 'preferencias';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './cliente-perfil.component.html',
  styleUrls: ['./cliente-perfil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientePerfilComponent implements OnInit {
  private clienteService = inject(ClienteService);
  public authService = inject(AuthService);
  private catalogService = inject(PublicCatalogService);
  private categoriaService = inject(CategoriaService);
  private produtoService = inject(ProductBaseService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // ===== Estado =====
  activeTab = signal<ActiveTab>('locais');
  isLoadingLocais = signal(true);
  isLoadingPreferencias = signal(true);
  isLoadingCategorias = signal(true);
  isSavingLocal = signal(false);
  showAddLocalModal = signal(false);
  showAddPrefModal = signal(false);
  searchProduto = signal('');
  isSearchingProduto = signal(false);

  // ===== Dados =====
  locais = signal<LocalFavorito[]>([]);
  preferencias = signal<PreferenciaProduto[]>([]);
  categorias = signal<any[]>([]);
  produtosBuscados = signal<any[]>([]);

  // Formulário de novo local
  localForm: FormGroup = this.fb.group({
    apelido: ['', [Validators.required, Validators.maxLength(100)]],
    endereco: ['', [Validators.required]],
    cep: [''],
    bairro: [''],
    cidade: [''],
    estado: [''],
    latitude: [null],
    longitude: [null],
    raioKm: [10, [Validators.min(1), Validators.max(100)]]
  });

  isLocatingGps = signal(false);

  userInitial = computed(() => {
    const u = this.authService.user();
    return u ? u.email.charAt(0).toUpperCase() : '?';
  });

  userName = computed(() => {
    const u = this.authService.user();
    return u ? u.email.split('@')[0] : '';
  });

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadLocais();
    this.loadPreferencias();
    this.loadCategorias();
  }

  // ===== LOCAIS =====

  loadLocais(): void {
    this.isLoadingLocais.set(true);
    this.clienteService.getLocais().pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      this.locais.set(data);
      this.isLoadingLocais.set(false);
    });
  }

  openAddLocalModal(): void {
    this.localForm.reset({ raioKm: 10 });
    this.showAddLocalModal.set(true);
  }

  closeAddLocalModal(): void {
    this.showAddLocalModal.set(false);
  }

  async usarGps(): Promise<void> {
    this.isLocatingGps.set(true);
    try {
      const coords = await this.catalogService.requestUserLocation();
      const address = await this.catalogService.getAddressFromCoordinates(coords.lat, coords.lng);
      this.localForm.patchValue({
        latitude: coords.lat,
        longitude: coords.lng,
        endereco: address
      });
      this.notify('📍 Localização obtida via GPS!', 'success');
    } catch {
      this.notify('Não foi possível obter a localização via GPS.', 'error');
    } finally {
      this.isLocatingGps.set(false);
    }
  }

  async buscarCep(): Promise<void> {
    const cep = this.localForm.get('cep')?.value?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;
    try {
      const res = await fetch(`/external/cep/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        this.localForm.patchValue({
          endereco: `${data.logradouro || ''}, ${data.bairro || ''} - ${data.localidade}/${data.uf}`.trim(),
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        });
      }
    } catch { /* silent */ }
  }

  salvarLocal(): void {
    if (this.localForm.invalid) return;
    this.isSavingLocal.set(true);
    const req: LocalFavoritoRequest = this.localForm.value;
    this.clienteService.salvarLocal(req).subscribe({
      next: (salvo) => {
        this.locais.update(list => [salvo, ...list]);
        this.closeAddLocalModal();
        this.notify(`✅ Local "${salvo.apelido}" adicionado!`, 'success');
        this.isSavingLocal.set(false);
      },
      error: (err) => {
        this.notify(err?.error?.error || 'Erro ao salvar local.', 'error');
        this.isSavingLocal.set(false);
      }
    });
  }

  ativarLocal(local: LocalFavorito): void {
    this.clienteService.ativarLocal(local.id).subscribe({
      next: (ativo) => {
        // Atualiza o estado localmente
        this.locais.update(list =>
          list.map(l => ({ ...l, ativo: l.id === ativo.id }))
        );
        // Atualiza o catalogo público com o local selecionado
        this.catalogService.setLocation({
          address: ativo.endereco,
          lat: ativo.latitude,
          lng: ativo.longitude,
          cep: ativo.cep,
          isGps: false,
          isExplicit: true
        });
        // Atualiza o raio preferido
        this.catalogService.userSelectedRadius.set(ativo.raioKm);
        this.notify(`📍 "${ativo.apelido}" definido como local ativo!`, 'success');
      },
      error: () => this.notify('Erro ao ativar local.', 'error')
    });
  }

  removerLocal(local: LocalFavorito): void {
    this.clienteService.removerLocal(local.id).subscribe({
      next: () => {
        this.locais.update(list => list.filter(l => l.id !== local.id));
        this.notify(`🗑️ "${local.apelido}" removido.`, 'success');
      },
      error: () => this.notify('Erro ao remover local.', 'error')
    });
  }

  // ===== PREFERÊNCIAS DE PRODUTO =====

  loadPreferencias(): void {
    this.isLoadingPreferencias.set(true);
    this.clienteService.getPreferencias().pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      this.preferencias.set(data);
      this.isLoadingPreferencias.set(false);
    });
  }

  loadCategorias(): void {
    this.isLoadingCategorias.set(true);
    this.categoriaService.listar().pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      this.categorias.set(data);
      this.isLoadingCategorias.set(false);
    });
  }

  buscarProdutos(term: string): void {
    if (!term || term.length < 2) {
      this.produtosBuscados.set([]);
      return;
    }
    this.isSearchingProduto.set(true);
    this.produtoService.listarTodos(0, 10, term).pipe(
      catchError(() => of({ content: [] }))
    ).subscribe((data: any) => {
      const items = data?.content || data || [];
      this.produtosBuscados.set(items);
      this.isSearchingProduto.set(false);
    });
  }

  adicionarPreferencia(produto: any): void {
    const req: PreferenciaProdutoRequest = {
      produtoBaseId: produto.id,
      nomeProduto: produto.nome || produto.nomeProduto || produto.descricao,
      categoriaId: produto.categoriaId,
      categoriaNome: produto.categoriaNome || '',
      marca: produto.marca || '',
      unidadeMedida: produto.unidadeMedida || '',
      urlImagem: produto.urlImagem || ''
    };
    this.clienteService.salvarPreferencia(req).subscribe({
      next: (salva) => {
        this.preferencias.update(list => [salva, ...list]);
        this.produtosBuscados.set([]);
        this.searchProduto.set('');
        this.notify(`❤️ "${salva.nomeProduto}" adicionado às preferências!`, 'success');
      },
      error: (err) => this.notify(err?.error?.error || 'Produto já adicionado.', 'error')
    });
  }

  removerPreferencia(pref: PreferenciaProduto): void {
    this.clienteService.removerPreferencia(pref.id).subscribe({
      next: () => {
        this.preferencias.update(list => list.filter(p => p.id !== pref.id));
        this.notify(`🗑️ "${pref.nomeProduto}" removido das preferências.`, 'success');
      },
      error: () => this.notify('Erro ao remover preferência.', 'error')
    });
  }

  // ===== HELPERS =====

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  getLocalIcon(apelido: string): string {
    const a = apelido.toLowerCase();
    if (a.includes('casa') && !a.includes('sogra') && !a.includes('mae') && !a.includes('mãe')) return 'home';
    if (a.includes('trabalho') || a.includes('empresa') || a.includes('escritório')) return 'work';
    if (a.includes('academia') || a.includes('gym')) return 'fitness_center';
    if (a.includes('escola') || a.includes('faculdade') || a.includes('universidade')) return 'school';
    if (a.includes('sogra') || a.includes('mae') || a.includes('mãe') || a.includes('família')) return 'family_restroom';
    if (a.includes('mercado') || a.includes('super')) return 'shopping_cart';
    return 'location_on';
  }

  private notify(msg: string, type: 'success' | 'error'): void {
    this.snackBar.open(msg, '✕', {
      duration: 3500,
      panelClass: type === 'error' ? ['snack-error'] : ['snack-success'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
