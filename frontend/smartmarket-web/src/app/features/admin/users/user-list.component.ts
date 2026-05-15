import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

// Services & Models
import { UserService } from '@core/services/user.service';
import { UserResponse } from '@core/models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  // Estados Reativos
  public isLoading = signal(false);
  public users = signal<UserResponse[]>([]);

  // Contadores Reativos para o Topo da Página
  public totalUsers = computed(() => this.users().length);
  public activeManagers = computed(() => 
    this.users().filter((u) => u.role === 'MANAGER' && u.status === 'ACTIVE').length
  );
  public platformClients = computed(() => 
    this.users().filter((u) => u.role === 'CLIENT').length
  );

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  public carregarUsuarios(): void {
    this.isLoading.set(true);
    this.userService.listarTodos().subscribe({
      next: (data) => {
        // Assume que o backend retorna uma lista ou um objeto paginado
        this.users.set(data.content || data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários', err);
        this.isLoading.set(false);
        this.snackBar.open('Erro ao carregar lista de usuários.', 'Fechar', { duration: 3000 });
      }
    });
  }

  public alterarStatus(id: string, novoStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'): void {
    this.userService.alterarStatus(id, novoStatus).subscribe({
      next: () => {
        this.snackBar.open(`Status do usuário alterado com sucesso!`, 'Sucesso', { duration: 2000 });
        this.carregarUsuarios();
      },
      error: (err) => {
        console.error('Erro ao alterar status do usuário', err);
        this.snackBar.open('Erro ao alterar status.', 'Erro', { duration: 3000 });
      }
    });
  }
}