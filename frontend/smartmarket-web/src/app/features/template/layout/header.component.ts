import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@core/auth/auth.service';

// Core

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private authService = inject(AuthService);

  public isAuthenticated = computed(() => !!this.authService.user());

  public userName = computed(() => this.authService.user()?.email || 'Usuário');
  public userEmail = computed(() => this.authService.user()?.email || 'email@exemplo.com');

  public userAvatarUrl = computed(() => {
    const name = this.userName().split(' ').join('+');
    // Usando as cores da marca para o avatar
    return `https://ui-avatars.com/api/?name=${name}&background=15803d&color=fff&bold=true`;
  });

  public onLogout(): void {
    this.authService.logout();
  }
}