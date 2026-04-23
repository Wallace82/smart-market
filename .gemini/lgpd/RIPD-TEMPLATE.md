# Relatório de Impacto à Proteção de Dados (RIPD) — Template

> Baseado nas orientações da ANPD para o setor público.
> Deve ser preenchido para cada domínio que trata dados sensíveis (Art. 11) ou dados pessoais em larga escala.

## Identificação

- **Sistema**: SGP-PMDF
- **Domínio**: `<nome do domínio>`
- **Responsável pelo preenchimento**: `<nome e cargo>`
- **Data**: `<dd/mm/aaaa>`
- **Versão**: `<1.0>`

## 1. Descrição do tratamento

### 1.1 Finalidade
> Descreva a finalidade específica do tratamento de dados neste domínio.

### 1.2 Dados tratados
| Dado | Tipo (pessoal/sensível) | Obrigatório? |
|---|---|---|
| ... | ... | ... |

### 1.3 Titulares
> Quem são os titulares dos dados? (ex: policiais militares da ativa, inativos, dependentes)

### 1.4 Volume estimado
> Quantidade aproximada de registros e titulares.

### 1.5 Base legal
> Referência ao documento `docs/lgpd/BASE-LEGAL.md`.

## 2. Necessidade e proporcionalidade

### 2.1 Necessidade
> Todos os dados coletados são necessários para a finalidade? Justifique cada dado sensível.

### 2.2 Minimização
> Quais dados foram removidos ou sugeridos para remoção durante a análise de requisitos?

### 2.3 Retenção
> Período de retenção definido em `docs/lgpd/RETENCAO.md`. Justifique.

## 3. Riscos identificados

| Risco | Probabilidade | Impacto | Severidade |
|---|---|---|---|
| Acesso não autorizado a dados sensíveis | ... | ... | ... |
| Vazamento de dados pessoais | ... | ... | ... |
| Uso indevido de dados para finalidade diversa | ... | ... | ... |
| Retenção além do necessário | ... | ... | ... |
| Falta de trilha de auditoria | ... | ... | ... |

### Escala
- Probabilidade: Baixa / Média / Alta
- Impacto: Baixo / Médio / Alto / Crítico
- Severidade: Baixa / Média / Alta / Crítica

## 4. Medidas de mitigação

| Risco | Medida | Status |
|---|---|---|
| Acesso não autorizado | RBAC via Keycloak (roles por domínio) | Implementado |
| Vazamento | Mascaramento de CPF, dados sensíveis restritos | Implementado |
| Uso indevido | Trilha de auditoria (AuditService + AuditAccessDirective) | Implementado |
| Retenção excessiva | Política de expurgo automático | Planejado |
| Falta de auditoria | Interceptor automático + diretiva de view | Implementado |

## 5. Medidas técnicas e organizacionais

### 5.1 Técnicas
- [ ] Autenticação via Keycloak (OIDC/JWT)
- [ ] Autorização por roles (RBAC granular por domínio)
- [ ] Criptografia em trânsito (TLS)
- [ ] Mascaramento de dados sensíveis no frontend
- [ ] Trilha de auditoria automática
- [ ] Session timeout configurado
- [ ] Sem dados sensíveis em localStorage/sessionStorage
- [ ] Sem PII em logs de aplicação

### 5.2 Organizacionais
- [ ] Encarregado de Dados (DPO) designado
- [ ] Treinamento LGPD para a equipe
- [ ] Procedimento de resposta a incidentes
- [ ] Processo de atendimento a direitos do titular

## 6. Parecer

### 6.1 Conclusão
> O tratamento é necessário, proporcional e possui medidas adequadas de mitigação?

### 6.2 Recomendações
> Ações adicionais recomendadas.

### 6.3 Aprovação
| Papel | Nome | Data | Assinatura |
|---|---|---|---|
| Elaborador | ... | ... | ... |
| DPO | ... | ... | ... |
| Autoridade competente | ... | ... | ... |
