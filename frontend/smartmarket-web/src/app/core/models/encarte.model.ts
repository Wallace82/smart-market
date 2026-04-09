export interface TemaEncarte {
  id: string;
  nome: string;
  urlBackgroundDecorativo?: string;
  corFundoHex?: string;
  ativo: boolean;
  criadoEm: string;
}

export interface TemaEncarteRequest {
  nome: string;
  urlBackgroundDecorativo?: string;
  corFundoHex?: string;
  ativo: boolean;
}

export interface TemaEncarteResponse {
  id: string;
  nome: string;
  urlBackgroundDecorativo?: string;
  corFundoHex?: string;
  ativo: boolean;
  criadoEm: string;
}

export interface EncarteItem {
  id?: string;
  ofertaId: string;
  ordemExibicao?: number;
  destaque?: boolean;
}

export interface EncarteDigital {
  id: string;
  supermercadoId: string;
  temaId?: string;
  titulo: string;
  dataInicio: string;
  dataFim: string;
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO' | 'EXPIRADO';
  criadoEm: string;
  atualizadoEm?: string;
  itens?: EncarteItem[];
}

export interface EncarteDigitalRequest {
  supermercadoId: string;
  temaId?: string;
  titulo: string;
  dataInicio: string;
  dataFim: string;
  itens?: EncarteItem[];
}

export interface EncarteDigitalResponse {
  id: string;
  supermercadoId: string;
  temaId?: string;
  titulo: string;
  dataInicio: string;
  dataFim: string;
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO' | 'EXPIRADO';
  criadoEm: string;
  atualizadoEm?: string;
  itens?: EncarteItem[];
}
