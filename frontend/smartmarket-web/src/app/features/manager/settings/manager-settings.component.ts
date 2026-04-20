import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manager-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './manager-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerSettingsComponent {
  // Sinal com os dados fictícios do Supermercado Logado
  public storeData = signal({
    name: 'Supermercado Nova Era',
    cnpj: '12.345.678/0001-90',
    email: 'contato@novaera.com.br',
    phone: '(11) 98765-4321',
    cep: '01234-567',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    logoUrl: 'https://ui-avatars.com/api/?name=Nova+Era&background=16a34a&color=fff&bold=true&size=128',
    latitude: '-23.561414',
    longitude: '-46.655881',
    primaryColor: '#16a34a',
    secondaryColor: '#ea580c',
    branches: [
      { id: '1', name: 'Matriz - Paulista', address: 'Av. Paulista, 1000, São Paulo - SP' },
      { id: '2', name: 'Filial - Pinheiros', address: 'Rua Teodoro Sampaio, 2500, São Paulo - SP' },
      { id: '3', name: 'Filial - Centro', address: 'Rua Direita, 150, São Paulo - SP' }
    ]
  });
}