export interface FinancialSummaryResponse {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptionsCount: number;
  churnRate: number;
}

export interface SubscriptionResponse {
  id: string;
  supermercadoNome: string;
  planoNome: string;
  status: 'ACTIVE' | 'TRIALING' | 'PENDING' | 'CANCELED';
  valor: number;
  proximaRenovacao: string;
}
