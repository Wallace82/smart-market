# 📋 SmartMarket — Documento de Requisitos

> **Versão:** 4.0.0
> **Data:** 2026-06-18
> **Status:** MVP Entregue + Expansão Pós-MVP em andamento

---

## 📑 Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Perfis de Usuário e Níveis de Acesso](#2-perfis-de-usuário-e-níveis-de-acesso)
3. [Requisitos Funcionais — MVP (Implementado)](#3-requisitos-funcionais--mvp-implementado)
4. [Requisitos Funcionais — Expansão Pós-MVP](#4-requisitos-funcionais--expansão-pós-mvp)
5. [Requisitos Não Funcionais](#5-requisitos-não-funcionais)
6. [Modelagem de Domínio](#6-modelagem-de-domínio)
7. [Arquitetura de Microsserviços](#7-arquitetura-de-microsserviços)
8. [Backlog e Roadmap](#8-backlog-e-roadmap)
9. [Glossário](#9-glossário)

---

## 1. Visão Geral do Produto

O **SmartMarket** é uma plataforma SaaS B2B2C responsiva e mobile-first, que conecta redes de supermercados locais diretamente a seus consumidores regionais através de encartes de ofertas dinâmicos, vitrines interativas baseadas em geolocalização e personalização visual completa (whitelabel) sem nenhuma barreira de cadastro obrigatório para visualização.

O sistema ajuda a combater o desperdício ecológico de impressão de encartes em papel, melhora o tempo de atração de clientes dos gestores de lojas, e fornece uma interface assistida (Concierge) automatizada para entrada veloz de novos encartes.

**Estado atual:** O escopo MVP foi entregue e o sistema está em expansão para o módulo de Billing/Assinatura, Marketing com Push Notifications, Perfil de Cliente e Motor de Recomendação por IA.

---

## 2. Perfis de Usuário e Níveis de Acesso

| Role | Nome | Responsabilidades |
|---|---|---|
| `ROLE_ADMIN` | Administrador Global | Gerencia catálogo de produtos da plataforma, aprova estabelecimentos, cria Temas Sazonais, gerencia planos de assinatura e painel financeiro. |
| `ROLE_GESTOR` | Gestor do Supermercado | Atualiza perfil whitelabel da loja, cadastra ofertas vinculadas ao catálogo, gerencia assinatura, executa campanhas de marketing, aprova prévias do Concierge. |
| `ROLE_ATENDENTE` | Atendente Concierge | Processa listagens de ofertas enviadas pelo Gestor (Excel, Imagens, PDFs) e monta encartes em nome da loja conforme SLA do plano. |
| `ROLE_CLIENTE` | Cliente Final (Opcional) | Consumidor local. Acessa encartes e ofertas publicamente sem login. Pode opcionalmente criar uma conta para favoritar produtos e criar listas de compras. |
| **Anônimo** | Visitante | Navegação 100% pública e sem fricção de login para visualizar encartes, ofertas e lojas próximas. |

---

## 3. Requisitos Funcionais — MVP (Implementado)

### 3.1 RF-01 — Segurança e Sessões
- **RF-01.1:** Login com E-mail/Senha (hash BCrypt) para `ROLE_ADMIN`, `ROLE_GESTOR` e `ROLE_ATENDENTE`.
- **RF-01.2:** Emissão e validação de tokens JWT stateless.
- **RF-01.3:** Roteamento público explícito no API Gateway com rotas `/api/v1/public/**` liberadas no Spring Security.
- **RF-01.4 — Acesso Sem Fricção (PLG):** Página inicial, listagem de ofertas, visualização de encarte tabloide e leitura de QR Codes disponíveis publicamente sem necessidade de login.
- **RF-01.5:** Cadastro de conta de cliente final (ROLE_CLIENTE) opcional via fluxo de registro dedicado.

### 3.2 RF-02 — Identidade Visual Whitelabel
- **RF-02.1:** O Gestor configura a Logomarca da loja (bucket `smartmarket-brands` no MinIO).
- **RF-02.2:** O Gestor define Paleta de Cores (hex Primária e Secundária) da loja.
- **RF-02.3:** O Angular injeta variáveis CSS `--color-primary` e `--color-secondary` via diretiva `appWhitelabelTheme` dinamicamente no client-side.
- **RF-02.4:** O Gestor acessa a página de **Identidade Visual** (`/manager/settings/identity`) para configuração completa.

### 3.3 RF-03 — Catálogo de Produtos e Categorias
- **RF-03.1:** O Admin mantém o Catálogo Global de Produtos com CRUD completo e upload de imagens (bucket `smartmarket-products`).
- **RF-03.2:** O Gestor seleciona produtos do Catálogo Global e cria suas ofertas locais com preço promocional e período de vigência.
- **RF-03.3:** O Admin gerencia categorias de produtos vinculadas ao catálogo.

### 3.4 RF-04 — Encartes Digitais (Tabloide)
- **RF-04.1:** O Admin define **Temas Sazonais** (cores decorativas e imagens de background no bucket `smartmarket-themes`), com editor visual dedicado (`/admin/themes/:id/edit`).
- **RF-04.2:** O Gestor monta Encartes digitais escolhendo um Tema e inserindo ofertas vigentes. Máquina de estados: `RASCUNHO` → `ATIVO` → `ENCERRADO`.
- **RF-04.3:** **Preview em tempo real** durante criação do encarte com mockup de smartphone que reflete tema e ofertas selecionadas.
- **RF-04.4:** O Cliente visualiza o tabloide de forma imersiva e mobile-first com layout responsivo de 1 a 4 colunas.

### 3.5 RF-05 — Geolocalização Radial
- **RF-05.1:** O frontend solicita permissão de coordenadas GPS via `navigator.geolocation`.
- **RF-05.2:** Com permissão, o sistema filtra e ordena supermercados num raio padrão de **3 km** via fórmula Haversine no PostgreSQL.
- **RF-05.3:** Sem permissão, o sistema apresenta formulário para o usuário informar **CEP ou Bairro** manualmente.
- **RF-05.4:** Página de **Alterar Localização** acessível publicamente (`/location`).

### 3.6 RF-06 — Fila Inteligente (Operação Concierge)
- **RF-06.1 — Upload de Listagem:** O Gestor faz upload de arquivos de imagem, PDF, Excel ou Word com novos tabloides.
- **RF-06.2 — Score de Prioridade:** A fila é ordenada pelo score calculado a cada minuto:
  $$\text{Score} = (0.4 \times \text{Urgência SLA}) + (0.3 \times \text{Prioridade Plano}) + (0.2 \times \text{Tempo Espera}) - (0.1 \times \text{Complexidade})$$
- **RF-06.3 — Lock Transacional:** Ao iniciar o atendimento, o sistema cria trava atômica vinculando o `atendenteId`, com status `EM_PROCESSAMENTO`, bloqueando captura concorrente.
- **RF-06.4 — Aprovação da Prévia:** O Gestor recebe link exclusivo para inspecionar, editar e aprovar as ofertas geradas pelo Concierge antes da publicação.

### 3.7 RF-07 — Painel Administrativo Global
- **RF-07.1:** Dashboard financeiro do Admin com visão consolidada de receita, assinaturas ativas e churn (`/admin/financeiro`).
- **RF-07.2:** Gestão de supermercados parceiros — listagem, aprovação e monitoramento (`/admin/supermarkets`).
- **RF-07.3:** Gestão de usuários da plataforma (`/admin/users`).
- **RF-07.4:** Gestão de assinaturas ativas por supermercado (`/admin/assinaturas`).

### 3.8 RF-08 — Painel do Gestor
- **RF-08.1:** Dashboard com métricas de desempenho da loja (`/manager/dashboard`).
- **RF-08.2:** Gerenciamento de Ofertas Locais — criar, editar e encerrar (`/manager/offers`).
- **RF-08.3:** Gerenciamento de Encartes Digitais — criar, editar e publicar (`/manager/flyers`).
- **RF-08.4:** Acesso ao painel de Marketing e QR Code (`/manager/marketing`).
- **RF-08.5:** Acesso ao gerenciamento de Campanhas de Push (`/manager/campaigns`).
- **RF-08.6:** Visualização e gestão da assinatura ativa (`/manager/subscription`).

---

## 4. Requisitos Funcionais — Expansão Pós-MVP

> Os módulos abaixo possuem contratos OpenAPI definidos em `docs/openapi/posmvp/` e componentes Angular parcialmente implementados no frontend. A implementação completa do backend ocorrerá após validação das hipóteses de mercado do MVP.

### 4.1 RF-09 — Billing e Planos de Assinatura (`billing-service`)
- **RF-09.1:** Planos de assinatura dinâmicos configurados pelo Admin — Mensal, Semestral e Anual.
- **RF-09.2:** Free Trial configurável por plano (padrão: 14 dias).
- **RF-09.3:** Limites por plano: `maxOffers` (máximo de ofertas), `maxPushNotifications` (pushes mensais), `allowCustomerPreferences` (acesso ao motor de IA).
- **RF-09.4:** Integração com gateway de pagamentos (PIX, Cartão, Boleto).
- **RF-09.5:** Bloqueio automático de funcionalidades premium ao atingir quotas do plano.
- **RF-09.6:** Estados de assinatura: `trialing` → `active` → `pending` → `canceled` / `expired`.
- **RF-09.7:** Página pública de Planos e Preços acessível sem login (`/planos`).
- **RF-09.8:** O Admin gerencia planos pelo painel (`/admin/planos`).

### 4.2 RF-10 — Marketing e Campanhas de Push (`notification-service`)
- **RF-10.1:** O Gestor cria **Campanhas de Push Notification** com raio de disparo configurável (100m até 50km) e limite de pushes por cliente por dia (`dailyLimitPerClient`).
- **RF-10.2 — Vínculo a Produto:** O Gestor pode vincular a campanha a uma **oferta específica** da loja (`target.type = PRODUCT`). Quando vinculado, o texto da notificação inclui automaticamente o nome e o preço promocional do produto, e o push recebido contém um deep link que redireciona o cliente diretamente para a tela da oferta (`/offers/{offerId}`).
- **RF-10.3 — Vínculo a Encarte:** O Gestor pode vincular a campanha a um **encarte ativo** da loja (`target.type = FLYER`). O texto da notificação inclui o título do tabloide e o push redireciona o cliente diretamente para o visualizador do encarte (`/flyer/{flyerId}`).
- **RF-10.4 — Deep Link:** O `deepLink` é gerado automaticamente pelo sistema com base no `target` informado. Campanhas sem vínculo são genéricas e não possuem deep link.
- **RF-10.5 — Validação do Vínculo:** Ao criar a campanha, o sistema valida que o `target.referenceId` existe e está ativo no momento do cadastro. Ofertas expiradas ou encartes com status `ENCERRADO` são rejeitados com erro `400`.
- **RF-10.6 — Deduplicação de Mensagem:** O sistema **nunca envia a mesma mensagem duas vezes para o mesmo cliente dentro de uma mesma campanha**. Antes de cada disparo, é verificado se existe entrega com status `ENVIADA` para o par `(campaignId, clientId, hash_da_mensagem)`. Em caso positivo, a entrega é bloqueada com motivo `DUPLICATE_MESSAGE`.
- **RF-10.7 — Frequency Capping:** o sistema bloqueia automaticamente novos disparos ao atingir o `dailyLimitPerClient` no dia corrente, com bloqueio registrado como `FREQUENCY_CAP_EXCEEDED`.
- **RF-10.8 — Geofencing:** avaliação de disparo de notificação baseada na posição em tempo real do cliente (evento assíncrono, processado via RabbitMQ). A sequência de validações na avaliação é: 1) verificar `consentPush`, 2) verificar frequency cap, 3) verificar deduplicação, 4) efetuar o disparo.
- **RF-10.9:** Painel de campanhas com status `ATIVA` / `PAUSADA` e controle de ativação/pausação.
- **RF-10.10:** Histórico de entregas com filtros por campanha, cliente e status (`PENDENTE`, `ENVIADA`, `FALHA`, `BLOQUEADA`), com campo `blockReason` indicando o motivo (`FREQUENCY_CAP_EXCEEDED`, `DUPLICATE_MESSAGE`, `CONSENT_REVOKED`).
- **RF-10.11:** Fallback de entrega via SMS/WhatsApp (planejado para iteração futura).

### 4.3 RF-11 — Perfil do Cliente Final (`client-service`)
- **RF-11.1:** Cliente autenticado pode visualizar e atualizar seu perfil (nome, data de nascimento).
- **RF-11.2:** Gerenciamento de **Consentimentos LGPD** explícitos: `consentLgpd`, `consentGeo` e `consentPush`.
- **RF-11.3:** **Favoritos:** cliente pode favoritar Produtos e Supermercados para acesso rápido.
- **RF-11.4:** **Lista de Compras:** criação, adição de itens e finalização de listas de compras salvas na conta.
- **RF-11.5:** Registro de visualizações de produtos para alimentar o motor de recomendação.

### 4.4 RF-12 — Motor de Recomendação por IA (`recommendation-service`)
- **RF-12.1:** Recomendações personalizadas por histórico de visualizações (`VIEW_HISTORY`), similaridade de favoritos (`FAVORITE_SIMILARITY`), preferência por categoria (`CATEGORY_PREFERENCE`) e sinais colaborativos (`COLLABORATIVE_SIGNAL`).
- **RF-12.2:** Carrossel "Trending na sua Região" gerado com base no engajamento local.
- **RF-12.3:** Predição de recompra (AI-Driven) para destacar ofertas relevantes.
- **RF-12.4:** Reprocessamento de base de recomendações disponível para Admin via API.
- **RF-12.5:** Acesso restrito a clientes em planos que incluem `allowCustomerPreferences = true`.

---

## 5. Requisitos Não Funcionais

| ID | Requisito | Critério de Aceitação |
|---|---|---|
| **RNF-01** | Performance de Acesso | Carregamento de páginas estáticas e encartes públicos < **3 segundos** em 4G. APIs públicas de catálogo < **300ms** com caching Redis. |
| **RNF-02** | Performance Percebida (LCP) | Largest Contentful Paint < **2 segundos** via Skeleton Screens, lazy loading e build Angular otimizado com Nginx (gzip ativo). |
| **RNF-03** | Armazenamento Dedicado | MinIO com Buckets isolados: `smartmarket-products`, `smartmarket-brands`, `smartmarket-themes`, `smartmarket-concierge`. |
| **RNF-04** | LGPD — Geolocalização | Banner de consentimento explícito. Coordenadas GPS do browser nunca armazenadas em banco de dados. Usadas exclusivamente para filtragem instantânea em sessão. |
| **RNF-05** | LGPD — Push Notification | Push apenas para clientes com `consentPush = true`. Opt-out deve encerrar campanhas ativas em até 24h. |
| **RNF-06** | Segurança | Autenticação JWT stateless com RBAC explícito por role. Zero `@Autowired` em campos no backend (apenas injeção via construtor). |
| **RNF-07** | Qualidade de Código — Frontend | Proibido `*ngIf`, `*ngFor` (usar `@if`, `@for`). Proibido `constructor(private …)` (usar `inject()`). Proibido cores hex hardcoded (usar variáveis CSS / Tailwind). |
| **RNF-08** | Qualidade de Código — Backend | Domínio 100% livre de Spring/JPA. Conversões via MapStruct. OpenAPI obrigatório em todos os controllers. |
| **RNF-09** | CI/CD | Pipeline GitHub Actions com: Build & Test → Build & Push Docker Hub → Deploy to Production via webhooks. |

---

## 6. Modelagem de Domínio

```text
Supermercado (id, nomeFantasia, cnpj, status, latitude, longitude, corPrimariaHex, corSecundariaHex, urlLogomarca)
   │
   ├── 1:N ──> Oferta (id, produtoBaseId, preco, dataInicio, dataFim, ativa)
   │
   ├── 1:N ──> EncarteDigital (id, temaId, titulo, status[RASCUNHO|ATIVO|ENCERRADO], dataInicio, dataFim)
   │
   ├── 1:N ──> SolicitacaoConcierge (id, atendenteId, status, prioridadeScore, slaDefinido, urlArquivoOriginal)
   │
   └── 1:1 ──> Assinatura (id, planoId, status[trialing|active|pending|canceled|expired], startDate, renewalDate)

ProdutoBase (id, nome, descricao, categoriaId, urlImagem)  ← Catálogo Global do Admin

TemasSazonais (id, nome, corPrimaria, corSecundaria, urlBackground) ← Criado pelo Admin

Cliente (id, userId, displayName, consentLgpd, consentGeo, consentPush) ← Pós-MVP
   ├── 1:N ──> Favorito (id, tipo[PRODUCT|SUPERMARKET], referenciaId)
   └── 1:N ──> ListaDeCompras (id, nome, status[ABERTA|FINALIZADA|ARQUIVADA], itens[])

Campanha (id, supermercadoId, titulo, mensagem, radiusMeters, dailyLimitPerClient, status[ATIVA|PAUSADA]) ← Pós-MVP
```

---

## 7. Arquitetura de Microsserviços

O backend é composto por microsserviços autônomos com isolamento de dados via schemas PostgreSQL:

| Serviço | Porta | Escopo | Status |
|---|---|---|---|
| `api-gateway` | 8080 | Reverse proxy, roteamento, CORS central | ✅ MVP |
| `auth-service` | 8081 | JWT, autenticação, RBAC (Admin, Gestor, Atendente, Cliente) | ✅ MVP |
| `supermarket-service` | 8082 | Estabelecimentos, whitelabel, ofertas, encartes, geolocalização | ✅ MVP |
| `product-service` | 8083 | Catálogo global, categorias, temas sazonais | ✅ MVP |
| `billing-service` | 8084 | Planos, assinaturas, quotas, faturamento | 🔄 Pós-MVP |
| `concierge-service` | 8085 | Fila inteligente, locks, upload, aprovação de prévias | ✅ MVP |
| `notification-service` | — | Campanhas de push, geofencing, frequency capping | 🔄 Pós-MVP |
| `client-service` | — | Perfil de cliente, favoritos, listas de compras | 🔄 Pós-MVP |
| `recommendation-service` | — | Motor de recomendação por IA, trending regional | 🔄 Pós-MVP |

### Infraestrutura de Suporte

| Componente | Uso |
|---|---|
| **PostgreSQL 16** | Banco relacional com schemas isolados por domínio |
| **Redis 7** | Caching de catálogo e APIs públicas (TTL configurado por rota) |
| **MinIO** | Object Storage S3-compatible para imagens e uploads |
| **RabbitMQ** | Mensageria assíncrona para notificações e consistência eventual (Pós-MVP) |
| **Nginx Alpine** | Servidor de produção do frontend com gzip e SPA routing |
| **Docker Compose** | Orquestração de containers em ambiente local e produção |

---

## 8. Backlog e Roadmap

### Fase 1–4 (MVP — Concluído ✅)
- [x] Autenticação JWT e RBAC
- [x] Whitelabel dinâmico (cores + logo) via Angular Signals
- [x] Catálogo Global de Produtos e Temas Sazonais
- [x] Encartes Digitais com preview em tempo real
- [x] Geolocalização por Haversine (GPS + CEP manual)
- [x] Fila Inteligente Concierge com score de prioridade e lock transacional
- [x] Painel do Admin (Financeiro, Supermercados, Usuários, Assinaturas, Planos, Temas)
- [x] Painel do Gestor (Dashboard, Ofertas, Encartes, Identidade Visual, Assinatura)
- [x] Página pública de Planos e Preços
- [x] CI/CD com GitHub Actions e deploy via Docker Hub

### Fase 5 — Billing e Monetização (Em andamento 🔄)
- [ ] Implementação completa do `billing-service` no backend
- [ ] Integração de gateway de pagamentos (PIX/Cartão/Boleto)
- [ ] Bloqueio automático de quotas ao atingir limites do plano
- [ ] Free Trial automatizado com transição de status

### Fase 6 — Marketing e Engajamento (Planejado 📋)
- [ ] Implementação do `notification-service` com geofencing via RabbitMQ
- [ ] Frequency Capping automático por cliente e por campanha
- [ ] Fallback SMS/WhatsApp para entregas de notificação

### Fase 7 — Comunidade e Personalização (Planejado 📋)
- [ ] Implementação do `client-service` (perfil, favoritos, listas de compras)
- [ ] Consentimentos LGPD granulares com opt-in/opt-out
- [ ] Motor de Recomendação por IA (`recommendation-service`)
- [ ] Carrossel "Trending na sua Região"
- [ ] Predição de recompra AI-Driven

---

## 9. Glossário

| Termo | Definição |
|---|---|
| **Whitelabel** | Customização visual completa assumindo a identidade de marca do supermercado parceiro. |
| **PLG (Product-Led Growth)** | Metodologia de crescimento centrada na experiência rápida e sem fricção do produto, sem barreira de cadastro para o usuário final. |
| **Haversine** | Fórmula trigonométrica para calcular distâncias radiais entre coordenadas geográficas na superfície terrestre. |
| **Encarte Digital** | Tabloide de varejo interativo e mobile-first que agrupa ofertas ativas de um supermercado sob um tema visual sazonal. |
| **Concierge** | Serviço de assistência operacional onde um Atendente processa listagens físicas (PDFs, imagens, Excel) enviadas pelo Gestor e monta encartes na plataforma. |
| **SLA (Service Level Agreement)** | Prazo máximo de atendimento contratado por plano, usado como fator de urgência no cálculo do score da fila do Concierge. |
| **Geofencing** | Disparo automático de notificação push quando o cliente se aproxima geograficamente de um supermercado com campanha ativa. |
| **Frequency Capping** | Limite máximo de notificações recebidas por um cliente por dia por campanha, evitando spam e respeitando a experiência do usuário. |
| **Database-per-Service** | Padrão de microsserviços onde cada serviço possui isolamento lógico de dados (schema separado no PostgreSQL no MVP). |
