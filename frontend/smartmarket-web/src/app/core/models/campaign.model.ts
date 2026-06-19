export interface CampaignTarget {
  type: 'PRODUCT' | 'FLYER' | 'NONE';
  referenceId: string | null;
  deepLink?: string;
}

export interface Campaign {
  id?: string;
  supermarketId: string;
  title: string;
  message: string;
  radiusMeters: number;
  dailyLimitPerClient: number;
  status: 'ATIVA' | 'PAUSADA' | 'CONCLUIDA' | 'Ativa' | 'Pausada' | 'Concluída';
  target?: CampaignTarget | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignRequest {
  supermarketId: string;
  title: string;
  message: string;
  radiusMeters: number;
  dailyLimitPerClient: number;
  target?: CampaignTarget | null;
}
