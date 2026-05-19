import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Services & Models
import { EncarteService } from '@core/services/encarte.service';
import { TemaEncarteResponse } from '@core/models/encarte.model';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-themes',
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './admin-themes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminThemesComponent implements OnInit {
  private encarteService = inject(EncarteService);
  
  // Estados Reativos
  public themes = signal<TemaEncarteResponse[]>([]);
  public loading = signal(true);

  ngOnInit() {
    this.loadThemes();
  }

  public loadThemes() {
    this.loading.set(true);
    this.encarteService.listarTemas().subscribe({
      next: (data) => {
        this.themes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar temas', err);
        this.loading.set(false);
      }
    });
  }
}
