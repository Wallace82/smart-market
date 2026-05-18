export interface Plano {
  id: string;
  nome: string;
  limiteOfertasMensais: number;
  limiteEncartesAtivos: number;
  raioAtuacaoKm: number;
  limiteNotificacoesMensais: number;
  possuiConcierge: boolean;
  conciergeUploadsMensais: number | null;
  slaAtendimentoHoras: number;
  prioridadeFila: string;
  precoMensal: number;
  precoSemestral: number;
  precoAnual: number;
}

export type CicloCobranca = 'MENSAL' | 'SEMESTRAL' | 'ANUAL';
export type StatusAssinatura = 'ATIVA' | 'INADIMPLENTE' | 'CANCELADA' | 'AGUARDANDO_PAGAMENTO';

export interface Assinatura {
  id: string;
  supermercadoId: string;
  plano: Plano;
  ciclo: CicloCobranca;
  status: StatusAssinatura;
  dataInicio: string;
  dataFim: string;
  renovacaoAutomatica: boolean;
}

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
