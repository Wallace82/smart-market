import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Store {
  id: string;
  name: string;
  cnpj: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Ativo' | 'Pendente' | 'Bloqueado';
  joinedAt: string;
  logoUrl: string;
}

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './store-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreListComponent {
  // Informações mockadas simulando um retorno do Banco de Dados
  public stores = signal<Store[]>([
    {
      id: '1', name: 'Supermercado Nova Era', cnpj: '12.345.678/0001-90',
      plan: 'Pro', status: 'Ativo', joinedAt: '10/04/2026',
      logoUrl: 'https://ui-avatars.com/api/?name=Nova+Era&background=16a34a&color=fff&bold=true'
    },
    {
      id: '2', name: 'Mercadão Central', cnpj: '98.765.432/0001-10',
      plan: 'Enterprise', status: 'Ativo', joinedAt: '05/04/2026',
      logoUrl: 'https://ui-avatars.com/api/?name=Mercadao&background=0284c7&color=fff&bold=true'
    },
    {
      id: '3', name: 'Hortifruti Silva', cnpj: '45.678.901/0001-23',
      plan: 'Basic', status: 'Pendente', joinedAt: '18/04/2026',
      logoUrl: 'https://ui-avatars.com/api/?name=Silva&background=ea580c&color=fff&bold=true'
    },
    {
      id: '4', name: 'Atacadista Compre Mais', cnpj: '11.222.333/0001-44',
      plan: 'Pro', status: 'Bloqueado', joinedAt: '01/02/2026',
      logoUrl: 'https://ui-avatars.com/api/?name=Compre+Mais&background=ef4444&color=fff&bold=true'
    },
    {
      id: '5', name: 'Loja do Bairro', cnpj: '55.444.333/0001-99',
      plan: 'Basic', status: 'Ativo', joinedAt: '15/03/2026',
      logoUrl: 'https://ui-avatars.com/api/?name=Loja+Bairro&background=16a34a&color=fff&bold=true'
    },
    {
      id: '6', name: 'Hipermercado Econômico', cnpj: '22.333.444/0001-55',
      plan: 'Enterprise', status: 'Ativo', joinedAt: '20/01/2026',
      logoUrl: 'https://ui-avatars.com/api/?name=Hipermercado&background=0284c7&color=fff&bold=true'
    }
  ]);

  // Sinais para contadores
  public totalStores = signal(this.stores().length);
  public activeStores = signal(this.stores().filter(s => s.status === 'Ativo').length);
}