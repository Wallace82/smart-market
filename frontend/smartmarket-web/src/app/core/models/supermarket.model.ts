export interface SupermarketResponse {
  id: string;
  nomeFantasia: string;
  cnpj: string;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  endereco: string;
  latitude: number;
  longitude: number;
  raioAtuacao: number;
  gestorId: string;
  urlLogomarca?: string;
  corPrimariaHex?: string;
  corSecundariaHex?: string;
  email?: string;
  telefone?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  criadoEm?: string;
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
  email?: string;
  telefone?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
}

export interface FilialResponse {
  id: string;
  supermercadoId: string;
  nome: string;
  endereco: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  telefone?: string;
  email?: string;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface FilialRequest {
  supermercadoId: string;
  nome: string;
  endereco: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  telefone?: string;
  email?: string;
  ativo: boolean;
}