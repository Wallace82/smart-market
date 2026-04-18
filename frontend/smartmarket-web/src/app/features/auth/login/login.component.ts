import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Core Services
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public loading = signal(false);
  public errorMessage = signal<string | null>(null);
  public hidePassword = signal(true);

  public loginForm: FormGroup = this.fb.group({
    email: ['gestor@smartmarket.com', [Validators.required, Validators.email]],
    password: ['password', [Validators.required]],
  });

  public login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        const user = this.authService.user();
        
        if (user?.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        } else if (user?.roles.includes('ROLE_GESTOR')) {
          this.router.navigate(['/manager/dashboard']);
        } else {
          this.router.navigate(['/client/home']); // Mantém para o perfil de cliente
        }
      },
      error: (err) => {
        this.errorMessage.set('E-mail ou senha inválidos. Por favor, tente novamente.');
      }
    });
  }

  public togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hidePassword.set(!this.hidePassword());
  }
}