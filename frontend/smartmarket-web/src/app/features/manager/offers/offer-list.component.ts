import { ChangeDetectionStrategy, Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';
import { OfertaService } from '@core/services/oferta.service';
import { CategoriaService } from '@core/services/categoria.service';
import { OfferFormDialogComponent } from './offer-form-dialog.component';
 
export interface Offer {
  id: string;
  productName: string;
  category: string;
  originalPrice: string;
  discountPrice: string;
  status: 'Ativa' | 'Programada' | 'Expirada';
  validUntil: string;
  imageUrl: string;
  superOferta?: boolean;
}
 
@Component({
  selector: 'app-offer-list',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule, 
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './offer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferListComponent implements OnInit {
  private authService = inject(AuthService);
  private supermarketService = inject(SupermarketService);
  private ofertaService = inject(OfertaService);
  private categoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
 
  public isLoading = signal(false);
  public offers = signal<Offer[]>([]);
  private rawOffers: any[] = [];
 
  public activeOffersCount = computed(() => this.offers().filter(o => o.status === 'Ativa').length);
  public totalOffersCount = computed(() => this.offers().length);
 
  ngOnInit(): void {
    this.carregarDados();
  }
 
  public carregarDados(): void {
    const user = this.authService.user();
    if (!user) return;
 
    this.isLoading.set(true);
 
    // 1. Carregar Categorias para mapear categoriaId -> nome
    const requests = {
      categorias: this.categoriaService.listar().pipe(catchError(() => of([]))),
      supermarkets: this.supermarketService.buscarPorGestor(user.id).pipe(catchError(() => of([])))
    };
 
    forkJoin(requests).subscribe({
      next: (res) => {
        const categoriasMap = new Map(res.categorias.map(c => [c.id, c.nome]));
 
        if (res.supermarkets.length > 0) {
          const smId = res.supermarkets[0].id;
 
          // 2. Carregar Ofertas do Supermercado
          this.ofertaService.buscarPorSupermercado(smId).subscribe({
            next: (ofertas) => {
              this.rawOffers = ofertas;
              const now = new Date();
              const mapped: Offer[] = ofertas.map(o => {
                let status: 'Ativa' | 'Programada' | 'Expirada' = 'Ativa';
                if (!o.ativo) {
                  status = 'Expirada';
                } else if (o.dataInicioPromocao && o.dataFimPromocao) {
                  const start = new Date(o.dataInicioPromocao);
                  const end = new Date(o.dataFimPromocao);
                  if (now < start) {
                    status = 'Programada';
                  } else if (now > end) {
                    status = 'Expirada';
                  }
                }
 
                const original = o.precoAtual !== undefined && o.precoAtual !== null ? o.precoAtual : o.preco;
                const discount = o.precoPromocional !== undefined && o.precoPromocional !== null ? o.precoPromocional : o.preco;
                
                return {
                  id: o.id,
                  productName: o.nomeProduto,
                  category: o.produtoBase?.categoriaId ? (categoriasMap.get(o.produtoBase.categoriaId) || 'Mercearia') : 'Mercearia',
                  originalPrice: original.toFixed(2).replace('.', ','),
                  discountPrice: discount.toFixed(2).replace('.', ','),
                  status: status,
                  validUntil: o.dataFimPromocao ? new Date(o.dataFimPromocao).toLocaleDateString('pt-BR') : 'Sem Validade',
                  imageUrl: o.urlImagem || 'assets/images/cache/arroz.jpg',
                  superOferta: o.superOferta
                };
              });
 
              this.offers.set(mapped);
              this.isLoading.set(false);
            },
            error: () => {
              this.isLoading.set(false);
              this.snackBar.open('Erro ao carregar ofertas do supermercado.', 'Fechar', { duration: 3000 });
            }
          });
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Erro ao inicializar dados de ofertas.', 'Fechar', { duration: 3000 });
      }
    });
  }
 
  public abrirNovaOfertaDialog(): void {
    const user = this.authService.user();
    if (!user) {
      this.snackBar.open('Você precisa estar logado para cadastrar uma oferta.', 'Fechar', { duration: 3000 });
      return;
    }
 
    this.isLoading.set(true);
    this.supermarketService.buscarPorGestor(user.id).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.length > 0) {
          const smId = res[0].id;
          const dialogRef = this.dialog.open(OfferFormDialogComponent, {
            width: '100%',
            maxWidth: '500px',
            panelClass: 'offer-dialog-custom',
            disableClose: false
          });
 
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.isLoading.set(true);
              const { produtoBaseId, ...ofertaData } = result;
              this.ofertaService.criar(smId, produtoBaseId, ofertaData).subscribe({
                next: () => {
                  this.snackBar.open('Oferta cadastrada com sucesso!', 'Fechar', { duration: 3000 });
                  this.carregarDados();
                },
                error: (err) => {
                  this.isLoading.set(false);
                  const errorMsg = typeof err.error === 'string' ? err.error : 'Erro ao cadastrar oferta.';
                  this.snackBar.open(errorMsg, 'Fechar', { duration: 4000 });
                }
              });
            }
          });
        } else {
          this.snackBar.open('Nenhum supermercado encontrado para este gestor.', 'Fechar', { duration: 3000 });
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Erro ao carregar dados do supermercado.', 'Fechar', { duration: 3000 });
      }
    });
  }
 
  public abrirEditarOfertaDialog(offerId: string): void {
    const raw = this.rawOffers.find(o => o.id === offerId);
    if (!raw) {
      this.snackBar.open('Oferta não encontrada para edição.', 'Fechar', { duration: 3000 });
      return;
    }
 
    const dialogRef = this.dialog.open(OfferFormDialogComponent, {
      width: '100%',
      maxWidth: '500px',
      panelClass: 'offer-dialog-custom',
      data: { offer: raw },
      disableClose: false
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading.set(true);
        const { produtoBaseId, ...ofertaData } = result;
        this.ofertaService.atualizar(offerId, produtoBaseId, ofertaData).subscribe({
          next: () => {
            this.snackBar.open('Oferta atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarDados();
          },
          error: (err) => {
            this.isLoading.set(false);
            const errorMsg = typeof err.error === 'string' ? err.error : 'Erro ao atualizar oferta.';
            this.snackBar.open(errorMsg, 'Fechar', { duration: 4000 });
          }
        });
      }
    });
  }
 
  public excluirOferta(offerId: string): void {
    if (confirm('Deseja realmente excluir esta oferta permanentemente?')) {
      this.isLoading.set(true);
      this.ofertaService.excluir(offerId).subscribe({
        next: () => {
          this.snackBar.open('Oferta excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarDados();
        },
        error: (err) => {
          this.isLoading.set(false);
          const errorMsg = typeof err.error === 'string' ? err.error : 'Erro ao excluir oferta.';
          this.snackBar.open(errorMsg, 'Fechar', { duration: 4000 });
        }
      });
    }
  }
}