export interface EncarteDigital {
  id: string;
  supermercadoId: string;
  temaId?: string;
  titulo: string;
  dataInicio: string;
  dataFim: string;
  status: 'ATIVO' | 'INATIVO' | 'RASCUNHO';
  criadoEm: string;
  atualizadoEm: string;
  itens: EncarteItem[];
}

export interface EncarteItem {
  id: string;
  encarteId: string;
  ofertaId: string;
  ordemExibicao: number;
  destaque: boolean;
}