import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Theme {
  id: string;
  name: string;
  occasion: string;
  colorHex: string;
  status: 'Ativo' | 'Inativo' | 'Rascunho';
  backgroundUrl: string;
}

@Component({
  selector: 'app-theme-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './theme-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeListComponent {
  // Mock do Banco de Dados de Temas Sazonais
  public themes = signal<Theme[]>([
    { id: 'T001', name: 'Especial de Natal', occasion: 'Natal', colorHex: '#dc2626', status: 'Ativo', backgroundUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&h=200&fit=crop' },
    { id: 'T002', name: 'Black Friday Arrasadora', occasion: 'Black Friday', colorHex: '#111827', status: 'Ativo', backgroundUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop' },
    { id: 'T003', name: 'Festival de Inverno', occasion: 'Inverno', colorHex: '#0284c7', status: 'Ativo', backgroundUrl: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?w=400&h=200&fit=crop' },
    { id: 'T004', name: 'Páscoa Doce', occasion: 'Páscoa', colorHex: '#d946ef', status: 'Inativo', backgroundUrl: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=400&h=200&fit=crop' },
    { id: 'T005', name: 'Aniversário SmartMarket', occasion: 'Aniversário', colorHex: '#ea580c', status: 'Rascunho', backgroundUrl: 'https://images.unsplash.com/photo-1530103862676-de8892b07a11?w=400&h=200&fit=crop' }
  ]);

  // Contadores Reativos
  public totalThemes = signal(this.themes().length);
  public activeThemes = signal(
    this.themes().filter((t) => t.status === 'Ativo').length
  );
}