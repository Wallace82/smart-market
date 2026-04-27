import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './theme-editor.component.html'
})
export class ThemeEditorComponent implements OnInit {
  // Estado Reativo
  themeId = signal<string | null>(null);
  themeName = signal('Novo Tema Sazonal');
  primaryColor = signal('#ec4899');
  secondaryColor = signal('#fdf2f8');
  fontFamily = signal('Inter');
  
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.themeId.set(this.route.snapshot.paramMap.get('id'));
    
    // Inicialização Mockada dependendo do ID
    if (this.themeId() === 'T001') {
      this.themeName.set('Dia das Mães 2026');
      this.primaryColor.set('#ec4899');
      this.secondaryColor.set('#fdf2f8');
    } else if (this.themeId() === 'T002') {
      this.themeName.set('Festa Junina 2026');
      this.primaryColor.set('#f97316');
      this.secondaryColor.set('#fff7ed');
    } else if (this.themeId() === 'T003') {
      this.themeName.set('Black Friday 2026');
      this.primaryColor.set('#1f2937');
      this.secondaryColor.set('#f3f4f6');
    }
  }

  saveTheme() {
    // Fake submit
    alert('Tema visual salvo e processado com sucesso!');
    this.router.navigate(['/admin/themes']);
  }
}
