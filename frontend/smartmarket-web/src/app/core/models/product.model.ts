export interface CategoriaResponse {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface MarcaResponse {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface ProductBaseResponse {
  id: string;
  nome: string;
  descricao?: string;
  marca: string;
  marcaId?: string;
  ean: string;
  categoria: string;
  categoriaId: string;
  unidadeMedida?: string;
  pesoVolume?: number;
  urlImagem?: string;
  ativo: boolean;
  criadoEm?: string;
  usoGlobalCount?: number;
}
