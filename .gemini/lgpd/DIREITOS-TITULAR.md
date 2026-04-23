# Direitos do Titular (LGPD Art. 18) — SGP-PMDF

A LGPD garante direitos aos titulares dos dados. No contexto do SGP-PMDF, os titulares são os policiais militares cujos dados são tratados pelo sistema.

## Direitos e aplicabilidade

| Direito (Art. 18) | Aplicável? | Como atender | Observações |
|---|---|---|---|
| **Confirmação de tratamento** (I) | Sim | Endpoint de consulta de dados por matrícula | O policial pode confirmar que seus dados são tratados |
| **Acesso aos dados** (II) | Sim | Tela "Meus Dados" no portal + export | Cada policial acessa seus próprios dados cadastrais |
| **Correção de dados** (III) | Sim | Formulário de retificação cadastral | Fluxo com aprovação do RH/chefia |
| **Anonimização** (IV) | Não aplicável | — | Dados funcionais nominais são essenciais para o serviço |
| **Bloqueio** (IV) | Parcial | Inativação de registro | Aplicável após desligamento/reforma |
| **Eliminação** (IV) | Não aplicável | — | Regime estatutário exige retenção legal. Dados só são eliminados após período de retenção. |
| **Portabilidade** (V) | Não aplicável | — | Não há transferência para outro controlador no contexto policial militar |
| **Eliminação com consentimento** (VI) | Não aplicável | — | Base legal não é consentimento |
| **Informação sobre compartilhamento** (VII) | Sim | Documentação em `docs/lgpd/` | Informar quais sistemas/órgãos recebem dados |
| **Revogação do consentimento** (VIII) | Não aplicável | — | Base legal não é consentimento |

## Implementação no SGP-PMDF

### Acesso (Meus Dados)
- Cada policial autenticado pode acessar seus dados via portal
- Rota: `/meus-dados` (quando implementada)
- Roles: qualquer policial autenticado para seus próprios dados
- Inclui: cadastro, pagamento (contra-cheque), tempo de serviço, afastamentos

### Retificação
- Fluxo de solicitação de correção cadastral
- Requer aprovação (chefia ou RH)
- Gera trilha de auditoria (antes/depois)

### Informação sobre compartilhamento
Sistemas/órgãos que recebem dados do SGP-PMDF:
- GDF (folha de pagamento)
- Tribunal de Contas (prestação de contas)
- INSS (previdência)
- Justiça Militar (processos disciplinares, quando solicitado)

### Registro de solicitações
- Toda solicitação de exercício de direito deve ser registrada
- Prazo de resposta: 15 dias (Art. 18, §5º)
- Responsável: Encarregado de Dados (DPO) da PMDF

## Justificativa para direitos não aplicáveis

A PMDF, como órgão público de segurança, trata dados com base em **obrigação legal** e **execução de políticas públicas** (Art. 7, II e III). Portanto:

1. **Eliminação**: dados funcionais devem ser mantidos pelo período de retenção legal (vide `RETENCAO.md`)
2. **Portabilidade**: não há cenário de portabilidade no serviço público militar
3. **Revogação de consentimento**: consentimento não é a base legal utilizada
