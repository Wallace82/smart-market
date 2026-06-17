export interface Campaign {
  id?: string;
  supermercadoId: string;
  nome: string;
  segmento: string;
  raio: string;
  status: 'Ativa' | 'Pausada' | 'Concluída';
  pushesEnviados?: number;
  conversoes?: number;
  criadoEm?: string;
}

export interface CampaignRequest {
  supermercadoId: string;
  nome: string;
  segmento: string;
  raio: string;
  status: 'Ativa' | 'Pausada' | 'Concluída';
}
