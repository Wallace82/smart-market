import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services & Models
import { EncarteService } from '@core/services/encarte.service';
import { TemaEncarteRequest, TemaEncarteResponse } from '@core/models/encarte.model';

import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-theme-editor',
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  templateUrl: './theme-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private encarteService = inject(EncarteService);
  private notificationService = inject(NotificationService);
  private snackBar = inject(MatSnackBar);

  // Estado Reativo
  public themeId = signal<string | null>(null);
  public theme = signal<Partial<TemaEncarteResponse>>({
    nome: 'Novo Tema Sazonal',
    corFundoHex: '#fdf2f8',
    corDestaqueHex: '#ec4899',
    ativo: true
  });
  
  public loading = signal(false);
  public pendingFile = signal<File | null>(null);
  public previewUrl = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.themeId.set(id);
      this.loadTheme(id);
    }
  }

  private loadTheme(id: string) {
    this.loading.set(true);
    this.encarteService.buscarTemaPorId(id).subscribe({
      next: (data) => {
        this.theme.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar tema', err);
        this.notificationService.error('Não foi possível carregar os dados do tema.');
        this.loading.set(false);
      }
    });
  }

  public updateField(field: keyof TemaEncarteResponse, value: any) {
    this.theme.update(t => ({ ...t, [field]: value }));
  }

  public onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pendingFile.set(file);
      
      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  public saveTheme() {
    const currentTheme = this.theme();
    if (!currentTheme.nome) {
      this.notificationService.warn('O nome do tema é obrigatório para salvar.');
      return;
    }

    this.loading.set(true);
    const request: TemaEncarteRequest = {
      nome: currentTheme.nome!,
      corFundoHex: currentTheme.corFundoHex || '#FFFFFF',
      corDestaqueHex: currentTheme.corDestaqueHex || '#000000',
      ativo: currentTheme.ativo ?? true
    };

    const action = this.themeId() 
      ? this.encarteService.atualizarTema(this.themeId()!, request)
      : this.encarteService.cadastrarTema(request);

    action.subscribe({
      next: (savedTheme) => {
        if (this.pendingFile()) {
          this.uploadBackground(savedTheme.id);
        } else {
          this.notificationService.success('Configurações do tema salvas com sucesso!');
          this.router.navigate(['/admin/themes']);
        }
      },
      error: (err) => {
        console.error('Erro ao salvar tema', err);
        this.notificationService.error('Falha ao salvar as alterações do tema.');
        this.loading.set(false);
      }
    });
  }

  private uploadBackground(id: string) {
    const file = this.pendingFile()!;
    this.encarteService.uploadTemaBackground(id, file).subscribe({
      next: () => {
        this.notificationService.success('Tema e imagem atualizados com sucesso!');
        this.router.navigate(['/admin/themes']);
      },
      error: (err) => {
        console.error('Erro ao subir imagem', err);
        this.notificationService.warn('Dados salvos, mas houve um erro no processamento da imagem.');
        this.router.navigate(['/admin/themes']);
      }
    });
  }
}
