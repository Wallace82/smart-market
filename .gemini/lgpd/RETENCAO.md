# Política de Retenção de Dados — SGP-PMDF

Define os períodos de retenção e regras de expurgo para dados pessoais tratados pelo SGP-PMDF.

## Princípios

1. **Necessidade**: dados são mantidos apenas pelo tempo necessário para a finalidade
2. **Obrigação legal**: prazos podem ser estendidos por exigência de lei
3. **Segurança jurídica**: manter dados enquanto houver possibilidade de ação judicial/administrativa

## Retenção por domínio

| Domínio | Período de retenção | Marco inicial | Fundamentação |
|---|---|---|---|
| cadastro | Permanente (ativo) / 5 anos após desligamento | Data de desligamento | Estatuto PMDF |
| assentamentos | Permanente (ativo) / 10 anos após desligamento | Data de desligamento | Registro histórico funcional |
| organizacao | Permanente | — | Estrutura organizacional (dado não pessoal) |
| disciplinar | 10 anos após trânsito em julgado | Data do trânsito | Prescrição administrativa |
| promocao | Permanente (ativo) / 5 anos após desligamento | Data de desligamento | Histórico funcional |
| movimentacao | 5 anos após a movimentação | Data da movimentação | Controle administrativo |
| tempo-servico | Permanente (ativo) / 10 anos após aposentadoria | Data da aposentadoria | Cálculos previdenciários |
| afastamento | 5 anos após retorno | Data de retorno ao serviço | Controle funcional |
| aptidao-fisica | 5 anos após o teste | Data do TAF | Registro de aptidão |
| restricao-medica | 10 anos após alta da restrição | Data da alta | Dado de saúde |
| saude | 20 anos | Data do exame/atestado | CFM Resolução 1.821/2007 (prontuário médico) |
| capacitacao | 5 anos após emissão do certificado | Data do certificado | Registro acadêmico |
| pagamento | 10 anos | Data da folha | Obrigação fiscal (CTN Art. 174) e previdenciária |
| classificacao | 5 anos após a classificação | Data da classificação | Registro comportamental |
| escalas | 2 anos | Data da escala | Controle operacional |
| mapa-forca | 2 anos | Data do mapa | Dado agregado, não pessoal |

## Retenção de trilha de auditoria

| Tipo | Período | Justificativa |
|---|---|---|
| Auditoria de domínios sensíveis (saúde, disciplinar, pagamento) | 10 anos | Compatível com retenção dos dados auditados |
| Auditoria de domínios gerais | 5 anos | Padrão institucional |
| Auditoria de acesso ao sistema | 2 anos | Segurança da informação |

## Processo de expurgo

1. **Job mensal**: identifica registros além do período de retenção
2. **Relatório pré-expurgo**: gera contagem por domínio/tipo antes de eliminar
3. **Aprovação**: expurgo de dados sensíveis requer aprovação do DPO
4. **Execução**: exclusão definitiva (não lógica) com registro em log de expurgo
5. **Confirmação**: relatório pós-expurgo arquivado

## Exceções

- **Processos judiciais em andamento**: dados relacionados são retidos até decisão final
- **Solicitação de órgão de controle**: retenção estendida conforme solicitação
- **Investigação interna**: dados preservados durante apuração
