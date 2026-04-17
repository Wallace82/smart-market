import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';

import { EncarteService } from '@core/services/encarte.service';
import { EncarteDigital } from '@core/models/encarte.model';

@Component({
  selector: 'app-flyer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule, // <-- CORREÇÃO: Módulo importado para resolver o erro NG8001
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './flyer-list.component.html',
  styleUrls: ['./flyer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlyerListComponent implements OnInit {
  private readonly encarteService = inject(EncarteService);

  public flyers$!: Observable<EncarteDigital[]>;

  ngOnInit(): void {
    this.flyers$ = this.encarteService.getEncartesByGestor();
  }

  public deleteFlyer(id: string, event: MouseEvent): void {
    event.stopPropagation(); // Evita acionar outros eventos de clique no card
    // TODO: Adicionar lógica de confirmação (ex: MatDialog) e chamada ao serviço
    console.log(`Solicitada exclusão do encarte com id: ${id}`);
  }
}