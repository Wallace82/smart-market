import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

// Services & Models
import { SupermarketService } from '@core/services/supermarket.service';
import { SupermarketResponse } from '@core/models/supermarket.model';

@Component({
  selector: 'app-store-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './store-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreListComponent implements OnInit {
  private supermarketService = inject(SupermarketService);
  private snackBar = inject(MatSnackBar);

  // Estados Reativos
  public isLoading = signal(false);
  public stores = signal<SupermarketResponse[]>([]);

  // Computed signals para contadores
  public totalStores = computed(() => this.stores().length);
  public activeStores = computed(() => this.stores().filter(s => s.status === 'ATIVO').length);
  public pendingStores = computed(() => this.stores().filter(s => s.status === 'PENDENTE').length);

  ngOnInit(): void {
    this.carregarLojas();
  }

  public carregarLojas(): void {
    this.isLoading.set(true);
    this.supermarketService.listarTodos().subscribe({
      next: (data: any) => {
        // Suporta tanto lista direta quanto objeto paginado (Spring Data Page)
        this.stores.set(data.content || data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar lojas', err);
        this.isLoading.set(false);
        this.snackBar.open('Erro ao carregar lista de supermercados.', 'Fechar', { duration: 3000 });
      }
    });
  }

  public alterarStatus(id: string, novoStatus: 'ATIVO' | 'INATIVO' | 'PENDENTE'): void {
    this.supermarketService.alterarStatus(id, novoStatus).subscribe({
      next: () => {
        this.snackBar.open(`Status alterado para ${novoStatus} com sucesso!`, 'Sucesso', { duration: 2000 });
        this.carregarLojas(); // Recarrega a lista
      },
      error: (err) => {
        console.error('Erro ao alterar status', err);
        this.snackBar.open('Erro ao alterar status da loja.', 'Erro', { duration: 3000 });
      }
    });
  }
}