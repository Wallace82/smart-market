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
}