export interface Supermarket {
  id: string;
  nomeFantasia: string;
  cnpj: string;
  status: 'PENDENTE' | 'ATIVO' | 'INATIVO';
  endereco: string;
  latitude: number;
  longitude: number;
  raioAtuacao: number;
  gestorId: string;
  urlLogomarca?: string; // Novo campo
  corPrimariaHex?: string; // Novo campo
  corSecundariaHex?: string; // Novo campo
  criadoEm: string;
  atualizadoEm?: string;
}

export interface SupermarketRequest {
  nomeFantasia: string;
  cnpj: string;
  endereco: string;
  latitude: number;
  longitude: number;
  raioAtuacao: number;
  gestorId: string;
  urlLogomarca?: string;
  corPrimariaHex?: string;
  corSecundariaHex?: string;
}

export interface SupermarketResponse {
  id: string;
  nomeFantasia: string;
  cnpj: string;
  status: 'PENDENTE' | 'ATIVO' | 'INATIVO';
  endereco: string;
  latitude: number;
  longitude: number;
  raioAtuacao: number;
  gestorId: string;
  urlLogomarca?: string;
  corPrimariaHex?: string;
  corSecundariaHex?: string;
  criadoEm: string;
  atualizadoEm?: string;
}
