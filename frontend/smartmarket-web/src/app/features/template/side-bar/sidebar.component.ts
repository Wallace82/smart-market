import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

// Core
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private authService = inject(AuthService);

  public isAdmin = computed(() =>
    this.authService.user()?.roles.includes('ROLE_ADMIN')
  );
  public isManager = computed(() =>
    this.authService.user()?.roles.includes('ROLE_GESTOR')
  );
  public isClient = computed(() =>
    this.authService.user()?.roles.includes('ROLE_CLIENTE')
  );
}