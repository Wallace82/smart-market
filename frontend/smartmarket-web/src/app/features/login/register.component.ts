import { ChangeDetectionStrategy, Component, signal, effect } from '@angular/core';
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
  registerForm: FormGroup;
  accountType = signal<AccountType>('client');
  hidePassword = signal<boolean>(true);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(private fb: FormBuilder, private router: Router) {
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

    // Simulando chamada de API
    setTimeout(() => {
      this.loading.set(false);
      this.successMessage.set('Conta criada com sucesso! Redirecionando...');
      
      // Simular redirecionamento
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
      
    }, 1500);
  }
}