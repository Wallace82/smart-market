import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicCatalogMockService } from '../public-catalog-mock.service';

@Component({
  selector: 'app-public-location',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationComponent implements OnInit {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private catalogService = inject(PublicCatalogMockService);

  cep = signal<string>('');
  address = signal<any>(null);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  radius = signal<number>(3); // Default radius matches service

  // On init, get current radius from service
  ngOnInit() {
    this.radius.set(this.catalogService.userSelectedRadius());
  }

  async searchCep() {
    const cleanCep = this.cep().replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      this.snackBar.open('CEP inválido. Digite 8 números.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading.set(true);
    this.address.set(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        this.snackBar.open('CEP não encontrado.', 'Fechar', { duration: 3000 });
      } else {
        this.address.set(data);
      }
    } catch (error) {
      this.snackBar.open('Erro ao buscar o CEP.', 'Fechar', { duration: 3000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  saveLocation() {
    if (!this.address()) return;

    this.isSaving.set(true);
    
    // Create formatted address string
    const addr = this.address();
    const formattedAddress = `${addr.logradouro}, ${addr.bairro} - ${addr.localidade}/${addr.uf}`;
    
    // Save to service state
    this.catalogService.userSelectedAddress.set(formattedAddress);
    this.catalogService.userSelectedRadius.set(this.radius());

    // Simulating save request
    setTimeout(() => {
      this.isSaving.set(false);
      this.snackBar.open('Localização atualizada com sucesso!', 'Fechar', { duration: 3000 });
      this.router.navigate(['/']);
    }, 1000);
  }
}
