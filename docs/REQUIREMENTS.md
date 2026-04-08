# 📋 SmartMarket — Documento de Requisitos

> **Versão:** 1.0.0
> **Data:** 2025
> **Status:** Em definição
> **Equipe:** 3 desenvolvedores

---

## 📑 Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Perfis de Usuário](#2-perfis-de-usuário)
3. [Requisitos Funcionais](#3-requisitos-funcionais)
4. [Requisitos Não Funcionais](#4-requisitos-não-funcionais)
5. [Arquitetura](#5-arquitetura)
6. [Stack Tecnológica](#6-stack-tecnológica)
7. [Roadmap Macro](#7-roadmap-macro)
8. [Glossário](#8-glossário)
9. [Modelagem de Domínio](#9-modelagem-de-domínio)
10. [Definição dos Microserviços](#10-definição-dos-microserviços)
11. [Estrutura dos Projetos](#11-estrutura-dos-projetos)

---

## 1. Visão Geral do Produto

### 1.1 Descrição

O **SmartMarket** é uma plataforma SaaS web responsiva do modelo **B2B2C**, que conecta supermercados a seus clientes por meio de encartes digitais, promoções personalizadas e notificações por geolocalização.

### 1.2 Problema que Resolve

| Problema | Impacto |
|---|---|
| Encartes impressos em papel | Desperdício ambiental e custo elevado |
| Dificuldade de divulgação dos supermercados | Perda de clientes e oportunidades |
| Falta de flexibilidade para o cliente final | Dificuldade em montar lista de compras mais barata |
| Desconhecimento de promoções próximas | Experiência de compra pouco otimizada |

### 1.3 Proposta de Valor

Para CLIENTES: Promoções do supermercado mais próximo + recomendações personalizadas
Para SUPERMERCADOS: Canal digital de divulgação + inteligência sobre seus clientes
Para o NEGÓCIO: SaaS com modelo de assinatura por supermercado

### 1.4 Identificação do Produto

| Item | Detalhe |
|---|---|
| **Nome** | SmartMarket |
| **Tipo** | Web Responsiva + APIs REST |
| **Modelo de Negócio** | SaaS B2B2C |
| **Fase Atual** | MVP — Projeto Pessoal / Startup |
| **Escala Esperada** | Milhares de usuários |

---

## 2. Perfis de Usuário

### 2.1 Detalhamento dos Perfis

| Perfil | Descrição | Acesso Principal |
|---|---|---|
| **Admin** | Gestor total da plataforma SmartMarket | Painel administrativo global |
| **Gestor Supermercado** | Responsável por um ou mais supermercados cadastrados | Painel do estabelecimento |
| **Cliente** | Usuário final consumidor das promoções | App web responsivo |

---

## 3. Requisitos Funcionais

### RF-01 — Autenticação e Autorização

| ID | Descrição | Perfil | Prioridade |
|---|---|---|---|
| RF-01.1 | Login com e-mail e senha via JWT | Todos | Alta |
| RF-01.2 | Refresh token com expiração configurável | Todos | Alta |
| RF-01.3 | Controle de acesso por perfil (RBAC) | Todos | Alta |
| RF-01.4 | Recuperação de senha por e-mail | Todos | Alta |
| RF-01.5 | Primeiro acesso com definição de senha | Admin / Gestor | Média |
| RF-01.6 | Bloqueio de conta após tentativas inválidas | Todos | Média |

### RF-02 — Gestão de Supermercados (Admin)

| ID | Descrição | Prioridade |
|---|---|---|
| RF-02.1 | CRUD completo de supermercados | Alta |
| RF-02.2 | Ativação e inativação de supermercados | Alta |
| RF-02.3 | Gestão de planos de assinatura por supermercado | Alta |
| RF-02.4 | Definição de limites por plano (produtos, gestores, publicações) | Média |
| RF-02.5 | Auditoria de ações dos gestores | Média |
| RF-02.6 | Dashboard global com métricas consolidadas de toda a plataforma | Média |
| RF-02.7 | Visualização de logs de acesso por supermercado | Baixa |

### RF-03 — Gestão de Produtos e Promoções (Gestor Supermercado)

| ID | Descrição | Prioridade |
|---|---|---|
| RF-03.1 | CRUD de produtos com imagem, descrição e preço | Alta |
| RF-03.2 | Publicação de promoções com data de início e fim | Alta |
| RF-03.3 | Categorização de produtos | Alta |
| RF-03.4 | Publicação de encarte digital (conjunto de promoções) | Alta |
| RF-03.5 | Histórico de publicações anteriores | Média |
| RF-03.6 | Agendamento de promoções futuras | Média |
| RF-03.7 | Duplicar encarte já publicado para reutilização | Baixa |

### RF-04 — Dashboard do Gestor do Supermercado

| ID | Descrição | Prioridade |
|---|---|---|
| RF-04.1 | Produtos mais visualizados pelos clientes | Alta |
| RF-04.2 | Total de clientes que acessaram o estabelecimento via app | Alta |
| RF-04.3 | Horários de pico de acesso dos clientes | Média |
| RF-04.4 | Taxa de conversão (visualização para lista de compras) | Média |
| RF-04.5 | Crescimento de clientes ao longo do tempo (gráfico) | Média |
| RF-04.6 | Exportação de relatórios em PDF ou Excel | Baixa |

### RF-05 — Push Notifications por Geolocalização

| ID | Descrição | Prioridade |
|---|---|---|
| RF-05.1 | Disparo de push quando cliente se aproxima da loja (geofencing) | Alta |
| RF-05.2 | Mensagens personalizadas por campanha | Alta |
| RF-05.3 | Configuração de raio de proximidade pelo gestor | Média |
| RF-05.4 | Histórico de notificações disparadas | Média |
| RF-05.5 | Opt-in e opt-out de notificações pelo cliente | Alta |
| RF-05.6 | Limite de notificações por dia por cliente | Média |

### RF-06 — Experiência do Cliente

| ID | Descrição | Prioridade |
|---|---|---|
| RF-06.1 | Visualização de promoções do supermercado mais próximo via geoloc. | Alta |
| RF-06.2 | Busca e filtro de produtos por nome e categoria | Alta |
| RF-06.3 | Montagem de lista de compras a partir das promoções | Alta |
| RF-06.4 | Favoritar produtos e supermercados | Média |
| RF-06.5 | Histórico de produtos visualizados | Média |
| RF-06.6 | Comparação de preços entre supermercados próximos | Baixa |
| RF-06.7 | Compartilhar promoção ou lista de compras | Baixa |
| RF-06.8 | Perfil do cliente com preferências e dados pessoais | Alta |

### RF-07 — Recomendação Personalizada

| ID | Descrição | Prioridade |
|---|---|---|
| RF-07.1 | Recomendação baseada no histórico de visualizações do cliente | Alta |
| RF-07.2 | Recomendação baseada em produtos favoritados | Média |
| RF-07.3 | Destaque de promoções de categorias de interesse do cliente | Média |
| RF-07.4 | Clientes que viram isso também viram (filtragem colaborativa) | Baixa |
| RF-07.5 | Score de relevância por produto visualizado | Baixa |

### RF-08 — Gestão de Assinaturas (Admin)

| ID | Descrição | Prioridade |
|---|---|---|
| RF-08.1 | Cadastro de planos de assinatura (Free, Basic, Premium) | Alta |
| RF-08.2 | Controle de vigência e renovação por supermercado | Alta |
| RF-08.3 | Alertas de vencimento de assinatura por e-mail | Média |
| RF-08.4 | Histórico financeiro e de planos por supermercado | Média |
| RF-08.5 | Bloqueio automático de funcionalidades por inadimplência | Média |

---

## 4. Requisitos Não Funcionais

### RNF-01 — Performance

| ID | Descrição |
|---|---|
| RNF-01.1 | Tempo de resposta das APIs menor ou igual a 300ms no percentil 95 |
| RNF-01.2 | Carregamento inicial da página menor ou igual a 2 segundos |
| RNF-01.3 | Suporte a milhares de usuários simultâneos |
| RNF-01.4 | Paginação obrigatória em todas as listagens |
| RNF-01.5 | Cache em consultas de alta frequência (promoções, produtos) |

### RNF-02 — Segurança

| ID | Descrição |
|---|---|
| RNF-02.1 | HTTPS obrigatório em todos os endpoints |
| RNF-02.2 | Senhas armazenadas com BCrypt (salt rounds >= 12) |
| RNF-02.3 | JWT com expiração curta (15min) + Refresh Token (7 dias) |
| RNF-02.4 | Rate limiting por IP e por usuário autenticado |
| RNF-02.5 | Proteção contra SQL Injection, XSS e CSRF |
| RNF-02.6 | LGPD: consentimento explícito para uso de dados de localização |
| RNF-02.7 | Dados sensíveis não expostos em logs |
| RNF-02.8 | Headers de segurança HTTP (HSTS, CSP, X-Frame-Options) |

### RNF-03 — Escalabilidade

| ID | Descrição |
|---|---|
| RNF-03.1 | Arquitetura em microserviços com Docker e Docker Compose |
| RNF-03.2 | Escalabilidade horizontal dos serviços críticos |
| RNF-03.3 | Banco de dados com pool de conexões configurado (HikariCP) |
| RNF-03.4 | Serviços desacoplados via contratos de API versionados |

### RNF-04 — Qualidade e Testes

| ID | Descrição |
|---|---|
| RNF-04.1 | Cobertura mínima de 80% com JUnit 5 |
| RNF-04.2 | Testes de integração para fluxos críticos (auth, promoções, geo) |
| RNF-04.3 | Pipeline CI/CD com etapa de qualidade de código |
| RNF-04.4 | Análise estática com SonarQube ou similar |
| RNF-04.5 | Testes de contrato entre microserviços |

### RNF-05 — Observabilidade

| ID | Descrição |
|---|---|
| RNF-05.1 | Logs estruturados em JSON com níveis INFO, WARN e ERROR |
| RNF-05.2 | Correlation ID / Trace ID em todas as requisições |
| RNF-05.3 | Health check e métricas via Spring Boot Actuator |
| RNF-05.4 | Alertas automáticos para erros críticos em produção |
| RNF-05.5 | Retenção de logs por no mínimo 30 dias |

### RNF-06 — Usabilidade

| ID | Descrição |
|---|---|
| RNF-06.1 | Layout responsivo com abordagem mobile-first |
| RNF-06.2 | Suporte aos principais navegadores (Chrome, Firefox, Safari, Edge) |
| RNF-06.3 | Acessibilidade básica seguindo WCAG 2.1 nível AA |
| RNF-06.4 | Feedback visual claro para ações do usuário (loading, erros, sucesso) |

### RNF-07 — Disponibilidade e Resiliência

| ID | Descrição |
|---|---|
| RNF-07.1 | Uptime mínimo de 99,5% |
| RNF-07.2 | Estratégia de fallback para geolocalização indisponível |
| RNF-07.3 | Retry automático em integrações externas (push, e-mail) |
| RNF-07.4 | Graceful shutdown nos containers Docker |

---

## 5. Arquitetura

### 5.2 Microserviços Planejados

| Serviço | Responsabilidade |
|---|---|
| **auth-service** | Autenticação, autorização, JWT, RBAC |
| **supermarket-service** | CRUD de supermercados, assinaturas, gestão Admin |
| **product-service** | Produtos, promoções, encartes, categorias |
| **client-service** | Perfil do cliente, geolocalização, histórico, lista de compras |
| **notification-service** | Push notifications, geofencing, campanhas |
| **recommendation-service** | Motor de recomendação personalizada |
| **api-gateway** | Roteamento, autenticação centralizada, rate limiting |

### 5.3 Padrões Arquiteturais Adotados

- RESTful APIs com versionamento (/api/v1/...)
- RBAC (Role-Based Access Control) centralizado no auth-service
- Database per Service — cada microserviço com seu schema PostgreSQL
- API Gateway Pattern — ponto único de entrada
- 12-Factor App — configuração via variáveis de ambiente
- Correlation ID — rastreabilidade ponta a ponta

---

## 6. Stack Tecnológica

### 6.1 Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| Java | 21 LTS | Linguagem principal |
| Spring Boot | 3.x | Framework base |
| Spring Security | 6.x | Autenticação e autorização |
| Spring Data JPA | 3.x | Persistência |
| PostgreSQL | 16+ | Banco de dados relacional |
| JUnit 5 | 5.x | Testes unitários e integração |
| Docker | Latest | Containerização |

### 6.2 Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| Angular | 18+ | Framework frontend |
| TypeScript | 5.x | Linguagem |
| Angular Material | 18+ | Componentes de UI |

### 6.3 Infraestrutura e Observabilidade

| Tecnologia | Uso |
|---|---|
| Docker Compose | Orquestração local e staging |
| GitHub Actions | CI/CD |
| SonarQube | Qualidade de código |
| Spring Actuator | Health check e métricas |

---

## 7. Roadmap Macro

FASE 1 — FUNDAÇÃO (MVP Core)
- Autenticação e RBAC
- CRUD de Supermercados (Admin)
- CRUD de Produtos e Promoções (Gestor)
- Visualização de Promoções por Geolocalização (Cliente)

FASE 2 — ENGAJAMENTO
- Lista de Compras
- Push Notifications por Geofencing
- Dashboard do Gestor
- Favoritos e Histórico do Cliente

FASE 3 — INTELIGÊNCIA
- Motor de Recomendação Personalizada
- Dashboard Global Admin
- Gestão de Assinaturas
- Comparação de Preços

FASE 4 — ESCALA
- Performance e Cache
- Relatórios e Exportações
- Otimizações de Observabilidade
- Expansão de Integrações

---

## 8. Glossário

| Termo | Definição |
|---|---|
| **Admin** | Gestor total da plataforma SmartMarket |
| **Gestor** | Responsável por um supermercado cadastrado na plataforma |
| **Cliente** | Usuário final consumidor das promoções |
| **Encarte Digital** | Conjunto de promoções publicadas por um supermercado |
| **Geofencing** | Gatilho acionado quando o usuário entra em um raio geográfico definido |
| **RBAC** | Role-Based Access Control — controle de acesso baseado em papéis |
| **SaaS** | Software as a Service — modelo de negócio por assinatura |
| **B2B2C** | Business to Business to Consumer — vende para empresas que servem consumidores |
| **JWT** | JSON Web Token — padrão de autenticação stateless |
| **MVP** | Minimum Viable Product — versão mínima viável do produto |

---

## 9. Modelagem de Domínio

### 9.1 Entidades de Domínio

| Entidade | Descrição de Negócio | Atributos Principais |
|---|---|---|
| **Usuario** | Representa identidade de acesso na plataforma | id, nome, email, senhaHash, status, ultimoLoginEm |
| **Papel (Role)** | Define permissões por perfil (Admin, Gestor, Cliente) | id, nome, descricao |
| **Supermercado** | Unidade de negócio que publica produtos e promoções | id, nomeFantasia, cnpj, status, endereco, latitude, longitude, raioAtuacao |
| **PlanoAssinatura** | Catálogo de planos comerciais disponíveis | id, nomePlano, precoMensal, limiteProdutos, limiteGestores, limitePublicacoes |
| **AssinaturaSupermercado** | Contrato vigente entre supermercado e plano | id, supermercadoId, planoId, status, inicioVigencia, fimVigencia, renovacaoAutomatica |
| **CategoriaProduto** | Agrupamento lógico dos produtos | id, nome, descricao, ativo |
| **Produto** | Item comercializado por um supermercado | id, supermercadoId, categoriaId, nome, descricao, marca, unidadeMedida, precoBase, ativo |
| **Promocao** | Condição promocional aplicada a um produto | id, produtoId, precoPromocional, dataInicio, dataFim, status, destaque |
| **EncarteDigital** | Publicação de campanha com conjunto de promoções | id, supermercadoId, titulo, descricao, dataPublicacao, dataExpiracao, status |
| **EncarteItem** | Associação entre encarte e promoções publicadas | id, encarteId, promocaoId, ordemExibicao |
| **ClientePerfil** | Dados e preferências do consumidor final | id, usuarioId, nomeExibicao, dataNascimento, consentimentoLgpd, consentimentoGeo |
| **Favorito** | Registro de interesse do cliente em produto/supermercado | id, clienteId, tipoFavorito, referenciaId, criadoEm |
| **ListaCompras** | Lista ativa ou histórica montada pelo cliente | id, clienteId, nome, status, criadoEm |
| **ListaComprasItem** | Itens incluídos na lista de compras | id, listaId, produtoId, quantidade, precoReferencia |
| **HistoricoVisualizacao** | Eventos de navegação usados em analytics e recomendação | id, clienteId, produtoId, supermercadoId, visualizadoEm |
| **NotificacaoCampanha** | Campanha de notificação configurada pelo gestor | id, supermercadoId, titulo, mensagem, raioMetros, limiteDiarioPorCliente, ativa |
| **NotificacaoEntrega** | Registro do envio efetivo de notificação ao cliente | id, campanhaId, clienteId, statusEntrega, enviadoEm, motivoBloqueio |
| **AuditoriaAcao** | Trilhas de auditoria das ações administrativas e gerenciais | id, atorUsuarioId, entidade, entidadeId, acao, metadados, criadoEm |

### 9.2 Relacionamentos (Modelo Conceitual)

- **Usuario 1:N Papel** via associação de acesso (um usuário pode possuir mais de um papel).
- **Supermercado 1:N Usuario (Gestor)** para operação do estabelecimento.
- **PlanoAssinatura 1:N AssinaturaSupermercado** e **Supermercado 1:N AssinaturaSupermercado**.
- **Supermercado 1:N CategoriaProduto**, **Supermercado 1:N Produto**.
- **CategoriaProduto 1:N Produto**.
- **Produto 1:N Promocao** (histórico de promoções por item).
- **Supermercado 1:N EncarteDigital**.
- **EncarteDigital 1:N EncarteItem** e **Promocao 1:N EncarteItem** (resolvendo N:N entre encarte e promoção).
- **Usuario (Cliente) 1:1 ClientePerfil**.
- **ClientePerfil 1:N Favorito**, **ClientePerfil 1:N ListaCompras**, **ClientePerfil 1:N HistoricoVisualizacao**.
- **ListaCompras 1:N ListaComprasItem** e **Produto 1:N ListaComprasItem**.
- **Supermercado 1:N NotificacaoCampanha**.
- **NotificacaoCampanha 1:N NotificacaoEntrega** e **ClientePerfil 1:N NotificacaoEntrega**.
- **Usuario 1:N AuditoriaAcao**.

### 9.3 Regras de Negócio (RN)

| ID | Regra |
|---|---|
| RN-01 | Todo usuário deve possuir ao menos um papel ativo para acessar funcionalidades autenticadas. |
| RN-02 | E-mail de usuário é único globalmente na plataforma. |
| RN-03 | Apenas Admin pode ativar/inativar supermercado e alterar plano de assinatura. |
| RN-04 | Um supermercado inativo não pode publicar novos produtos, promoções ou encartes. |
| RN-05 | Assinatura vencida ou inadimplente bloqueia funcionalidades além dos limites do plano definido. |
| RN-06 | Produto deve pertencer exatamente a um supermercado e a uma categoria ativa. |
| RN-07 | Promoção deve ter `precoPromocional` menor que `precoBase` do produto no momento da publicação. |
| RN-08 | Promoção só pode ficar com status ativa quando `dataInicio <= agora <= dataFim`. |
| RN-09 | Não pode existir sobreposição de promoções ativas do mesmo produto com regras conflitantes. |
| RN-10 | Encarte digital precisa conter pelo menos 1 promoção válida para ser publicado. |
| RN-11 | Cliente só recebe notificação se tiver opt-in de geolocalização e de push ativo. |
| RN-12 | Limite diário de notificações por cliente deve respeitar configuração da campanha. |
| RN-13 | Favoritos não podem duplicar a mesma combinação `cliente + tipo + referência`. |
| RN-14 | Lista de compras finalizada não pode ser alterada; apenas duplicada para nova lista. |
| RN-15 | Todo evento crítico (alteração de preço, publicação, inativação, mudança de plano) deve gerar auditoria. |
| RN-16 | Dados de localização do cliente só podem ser processados com consentimento LGPD explícito e revogável. |
| RN-17 | Recomendação personalizada deve considerar apenas dados de comportamento anonimizados quando aplicável. |

### 9.4 Estados de Entidades Críticas

| Entidade | Estados |
|---|---|
| **Supermercado** | PENDENTE, ATIVO, INATIVO, BLOQUEADO |
| **AssinaturaSupermercado** | TRIAL, ATIVA, SUSPENSA, VENCIDA, CANCELADA |
| **Produto** | ATIVO, INATIVO, ESGOTADO |
| **Promocao** | RASCUNHO, AGENDADA, ATIVA, EXPIRADA, CANCELADA |
| **EncarteDigital** | RASCUNHO, PUBLICADO, EXPIRADO, ARQUIVADO |
| **ListaCompras** | ABERTA, FINALIZADA, ARQUIVADA |
| **NotificacaoEntrega** | PENDENTE, ENVIADA, FALHA, BLOQUEADA |

### 9.5 Fronteiras de Contexto (Bounded Contexts)

| Contexto | Entidades Principais | Serviço Alvo |
|---|---|---|
| **Identidade e Acesso** | Usuario, Papel | auth-service |
| **Comercial Supermercado** | Supermercado, PlanoAssinatura, AssinaturaSupermercado | supermarket-service |
| **Catálogo e Promoções** | CategoriaProduto, Produto, Promocao, EncarteDigital, EncarteItem | product-service |
| **Jornada do Cliente** | ClientePerfil, Favorito, ListaCompras, ListaComprasItem, HistoricoVisualizacao | client-service |
| **Comunicação** | NotificacaoCampanha, NotificacaoEntrega | notification-service |
| **Inteligência** | Eventos de histórico e features de recomendação | recommendation-service |
| **Governança** | AuditoriaAcao | compartilhado por domínio (com ownership no serviço de origem) |

### 9.6 Decisões de Modelagem para o MVP

- Não haverá controle de estoque detalhado no MVP; apenas sinalização de disponibilidade (`ativo`/`esgotado`).
- Comparação de preços entre supermercados usará preço promocional vigente, e na ausência dele, `precoBase`.
- Recomendação personalizada iniciará com regras simples (conteúdo baseado em histórico e favoritos) antes de modelos avançados.
- Geofencing será aplicado por raio configurável por supermercado/campanha, com limite diário obrigatório.
- Auditoria será obrigatória para ações administrativas e publicações comerciais críticas.

---

## 10. Definição dos Microserviços

### 10.1 Princípios de Contrato entre Serviços

- Todos os serviços expõem APIs versionadas em `/api/v1`.
- Autenticação central com JWT validado no `api-gateway` e reenviado por token assinado.
- Comunicação síncrona via REST para consultas operacionais.
- Comunicação assíncrona via eventos para trilhas de auditoria, recomendação e notificações.
- Cada serviço é dono do próprio schema e não acessa banco de outro serviço.
- Erros padronizados no formato: `code`, `message`, `details`, `traceId`, `timestamp`.

### 10.2 auth-service

**Responsabilidades**
- Login, refresh token, recuperação de senha e bloqueio por tentativas inválidas.
- Gestão de usuários e papéis (RBAC).
- Emissão de claims de autorização para Admin, Gestor e Cliente.

**Contratos de API (MVP)**
- `POST /api/v1/auth/login` — autenticar usuário.
- `POST /api/v1/auth/refresh` — renovar access token.
- `POST /api/v1/auth/forgot-password` — iniciar recuperação de senha.
- `POST /api/v1/auth/reset-password` — redefinir senha com token temporário.
- `GET /api/v1/users/{id}` — consultar usuário (uso interno/administrativo).
- `POST /api/v1/users` — criar usuário (admin).
- `PATCH /api/v1/users/{id}/status` — ativar/inativar/bloquear.
- `PUT /api/v1/users/{id}/roles` — atualizar papéis do usuário.

**Eventos Publicados**
- `user.created`
- `user.status.changed`
- `user.login.failed_threshold_reached`

### 10.3 supermarket-service

**Responsabilidades**
- Cadastro e gestão de supermercados.
- Gestão de planos e assinaturas por supermercado.
- Regras de elegibilidade por plano (limites operacionais).

**Contratos de API (MVP)**
- `GET /api/v1/supermarkets` — listar supermercados (admin).
- `POST /api/v1/supermarkets` — criar supermercado.
- `GET /api/v1/supermarkets/{id}` — detalhar supermercado.
- `PATCH /api/v1/supermarkets/{id}/status` — ativar/inativar/bloquear.
- `GET /api/v1/plans` — listar planos.
- `POST /api/v1/plans` — criar plano (admin).
- `POST /api/v1/supermarkets/{id}/subscriptions` — contratar/alterar plano.
- `GET /api/v1/supermarkets/{id}/subscriptions/current` — assinatura vigente.

**Eventos Publicados**
- `supermarket.created`
- `supermarket.status.changed`
- `subscription.changed`
- `subscription.expired`

### 10.4 product-service

**Responsabilidades**
- Gestão de categorias, produtos, promoções e encartes digitais.
- Garantia de consistência temporal das promoções.
- Exposição de catálogo para jornada do cliente.

**Contratos de API (MVP)**
- `GET /api/v1/categories` — listar categorias por supermercado.
- `POST /api/v1/categories` — criar categoria.
- `GET /api/v1/products` — buscar/listar produtos (filtros por nome, categoria, mercado).
- `POST /api/v1/products` — criar produto.
- `PUT /api/v1/products/{id}` — atualizar produto.
- `PATCH /api/v1/products/{id}/status` — ativar/inativar/esgotado.
- `POST /api/v1/promotions` — criar promoção (imediata ou agendada).
- `GET /api/v1/promotions/active` — promoções ativas.
- `POST /api/v1/flyers` — criar encarte digital.
- `POST /api/v1/flyers/{id}/publish` — publicar encarte.
- `POST /api/v1/flyers/{id}/duplicate` — duplicar encarte.

**Eventos Publicados**
- `product.created`
- `product.updated`
- `promotion.created`
- `promotion.activated`
- `promotion.expired`
- `flyer.published`

### 10.5 client-service

**Responsabilidades**
- Gestão de perfil e preferências do cliente (incluindo consentimentos).
- Lista de compras, favoritos e histórico de visualização.
- Consulta de supermercados próximos para experiência mobile/web.

**Contratos de API (MVP)**
- `GET /api/v1/clients/me` — obter perfil do cliente autenticado.
- `PUT /api/v1/clients/me` — atualizar perfil e preferências.
- `PATCH /api/v1/clients/me/consents` — atualizar consentimentos LGPD/geo/push.
- `GET /api/v1/favorites` — listar favoritos.
- `POST /api/v1/favorites` — adicionar favorito.
- `DELETE /api/v1/favorites/{id}` — remover favorito.
- `GET /api/v1/shopping-lists` — listar listas de compras.
- `POST /api/v1/shopping-lists` — criar lista.
- `POST /api/v1/shopping-lists/{id}/items` — adicionar item.
- `PATCH /api/v1/shopping-lists/{id}/finalize` — finalizar lista.
- `POST /api/v1/visualizations` — registrar visualização de produto.
- `GET /api/v1/nearby-supermarkets` — buscar mercados próximos por coordenada.

**Eventos Publicados**
- `client.profile.updated`
- `client.consent.updated`
- `shopping_list.finalized`
- `product.visualized`
- `favorite.added`

### 10.6 notification-service

**Responsabilidades**
- Orquestração de campanhas push e geofencing.
- Controle de opt-in/opt-out e limite diário por cliente.
- Registro de entrega para auditoria e analytics.

**Contratos de API (MVP)**
- `POST /api/v1/campaigns` — criar campanha de notificação.
- `GET /api/v1/campaigns` — listar campanhas por supermercado.
- `PATCH /api/v1/campaigns/{id}/status` — ativar/pausar campanha.
- `POST /api/v1/geofence/evaluate` — avaliar disparo por coordenada/evento.
- `GET /api/v1/notifications/history` — histórico de entregas.

**Eventos Consumidos**
- `client.consent.updated`
- `subscription.expired`
- `promotion.activated`

**Eventos Publicados**
- `notification.sent`
- `notification.blocked`
- `notification.failed`

### 10.7 recommendation-service

**Responsabilidades**
- Geração de recomendações personalizadas por comportamento.
- Cálculo de score por cliente-produto.
- Exposição de recomendações para app e dashboard.

**Contratos de API (MVP)**
- `GET /api/v1/recommendations/me` — recomendações para cliente autenticado.
- `GET /api/v1/recommendations/supermarkets/{id}` — recomendações por supermercado.
- `POST /api/v1/recommendations/rebuild` — reprocessamento de base (admin/job).

**Eventos Consumidos**
- `product.visualized`
- `favorite.added`
- `shopping_list.finalized`
- `promotion.activated`

**Eventos Publicados**
- `recommendation.generated`

### 10.8 api-gateway

**Responsabilidades**
- Roteamento externo único para frontend e integrações.
- Validação de JWT, rate limiting e policies de segurança.
- Propagação de `traceId` e padronização de respostas de erro.

**Contratos Externos**
- `ANY /api/v1/auth/**` -> `auth-service`
- `ANY /api/v1/admin/supermarkets/**` -> `supermarket-service`
- `ANY /api/v1/catalog/**` -> `product-service`
- `ANY /api/v1/client/**` -> `client-service`
- `ANY /api/v1/notifications/**` -> `notification-service`
- `ANY /api/v1/recommendations/**` -> `recommendation-service`

### 10.9 Contratos de Integração (Cross-Service)

| Origem | Destino | Tipo | Objetivo |
|---|---|---|---|
| api-gateway | auth-service | REST | autenticação e autorização |
| product-service | supermarket-service | REST | validar status e limites do supermercado |
| client-service | product-service | REST | consultar catálogo e promoções |
| notification-service | client-service | REST | validar consentimentos e dados mínimos do cliente |
| recommendation-service | product-service | REST | enriquecer recomendações com dados de produto |
| Todos | recommendation-service | Evento | alimentar trilhas comportamentais |
| Todos | observabilidade/auditoria | Evento | rastreabilidade e governança |

### 10.10 Regras de Versionamento e Compatibilidade

- Toda mudança breaking exige nova versão de API (`/api/v2`) ou endpoint paralelo.
- Eventos devem incluir `eventId`, `eventType`, `occurredAt`, `producer`, `schemaVersion`.
- Consumidores devem ser tolerantes a campos adicionais (forward compatibility).
- Depreciação de endpoint exige janela mínima de 90 dias e comunicação prévia.

### 10.11 Artefatos OpenAPI do MVP

- `docs/openapi/auth-service.openapi.yaml`
- `docs/openapi/product-service.openapi.yaml`
- `docs/openapi/supermarket-service.openapi.yaml`
- `docs/openapi/client-service.openapi.yaml`
- `docs/openapi/notification-service.openapi.yaml`
- `docs/openapi/recommendation-service.openapi.yaml`
- Conjunto OpenAPI do MVP concluído para os microserviços planejados.

---

## 11. Estrutura dos Projetos

### 11.1 Organização Geral do Workspace

```text
smartmarket/
├── backend/
│   ├── services/
│   │   ├── auth-service/
│   │   ├── supermarket-service/
│   │   ├── product-service/
│   │   ├── client-service/
│   │   ├── notification-service/
│   │   └── recommendation-service/
│   ├── api-gateway/
│   ├── shared/
│   │   ├── observability/
│   │   ├── security/
│   │   └── test-support/
│   └── build/
├── frontend/
│   └── smartmarket-web/
├── infra/
│   ├── docker/
│   ├── compose/
│   ├── k8s/ (futuro)
│   └── scripts/
└── docs/
    ├── architecture/
    ├── openapi/
    └── REQUIREMENTS.md
```

### 11.2 Padrão de Pastas por Microserviço Spring Boot

```text
<service-name>/
├── src/
│   ├── main/
│   │   ├── java/com/smartmarket/<service>/
│   │   │   ├── config/              # Configuracoes de beans e framework
│   │   │   ├── domain/              # Entidades e regras de negocio puras
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   ├── application/         # Casos de uso (orquestracao)
│   │   │   │   ├── usecase/
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   ├── infrastructure/      # Adaptadores externos
│   │   │   │   ├── persistence/
│   │   │   │   ├── web/
│   │   │   │   ├── messaging/
│   │   │   │   └── clients/
│   │   │   └── shared/
│   │   │       ├── exception/
│   │   │       └── util/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-local.yml
│   │       ├── db/migration/
│   │       └── openapi/
│   └── test/
│       ├── java/com/smartmarket/<service>/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── contract/
│       └── resources/
├── pom.xml
└── Dockerfile
```

### 11.3 Convenções Backend (Spring Boot)

- `domain` não depende de `infrastructure`.
- Controllers REST ficam em `infrastructure/web` e chamam apenas casos de uso em `application`.
- Repositórios JPA ficam em `infrastructure/persistence` com interfaces de porta no `domain`.
- Clientes HTTP para outros serviços ficam em `infrastructure/clients` (Feign/WebClient).
- Migrações de banco versionadas em `resources/db/migration` (Flyway).
- Testes divididos em `unit`, `integration` e `contract` para aderência aos RNFs.

### 11.4 Estrutura do Frontend Angular (smartmarket-web)

```text
smartmarket-web/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services, guards, interceptors
│   │   │   ├── auth/
│   │   │   ├── http/
│   │   │   ├── layout/
│   │   │   └── state/
│   │   ├── shared/                  # Componentes, pipes, diretivas reutilizaveis
│   │   │   ├── ui/
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   │   ├── supermarkets/
│   │   │   │   └── subscriptions/
│   │   │   ├── manager/
│   │   │   │   ├── products/
│   │   │   │   ├── promotions/
│   │   │   │   └── flyers/
│   │   │   └── client/
│   │   │       ├── home/
│   │   │       ├── nearby/
│   │   │       ├── favorites/
│   │   │       └── shopping-list/
│   │   └── app.routes.ts
│   ├── assets/
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
├── angular.json
├── package.json
└── Dockerfile
```

### 11.5 Convenções Frontend (Angular)

- `core` para serviços globais (auth, interceptors, guards, config).
- `shared` para itens reutilizáveis sem regra de negócio específica.
- `features` organizadas por domínio de negócio (Admin, Gestor, Cliente).
- Cada feature com estrutura interna mínima: `pages`, `components`, `services`, `models`.
- Integrações HTTP por domínio em serviços dedicados, evitando chamadas diretas em componentes.
- Controle de estado incremental: iniciar com Signals/RxJS por feature; avaliar NgRx quando necessário.

### 11.6 Estrutura de Configuração e Infra

- `infra/compose/` com `docker-compose.local.yml` para subir banco e serviços do MVP.
- `infra/docker/` com templates base de imagem para backend e frontend.
- `infra/scripts/` com scripts de bootstrap (dev), migração e seed.
- Arquivos `.env` por contexto (`backend/.env`, `frontend/.env`) sem versionar segredos.
- Padronizar portas por serviço para facilitar observabilidade local e troubleshooting.

### 11.7 Estratégia de Monorepo

- Repositório único para MVP (backend + frontend + infra + docs).
- Versionamento por tags de release globais e versionamento de API por serviço.
- Pipeline CI dividido por caminho alterado (backend, frontend, docs, infra) para otimizar tempo.
- Gate de qualidade mínimo por PR: lint, testes unitários, testes de contrato e validação OpenAPI.

### 11.8 Checklist de Adoção Inicial

- Criar esqueleto dos seis microserviços em `backend/services/`.
- Criar `api-gateway` com roteamento para `/api/v1/*`.
- Publicar OpenAPI de cada serviço em endpoint `/v3/api-docs` (interno) e sincronizar com `docs/openapi/`.
- Criar app Angular `smartmarket-web` com módulos de `core`, `shared` e `features`.
- Subir ambiente local com PostgreSQL + serviços essenciais via Docker Compose.

---

*Documento gerado e mantido pela equipe SmartMarket.*
*Última atualização: 2026*
