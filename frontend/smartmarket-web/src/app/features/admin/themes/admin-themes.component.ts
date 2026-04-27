import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminThemesService, SeasonalTheme } from './services/admin-themes.service';

@Component({
  selector: 'app-admin-themes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-themes.component.html'
})
export class AdminThemesComponent implements OnInit {
  private themesService = inject(AdminThemesService);
  
  themes: SeasonalTheme[] = [];
  loading = true;

  ngOnInit() {
    this.themesService.getThemes().subscribe({
      next: (data) => {
        this.themes = data;
        this.loading = false;
      }
    });
  }
}
