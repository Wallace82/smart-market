export interface SupermarketResponse {
  id: string;
  nome: string;
  nomeFantasia?: string;
  cnpj: string;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  urlLogomarca?: string;
  corPrimariaHex?: string;
  corSecundariaHex?: string;
  // Adicione outros campos conforme necessário
}

export interface SupermarketRequest {
  nome: string;
  nomeFantasia?: string;
  cnpj: string;
  corPrimariaHex?: string;
  corSecundariaHex?: string;
}