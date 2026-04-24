import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogMockService } from '../public-catalog-mock.service';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationComponent {
  private catalogService = inject(PublicCatalogMockService);
  private router = inject(Router);

  cep = '';
  radius = this.catalogService.userSelectedRadius();
  
  isLoading = signal(false);
  isSaving = signal(false);
  address = signal<ViaCepResponse | null>(null);

  async searchCep() {
    const cleanCep = this.cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    this.isLoading.set(true);
    this.address.set(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        // Tratar erro de CEP não encontrado se necessário
      } else {
        this.address.set(data);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  saveLocation() {
    const currentAddress = this.address();
    if (!currentAddress) return;

    this.isSaving.set(true);
    
    // Simula um pequeno delay para feedback visual
    setTimeout(() => {
      const formattedAddress = `${currentAddress.logradouro}, ${currentAddress.bairro}, ${currentAddress.localidade}`;
      this.catalogService.userSelectedAddress.set(formattedAddress);
      this.catalogService.userSelectedRadius.set(Number(this.radius));
      
      this.isSaving.set(false);
      this.router.navigate(['/']);
    }, 800);
  }
}
