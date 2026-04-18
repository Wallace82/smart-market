import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

// Service
import { EncarteService } from '../../../../core/services/encarte.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SupermarketService } from '../../../../core/services/supermarket.service';

@Component({
  selector: 'app-flyer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Gestão de Encartes</h1>
          <p class="text-gray-600">Acompanhe e gerencie as campanhas da sua loja</p>
        </div>
        <button mat-flat-button color="primary" routerLink="/manager/flyers/create" class="!px-6 !py-2">
          <mat-icon>add</mat-icon> Novo Encarte
        </button>
      </div>

      <mat-card class="!rounded-xl shadow-sm border border-gray-100">
        <mat-card-content class="p-0">
          
          <!-- Loading State -->
          @if (loading()) {
            <div class="flex justify-center items-center p-16">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } 
          
          <!-- Empty State -->
          @else if (encartes().length === 0) {
            <div class="flex flex-col items-center justify-center p-16 text-center">
              <div class="bg-gray-50 p-4 rounded-full mb-4">
                <mat-icon class="text-gray-400" style="font-size: 48px; width: 48px; height: 48px;">campaign</mat-icon>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Nenhum encarte encontrado</h3>
              <p class="text-gray-500 max-w-md">Você ainda não criou nenhum tabloide de ofertas. Clique no botão acima para montar sua primeira campanha.</p>
            </div>
          } 
          
          <!-- Data Table -->
          @else {
            <div class="overflow-x-auto">
              <table mat-table [dataSource]="encartes()" class="w-full">
                
                <!-- Título Column -->
                <ng-container matColumnDef="titulo">
                  <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700"> Título da Campanha </th>
                  <td mat-cell *matCellDef="let element" class="font-medium text-gray-800"> {{element.titulo || 'Sem Título'}} </td>
                </ng-container>

                <!-- Data Início Column -->
                <ng-container matColumnDef="dataInicio">
                  <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700"> Início </th>
                  <td mat-cell *matCellDef="let element" class="text-gray-600"> {{ (element.dataInicio | date:'dd/MM/yyyy') || '--' }} </td>
                </ng-container>

                <!-- Data Fim Column -->
                <ng-container matColumnDef="dataFim">
                  <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700"> Encerramento </th>
                  <td mat-cell *matCellDef="let element" class="text-gray-600"> {{ (element.dataFim | date:'dd/MM/yyyy') || '--' }} </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700"> Status </th>
                  <td mat-cell *matCellDef="let element">
                    <mat-chip [color]="getStatusColor(element.status)" selected class="font-medium shadow-sm">
                      {{element.status}}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Ações Column -->
                <ng-container matColumnDef="acoes">
                  <th mat-header-cell *matHeaderCellDef class="text-right font-semibold text-gray-700"> Ações </th>
                  <td mat-cell *matCellDef="let element" class="text-right">
                    <button mat-icon-button color="primary" [routerLink]="['/manager/flyers/edit', element.id]" title="Editar Encarte">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" title="Arquivar Encarte" (click)="arquivar(element.id)">
                      <mat-icon>archive</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50/50"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition-colors"></tr>
              </table>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class FlyerListComponent implements OnInit {
  private encarteService = inject(EncarteService);
  private authService = inject(AuthService);
  private supermarketService = inject(SupermarketService);

  public encartes = signal<any[]>([]);
  public loading = signal<boolean>(true);
  public displayedColumns: string[] = ['titulo', 'dataInicio', 'dataFim', 'status', 'acoes'];
  
  private supermercadoId: string | null = null;

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    this.loading.set(true);
    const user = this.authService.user();
    
    if (user && user.id) {
      // Primeiro buscamos a qual supermercado o gestor logado pertence
      this.supermarketService.buscarPorGestor(user.id).subscribe({
        next: (supermercados: any[]) => {
          if (supermercados && supermercados.length > 0) {
            this.supermercadoId = supermercados[0].id;
            this.carregarEncartes(this.supermercadoId!);
          } else {
            this.loading.set(false);
            console.warn('Nenhum supermercado vinculado a este gestor.');
          }
        },
        error: (err) => {
          console.error('Erro ao buscar supermercado do gestor', err);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
  }

  carregarEncartes(supermercadoId: string): void {
    this.loading.set(true);
    this.encarteService.listarEncartes(supermercadoId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data: any) => {
          // Suporta tanto resposta com paginação (Spring Data Page) quanto Array direto
          const lista = data.content !== undefined ? data.content : data;
          this.encartes.set(lista);
        },
        error: (err) => {
          console.error('Erro ao buscar encartes:', err);
        }
      });
  }

  arquivar(id: string): void {
    if (confirm('Tem certeza que deseja arquivar este encarte? Ele não ficará mais visível para os clientes.')) {
      this.encarteService.alterarStatusEncarte(id, 'ARQUIVADO').subscribe({
        next: () => {
          if (this.supermercadoId) {
            this.carregarEncartes(this.supermercadoId); // Recarrega a lista após sucesso
          }
        },
        error: (err) => console.error('Erro ao arquivar encarte', err)
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PUBLICADO': return 'primary';
      case 'RASCUNHO': return 'accent';
      case 'EXPIRADO': return 'warn';
      default: return 'primary'; // Para 'ARQUIVADO' ou outros
    }
  }
}