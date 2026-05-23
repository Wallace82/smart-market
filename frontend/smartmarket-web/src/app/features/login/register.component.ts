import { ChangeDetectionStrategy, Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { SupermarketService } from '@core/services/supermarket.service';

export type AccountType = 'client' | 'supermarket';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.scss'], // Reusing login styles for the split screen layout
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private supermarketService = inject(SupermarketService);

  registerForm: FormGroup;
  accountType = signal<AccountType>('client');
  hidePassword = signal<boolean>(true);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cnpj: [''] // Somente para supermercado
    });

    // Reagir a mudanças no tipo de conta
    effect(() => {
      const type = this.accountType();
      const cnpjControl = this.registerForm.get('cnpj');
      
      if (type === 'supermarket') {
        cnpjControl?.setValidators([Validators.required, Validators.minLength(14)]);
      } else {
        cnpjControl?.clearValidators();
      }
      cnpjControl?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.hidePassword.set(!this.hidePassword());
  }

  setAccountType(type: AccountType) {
    this.accountType.set(type);
    this.registerForm.reset();
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);

    const formValues = this.registerForm.value;
    const type = this.accountType();

    if (type === 'client') {
      this.authService.register({
        nome: formValues.name,
        email: formValues.email,
        senha: formValues.password,
        papel: 'ROLE_CLIENTE'
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Conta criada com sucesso! Redirecionando...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error || 'Erro ao criar conta. Tente novamente.');
        }
      });
    } else {
      this.authService.register({
        nome: formValues.name,
        email: formValues.email,
        senha: formValues.password,
        papel: 'ROLE_GESTOR'
      }).subscribe({
        next: (userRes) => {
          const gestorId = userRes.id;
          
          this.supermarketService.cadastrar({
            nomeFantasia: formValues.name,
            cnpj: formValues.cnpj,
            email: formValues.email,
            gestorId: gestorId
          } as any).subscribe({
            next: () => {
              this.loading.set(false);
              this.successMessage.set('Supermercado registrado com sucesso! Aguardando aprovação do administrador. Redirecionando...');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2500);
            },
            error: (err) => {
              this.loading.set(false);
              this.errorMessage.set(err.error || 'Conta de gestor criada, mas houve um erro ao registrar o supermercado.');
            }
          });
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error || 'Erro ao registrar gestor. Tente novamente.');
        }
      });
    }
  }
}