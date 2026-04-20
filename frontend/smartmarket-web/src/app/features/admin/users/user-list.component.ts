import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Gestor' | 'Cliente';
  status: 'Ativo' | 'Inativo' | 'Bloqueado';
  lastLogin: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  // Mock do Banco de Dados de Usuários da Plataforma
  public users = signal<User[]>([
    { id: 'U001', name: 'Carlos Silva', email: 'carlos.admin@smartmarket.com', role: 'Administrador', status: 'Ativo', lastLogin: 'Agora mesmo', avatarUrl: 'https://ui-avatars.com/api/?name=Carlos+Silva&background=15803d&color=fff' },
    { id: 'U002', name: 'Mariana Costa', email: 'mariana@novaera.com.br', role: 'Gestor', status: 'Ativo', lastLogin: 'Há 2 horas', avatarUrl: 'https://ui-avatars.com/api/?name=Mariana+Costa&background=0284c7&color=fff' },
    { id: 'U003', name: 'Roberto Alves', email: 'roberto.alves@gmail.com', role: 'Cliente', status: 'Ativo', lastLogin: 'Ontem', avatarUrl: 'https://ui-avatars.com/api/?name=Roberto+Alves&background=f3f4f6&color=4b5563' },
    { id: 'U004', name: 'Fernanda Lima', email: 'fernanda@hortifruti.com', role: 'Gestor', status: 'Inativo', lastLogin: 'Há 5 dias', avatarUrl: 'https://ui-avatars.com/api/?name=Fernanda+Lima&background=0284c7&color=fff' },
    { id: 'U005', name: 'João Mendes', email: 'joao.mendes@email.com', role: 'Cliente', status: 'Bloqueado', lastLogin: 'Há 1 mês', avatarUrl: 'https://ui-avatars.com/api/?name=Joao+Mendes&background=f3f4f6&color=4b5563' },
    { id: 'U006', name: 'Amanda Rocha', email: 'amanda.rocha@hotmail.com', role: 'Cliente', status: 'Ativo', lastLogin: 'Há 15 minutos', avatarUrl: 'https://ui-avatars.com/api/?name=Amanda+Rocha&background=f3f4f6&color=4b5563' }
  ]);

  // Contadores Reativos para o Topo da Página
  public totalUsers = signal(this.users().length);
  public activeManagers = signal(
    this.users().filter((u) => u.role === 'Gestor' && u.status === 'Ativo').length
  );
  public platformClients = signal(
    this.users().filter((u) => u.role === 'Cliente').length
  );
}