# LGPD — SGP-PMDF

Documentação de conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018) para o Sistema de Gestão de Pessoal da PMDF.

## Índice

| Documento | Descrição |
|---|---|
| [BASE-LEGAL.md](BASE-LEGAL.md) | Base legal para tratamento de dados por domínio |
| [DIREITOS-TITULAR.md](DIREITOS-TITULAR.md) | Como atender os direitos do titular (Art. 18) |
| [RETENCAO.md](RETENCAO.md) | Política de retenção e expurgo por domínio |
| [RIPD-TEMPLATE.md](RIPD-TEMPLATE.md) | Template de Relatório de Impacto (DPIA/RIPD) |

## Domínios com dados sensíveis (categoria especial — Art. 11)

| Domínio | Tipo de dado sensível |
|---|---|
| **saude** | Dados de saúde ocupacional (exames, atestados, perícias) |
| **restricao-medica** | CID, limitações, laudos médicos |
| **aptidao-fisica** | Resultados TAF, dispensas médicas |
| **disciplinar** | Processos disciplinares, sindicâncias, PADs |

## Domínios com dados pessoais (Art. 7)

| Domínio | Tipo de dado pessoal |
|---|---|
| **cadastro** | CPF, endereço, contatos, dependentes |
| **pagamento** | Vencimentos, descontos, consignações |

## Trilha de auditoria

O SGP-PMDF implementa trilha de auditoria automática para registrar:
- **Quem** acessou (matrícula, unidade — extraídos do JWT)
- **O quê** foi acessado ou alterado (domínio, recurso, ID)
- **Quando** (timestamp do frontend + timestamp do servidor)
- **Como** (IP, user-agent)

Componentes:
- Frontend: `AuditService`, `auditInterceptor`, `AuditAccessDirective`
- Backend API: `POST /api/v1/audit/events`
- Mensageria: RabbitMQ exchange `audit.events`
- Contrato: `docs/contracts/audit/openapi.yaml`

## Referências

- [Lei 13.709/2018 (LGPD)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Guia ANPD — Setor Público](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes)
- Contrato de auditoria: `docs/contracts/audit/`
