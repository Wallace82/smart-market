import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

// Ajuste o import do model conforme a localização exata no seu projeto
import { SupermarketService } from '../../../core/services/supermarket.service';

@Component({
  selector: 'app-supermarkets-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Gestão de Supermercados</h1>
        <button mat-flat-button color="primary">
          <mat-icon>add</mat-icon> Cadastrar Novo
        </button>
      </div>

      <mat-card>
        <mat-card-content class="p-0">
          
          @if (loading()) {
            <div class="flex justify-center items-center p-10">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table mat-table [dataSource]="supermarkets()" class="w-full">
                
                <!-- Logo Column -->
                <ng-container matColumnDef="logo">
                  <th mat-header-cell *matHeaderCellDef> Logo </th>
                  <td mat-cell *matCellDef="let element">
                    <img [src]="element.urlLogomarca || 'assets/placeholder-logo.png'" alt="Logo" class="w-10 h-10 rounded-full object-cover border">
                  </td>
                </ng-container>

                <!-- Nome Column -->
                <ng-container matColumnDef="nome">
                  <th mat-header-cell *matHeaderCellDef> Nome </th>
                  <td mat-cell *matCellDef="let element"> {{element.nome}} </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef> Status </th>
                  <td mat-cell *matCellDef="let element">
                    <mat-chip [color]="element.status === 'ATIVO' ? 'primary' : 'warn'" selected>
                      {{element.status}}
                    </mat-chip>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
              </table>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class SupermarketsPageComponent implements OnInit {
  private supermarketService = inject(SupermarketService);

  public supermarkets = signal<any[]>([]);
  public loading = signal<boolean>(true);
  public displayedColumns: string[] = ['logo', 'nome', 'status'];

  ngOnInit(): void {
    this.supermarketService.listarTodos(0, 50)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data: any) => this.supermarkets.set(data.content || data),
        error: (err) => console.error('Erro ao buscar supermercados', err)
      });
  }
}