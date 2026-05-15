import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicCatalogService } from '@core/services/public-catalog.service';

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
  private catalogService = inject(PublicCatalogService);
  private router = inject(Router);

  cep = signal('');
  radius = this.catalogService.userSelectedRadius;
  
  isLoading = signal(false);
  isSaving = signal(false);
  address = signal<ViaCepResponse | null>(null);

  async searchCep() {
    const cleanCep = this.cep().replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    this.isLoading.set(true);
    this.address.set(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        this.address.set(null);
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
      const formattedAddress = `${currentAddress.logradouro}, ${currentAddress.bairro}, ${currentAddress.localidade} - ${currentAddress.uf}`;
      
      this.catalogService.setManualLocation(currentAddress.cep, formattedAddress);
      this.catalogService.userSelectedRadius.set(Number(this.radius()));
      
      this.isSaving.set(false);
      this.router.navigate(['/']);
    }, 600);
  }
}
