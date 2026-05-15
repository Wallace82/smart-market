export interface ProductBaseResponse {
  id: string;
  nome: string;
  marca: string;
  ean: string;
  categoria: string;
  urlImagem?: string;
  ativo: boolean;
  criadoEm?: string;
  usoGlobalCount?: number;
}

export interface ProductBaseRequest {
  nome: string;
  marca: string;
  ean: string;
  categoria: string;
  urlImagem?: string;
  ativo: boolean;
}
