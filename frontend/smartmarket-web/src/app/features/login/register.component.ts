import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div class="flex justify-center text-green-600 mb-4">
          <mat-icon class="!w-16 !h-16 !text-[64px]">shopping_basket</mat-icon>
        </div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Crie sua conta grátis
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <a routerLink="/login" class="font-medium text-green-600 hover:text-green-500 transition-colors">
            faça login se já possui uma conta
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-md sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <!-- Mock Alert -->
          <div class="text-center p-4 bg-orange-50 border border-orange-100 rounded-xl mb-6">
            <mat-icon class="!text-orange-500 mb-1">construction</mat-icon>
            <p class="text-sm text-orange-800 font-medium">A criação automatizada de contas está sendo desenvolvida. Em breve você poderá se cadastrar.</p>
          </div>

          <div class="space-y-4">
            <button mat-flat-button class="!w-full !bg-gray-50 !text-gray-700 !py-6 rounded-xl font-bold border border-gray-200 hover:!bg-gray-100 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5 mr-2 inline">
              Continuar com o Google
            </button>
            
            <button mat-flat-button class="!w-full !bg-green-600 !text-white !py-6 rounded-xl font-bold shadow-sm hover:!bg-green-700 transition-colors" routerLink="/">
              Voltar para a Vitrine
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {}