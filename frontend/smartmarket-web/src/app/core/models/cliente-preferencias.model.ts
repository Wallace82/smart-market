export interface LocalFavorito {
  id: string;
  apelido: string;
  endereco: string;
  cep?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  raioKm: number;
  ativo: boolean;
  criadoEm?: string;
}

export interface LocalFavoritoRequest {
  apelido: string;
  endereco: string;
  cep?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  raioKm?: number;
}

export interface PreferenciaProduto {
  id: string;
  produtoBaseId?: string;
  nomeProduto: string;
  categoriaId?: string;
  categoriaNome?: string;
  marca?: string;
  unidadeMedida?: string;
  urlImagem?: string;
  criadoEm?: string;
}

export interface PreferenciaProdutoRequest {
  produtoBaseId?: string;
  nomeProduto: string;
  categoriaId?: string;
  categoriaNome?: string;
  marca?: string;
  unidadeMedida?: string;
  urlImagem?: string;
}
