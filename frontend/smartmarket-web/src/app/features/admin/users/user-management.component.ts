import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: '<h1 class="text-3xl font-bold text-gray-800">Gestão de Usuários</h1><p class="text-gray-500">Página em construção.</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {}