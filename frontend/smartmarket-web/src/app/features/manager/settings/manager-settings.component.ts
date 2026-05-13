import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SupermarketService } from '../../../core/services/supermarket.service';
import { AuthService } from '../../../core/auth/auth.service';
import { PublicApiService } from '../../../core/services/public-api.service';
import { SupermarketResponse, SupermarketRequest, FilialResponse, FilialRequest } from '../../../core/models/supermarket.model';
import { effect } from '@angular/core';

@Component({
  selector: 'app-manager-settings',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatIconModule, 
    MatButtonModule, 
    MatSnackBarModule
  ],
  templateUrl: './manager-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerSettingsComponent implements OnInit {
  private supermarketService = inject(SupermarketService);
  private authService = inject(AuthService);
  private publicApiService = inject(PublicApiService);
  private snackBar = inject(MatSnackBar);

  public isLoading = signal(false);
  public isSearchingCep = signal(false);
  public isSearchingCnpj = signal(false);
  public supermarketId = signal<string | null>(null);

  // Sinal com os dados do Supermercado
  public storeData = signal({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    cep: '',
    address: '',
    city: '',
    state: 'SP',
    logoUrl: '',
    latitude: 0,
    longitude: 0,
    raioAtuacao: 3000,
    primaryColor: '#16a34a',
    secondaryColor: '#ea580c',
    branches: [] as FilialResponse[]
  });

  // Estados do Brasil
  public brazilianStates = [
    { uf: 'AC', name: 'Acre' }, { uf: 'AL', name: 'Alagoas' }, { uf: 'AP', name: 'Amapá' },
    { uf: 'AM', name: 'Amazonas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' },
    { uf: 'DF', name: 'Distrito Federal' }, { uf: 'ES', name: 'Espírito Santo' }, { uf: 'GO', name: 'Goiás' },
    { uf: 'MA', name: 'Maranhão' }, { uf: 'MT', name: 'Mato Grosso' }, { uf: 'MS', name: 'Mato Grosso do Sul' },
    { uf: 'MG', name: 'Minas Gerais' }, { uf: 'PA', name: 'Pará' }, { uf: 'PB', name: 'Paraíba' },
    { uf: 'PR', name: 'Paraná' }, { uf: 'PE', name: 'Pernambuco' }, { uf: 'PI', name: 'Piauí' },
    { uf: 'RJ', name: 'Rio de Janeiro' }, { uf: 'RN', name: 'Rio Grande do Norte' }, { uf: 'RS', name: 'Rio Grande do Sul' },
    { uf: 'RO', name: 'Rondônia' }, { uf: 'RR', name: 'Roraima' }, { uf: 'SC', name: 'Santa Catarina' },
    { uf: 'SP', name: 'São Paulo' }, { uf: 'SE', name: 'Sergipe' }, { uf: 'TO', name: 'Tocantins' }
  ];

  // Cores predefinidas para a paleta rápida
  public presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#1f2937'
  ];

  constructor() {
    // Efeito reativo: carrega o supermercado assim que o ID do usuário estiver disponível
    effect(() => {
      const user = this.authService.user();
      console.log('ManagerSettingsComponent: Usuário logado detectado:', user);
      if (user?.id) {
        this.loadSupermarket(user.id);
      }
    });
  }

  ngOnInit() {
    // Opcional: Forçar carregamento se o usuário já estiver lá (o effect já cuida disso)
  }

  loadSupermarket(userId?: string) {
    const id = userId || this.authService.user()?.id;
    if (!id) return;

    console.log('ManagerSettingsComponent: Buscando supermercados para o gestor:', id);
    this.isLoading.set(true);
    this.supermarketService.buscarPorGestor(id).subscribe({
      next: (supermarkets) => {
        console.log('ManagerSettingsComponent: Supermercados encontrados:', supermarkets);
        if (supermarkets.length > 0) {
          const sm = supermarkets[0];
          this.supermarketId.set(sm.id);
          this.updateStoreDataFromResponse(sm);
          this.loadBranches(sm.id);
        } else {
          console.warn('ManagerSettingsComponent: Nenhum supermercado vinculado a este gestor.');
          this.snackBar.open('Nenhum supermercado encontrado para sua conta.', 'Fechar', { duration: 5000 });
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('ManagerSettingsComponent: Erro ao carregar supermercado', err);
        this.isLoading.set(false);
        this.snackBar.open('Erro ao carregar dados do supermercado. Verifique a conexão com o backend.', 'Fechar', { duration: 5000 });
      }
    });
  }

  updateStoreDataFromResponse(sm: SupermarketResponse) {
    this.storeData.set({
      name: sm.nomeFantasia,
      cnpj: sm.cnpj,
      email: sm.email || '',
      phone: sm.telefone || '',
      cep: sm.cep || '',
      address: sm.endereco,
      city: sm.cidade || '',
      state: sm.estado || 'SP',
      logoUrl: sm.urlLogomarca || `https://ui-avatars.com/api/?name=${sm.nomeFantasia}&background=16a34a&color=fff&bold=true&size=128`,
      latitude: sm.latitude,
      longitude: sm.longitude,
      raioAtuacao: sm.raioAtuacao,
      primaryColor: sm.corPrimariaHex || '#16a34a',
      secondaryColor: sm.corSecundariaHex || '#ea580c',
      branches: this.storeData().branches
    });
  }

  loadBranches(supermarketId: string) {
    this.supermarketService.listarFiliais(supermarketId).subscribe({
      next: (branches) => {
        this.storeData.update(d => ({ ...d, branches }));
      },
      error: (err) => console.error('Erro ao carregar filiais', err)
    });
  }

  addBranch() {
    const id = this.supermarketId();
    if (!id) return;

    // Simulação simples: abre um prompt ou apenas adiciona um rascunho.
    // Para um sistema real, abriríamos um modal.
    const name = prompt('Nome da Filial:');
    const address = prompt('Endereço:');

    if (name && address) {
      const request: FilialRequest = {
        supermercadoId: id,
        nome: name,
        endereco: address,
        ativo: true
      };

      this.supermarketService.cadastrarFilial(request).subscribe({
        next: (newBranch) => {
          this.storeData.update(d => ({
            ...d,
            branches: [...d.branches, newBranch]
          }));
          this.snackBar.open('Filial adicionada!', 'Fechar', { duration: 3000 });
        },
        error: (err) => this.snackBar.open('Erro ao adicionar filial.', 'Fechar', { duration: 3000 })
      });
    }
  }

  deleteBranch(branchId: string) {
    if (confirm('Tem certeza que deseja excluir esta filial?')) {
      this.supermarketService.deletarFilial(branchId).subscribe({
        next: () => {
          this.storeData.update(d => ({
            ...d,
            branches: d.branches.filter(b => b.id !== branchId)
          }));
          this.snackBar.open('Filial excluída!', 'Fechar', { duration: 3000 });
        },
        error: (err) => this.snackBar.open('Erro ao excluir filial.', 'Fechar', { duration: 3000 })
      });
    }
  }

  saveChanges() {
    const id = this.supermarketId();
    if (!id) {
      this.snackBar.open('Supermercado não identificado.', 'Fechar', { duration: 3000 });
      return;
    }

    const data = this.storeData();
    const request: SupermarketRequest = {
      nomeFantasia: data.name,
      cnpj: data.cnpj,
      endereco: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      raioAtuacao: data.raioAtuacao,
      gestorId: this.authService.user()?.id!,
      corPrimariaHex: data.primaryColor,
      corSecundariaHex: data.secondaryColor,
      urlLogomarca: data.logoUrl,
      email: data.email,
      telefone: data.phone,
      cep: data.cep,
      cidade: data.city,
      estado: data.state
    };

    this.isLoading.set(true);
    this.supermarketService.atualizar(id, request).subscribe({
      next: (res) => {
        this.snackBar.open('Configurações salvas com sucesso!', 'Fechar', { duration: 3000 });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao salvar', err);
        this.snackBar.open('Erro ao salvar configurações.', 'Fechar', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    const id = this.supermarketId();
    if (file && id) {
      this.isLoading.set(true);
      this.supermarketService.uploadLogomarca(id, file).subscribe({
        next: (res) => {
          this.storeData.update(d => ({ ...d, logoUrl: res.urlLogomarca! }));
          this.snackBar.open('Logo atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.isLoading.set(false);
        },
        error: (err) => {
          this.snackBar.open('Erro ao enviar logo.', 'Fechar', { duration: 3000 });
          this.isLoading.set(false);
        }
      });
    }
  }

  updateField(field: string, event: any) {
    let value = event.target.value;
    
    // Converte para número se o campo for numérico
    if (['latitude', 'longitude', 'raioAtuacao'].includes(field)) {
      value = value !== '' ? Number(value) : 0;
    }
    
    this.storeData.update(data => ({ ...data, [field]: value }));
  }


  buscarCep() {
    const cep = this.storeData().cep;
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      this.snackBar.open('Informe um CEP válido com 8 dígitos.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isSearchingCep.set(true);
    this.publicApiService.buscarCep(cep).subscribe({
      next: (res) => {
        if (res.erro) {
          this.snackBar.open('CEP não encontrado.', 'Fechar', { duration: 3000 });
        } else {
          this.storeData.update(data => ({
            ...data,
            address: `${res.logradouro}${res.bairro ? ', ' + res.bairro : ''}`,
            city: res.localidade,
            state: res.uf
          }));
          this.snackBar.open('Endereço atualizado via CEP!', 'Fechar', { duration: 2000 });
        }
        this.isSearchingCep.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao buscar CEP.', 'Fechar', { duration: 3000 });
        this.isSearchingCep.set(false);
      }
    });
  }

  buscarCnpj() {
    const cnpj = this.storeData().cnpj;
    if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) {
      this.snackBar.open('Informe um CNPJ válido com 14 dígitos.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isSearchingCnpj.set(true);
    this.publicApiService.buscarCnpj(cnpj).subscribe({
      next: (res) => {
        console.log('Dados do CNPJ recebidos:', res);
        this.storeData.update(data => ({
          ...data,
          name: res.nome_fantasia || res.razao_social,
          address: `${res.logradouro}, ${res.numero}${res.complemento ? ' - ' + res.complemento : ''}`,
          city: res.municipio,
          state: res.uf,
          cep: res.cep,
          phone: res.ddd_telefone_1 || data.phone,
          email: res.email || data.email
        }));
        this.snackBar.open('Dados da empresa atualizados via CNPJ!', 'Fechar', { duration: 2000 });
        this.isSearchingCnpj.set(false);
      },
      error: (err) => {
        console.error('Erro detalhado na busca de CNPJ:', err);
        this.snackBar.open('Erro ao buscar CNPJ ou CNPJ não encontrado.', 'Fechar', { duration: 3000 });
        this.isSearchingCnpj.set(false);
      }
    });
  }

  updatePrimaryColor(color: string) {

    this.storeData.update(data => ({ ...data, primaryColor: color }));
  }

  updateSecondaryColor(color: string) {
    this.storeData.update(data => ({ ...data, secondaryColor: color }));
  }
}