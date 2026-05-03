# 📋 SmartMarket — Documento de Requisitos (MVP)

> **Versão:** 2.0.0
> **Data:** 2026-05-03
> **Status:** MVP — Escopo Validável
> **Equipe:** 3 desenvolvedores

---

## 📑 Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Perfis de Usuário](#2-perfis-de-usuário)
3. [Requisitos Funcionais (MVP)](#3-requisitos-funcionais-mvp)
4. [Requisitos Não Funcionais (MVP)](#4-requisitos-não-funcionais-mvp)
5. [Modelagem de Domínio](#5-modelagem-de-domínio)
6. [Arquitetura Simplificada (Monólito Modular)](#6-arquitetura-simplificada-monólito-modular)
7. [Stack Tecnológica](#7-stack-tecnológica)
8. [Roadmap MVP](#8-roadmap-mvp)
9. [Glossário](#9-glossário)
10. [Diferencial: Canal Físico-Digital (QR Code)](#10-diferencial-canal-físico-digital-qr-code)
11. [Diferencial: Acesso Público sem Fricção (PLG)](#11-diferencial-acesso-público-sem-fricção-plg)
12. [🧾 Backlog (Fase Pós-MVP)](#12--backlog-fase-pós-mvp)

---

## 1. Visão Geral do Produto

### 1.1 Descrição

O **SmartMarket** é uma plataforma SaaS web responsiva do modelo **B2B2C**, que conecta supermercados a seus clientes por meio de encartes digitais, promoções personalizadas e filtros por geolocalização. O sistema opera com um catálogo base unificado de produtos e permite a personalização visual da loja virtual do supermercado (Whitelabel), incluindo temas para encartes sazonais.

### 1.2 Problema que Resolve

| Problema | Impacto |
|---|---|
| Encartes impressos em papel | Desperdício ambiental e custo elevado |
| Dificuldade de divulgação dos supermercados | Perda de clientes e oportunidades |
| Trabalho manual e duplicado no cadastro de produtos | Perda de tempo dos gestores de supermercado |
| Falta de flexibilidade para o cliente final | Dificuldade em montar lista de compras mais barata |
| Descaracterização da marca do supermercado no app | Sensação de distanciamento e falta de confiança pelo cliente |

### 1.3 Proposta de Valor (MVP)

*   **Para CLIENTES:** Visualizar promoções e encartes do supermercado mais próximo de forma rápida e sem fricção.
*   **Para SUPERMERCADOS:** Catálogo de produtos pronto + atração de clientes + **Tabloide Digital Whitelabel com Temas Sazonais**.
*   **Para o NEGÓCIO:** Validar se supermercados veem valor na plataforma e se consumidores adotam o encarte digital.

### 1.4 Hipóteses a Validar no MVP

| # | Hipótese | Métrica de Validação |
|---|---|---|
| H1 | Supermercados veem valor em encartes digitais | Nº de gestores que criam encartes ativamente |
| H2 | Consumidores acessam e navegam nos encartes | Nº de visualizações de encartes e tempo de sessão |
| H3 | A experiência digital substitui o encarte físico | Feedback qualitativo + taxa de retorno de usuários |

### 1.5 Identificação do Produto

| Item | Detalhe |
|---|---|
| **Nome** | SmartMarket |
| **Tipo** | Web Responsiva + APIs REST |
| **Modelo de Negócio** | SaaS B2B2C |
| **Fase Atual** | MVP — Escopo Validável |

---

## 2. Perfis de Usuário e Dashboards

### 2.1 Detalhamento dos Perfis

| Perfil | Descrição | Acesso Principal |
|---|---|---|
| **Admin** (ROLE_ADMIN) | Gestor total da plataforma SmartMarket. Responsável pelo Catálogo Global e pelos **Temas Base**. | Painel administrativo (Backoffice). |
| **Gestor Supermercado** (ROLE_GESTOR) | Responsável pela operação comercial de um supermercado. Adiciona ofertas e cria encartes usando sua marca e **temas**. | Painel do estabelecimento (Dashboard Loja). |
| **Cliente** (Anônimo ou ROLE_CLIENTE) | Consumidor que visualiza promoções e encartes. **Não precisa de login para navegar.** | App web responsivo / Mobile-first. |

### 2.2 Especificação dos Dashboards (MVP)

#### 1. Dashboard Admin (Visão Global)
*   Gestão de Catálogo (CRUD de produtos e categorias).
*   Gestão de Supermercados (Aprovação de novos parceiros).
*   **Gestão de Temas Sazonais:** Criar temas globais (ex: Natal, Black Friday) com backgrounds e cores.

#### 2. Dashboard Gestor Supermercado (Visão da Loja)
*   **Personalização de Loja:** Configuração de Logomarca, Cor Primária e Secundária.
*   Gestão de Ofertas (Selecionar produtos do catálogo e definir preço promocional).
*   **Gestão de Encartes Digitais:** Criar encartes escolhendo um Tema Sazonal e uma lista de Ofertas.
*   **QR Code da Loja:** Visualizar e baixar QR Code que aponta para o encarte ativo.

#### 3. Visão do Cliente (App)
*   Home com supermercados e ofertas filtrados por proximidade.
*   Visualização imersiva do encarte digital (tablóide) com identidade visual da loja.
*   Acesso 100% público — sem login obrigatório.

---

## 3. Requisitos Funcionais (MVP)

### 3.1 RF-01 — Autenticação e Segurança
*   **RF-01.1:** O sistema deve permitir login via E-mail/Senha para Admin e Gestor.
*   **RF-01.2:** Uso de JWT para sessões stateless.
*   **RF-01.3:** O acesso a páginas protegidas (Admin/Gestor) sem autenticação deve redirecionar para login.
*   **RF-01.4:** A vitrine do cliente final (ofertas, produtos e encartes) deve ter **acesso público**, permitindo navegação para usuários logados e anônimos.

### 3.2 RF-02 — Gestão de Supermercados (Whitelabel)
*   **RF-02.1:** O Admin deve poder cadastrar e aprovar supermercados.
*   **RF-02.2:** O Gestor deve poder fazer upload da **Logomarca** (MinIO).
*   **RF-02.3:** O Gestor deve definir a **Paleta de Cores** (Primária e Secundária).
*   **RF-02.4:** O Gestor deve poder configurar as coordenadas geográficas (latitude/longitude) e endereço da loja.

### 3.3 RF-03 — Catálogo de Produtos
*   **RF-03.1:** O Admin mantém o Catálogo Global de Produtos (CRUD com nome, imagem, categoria).
*   **RF-03.2:** Produtos são organizados por categorias (ex: Carnes, Bebidas, Hortifruti).
*   **RF-03.3:** Imagens de produtos são armazenadas no MinIO.

### 3.4 RF-04 — Gestão de Ofertas
*   **RF-04.1:** O Gestor seleciona produtos do Catálogo Global e define o preço promocional para sua loja.
*   **RF-04.2:** Cada oferta possui data de início e fim (validade).
*   **RF-04.3:** O Cliente (logado ou anônimo) visualiza as ofertas ativas de um supermercado.
*   **RF-04.4:** O Cliente pode filtrar ofertas por categoria e faixa de preço.

### 3.5 RF-05 — Encartes Digitais (Tablóide)
*   **RF-05.1:** O Admin cadastra **Temas Sazonais** (background decorativo e cor de fundo).
*   **RF-05.2:** O Gestor cria um **Encarte Digital** associando: um Tema, um título, datas de vigência e uma lista de Ofertas.
*   **RF-05.3:** O sistema gera uma visualização do encarte mesclando Whitelabel da Loja + Tema Sazonal.
*   **RF-05.4:** O Cliente (logado ou anônimo) visualiza o encarte completo de forma imersiva e mobile-first.
*   **RF-05.5:** O encarte possui status: Rascunho, Ativo e Encerrado.

### 3.6 RF-06 — Geolocalização (Simplificada)
*   **RF-06.1:** Ao carregar a vitrine, o app solicita permissão de GPS via prompt nativo do navegador.
*   **RF-06.2:** Se a permissão for concedida, o sistema filtra supermercados e ofertas em um **raio padrão de 3 km**.
*   **RF-06.3:** Se a permissão for negada, o usuário pode informar seu **CEP ou Bairro manualmente** para obter resultados filtrados.
*   **RF-06.4:** A vitrine deve priorizar supermercados mais próximos do usuário.

> **Fora do escopo MVP:** Tracking em background, geofencing, triggers em tempo real, notificações push por proximidade.

### 3.7 RF-07 — QR Code por Loja
*   **RF-07.1:** O painel do Gestor deve exibir um QR Code único e permanente para sua loja, pronto para impressão.
*   **RF-07.2:** O QR Code redireciona para o encarte digital ativo da loja no momento do escaneamento.
*   **RF-07.3:** A página de destino é pública, de carregamento rápido e sem exigência de login.
*   **RF-07.4:** O QR Code deve conter parâmetro de rastreamento (ex: `?utm_source=totem`) para identificar acessos de origem física.

### 3.8 RF-08 — Métricas Básicas (Analytics Essencial)
*   **RF-08.1:** Registrar número de **visualizações por encarte**.
*   **RF-08.2:** Registrar número de **escaneamentos do QR Code** (por parâmetro UTM).
*   **RF-08.3:** Exibir no Dashboard do Gestor: encartes publicados, total de visualizações e acessos via QR Code.

> **Fora do escopo MVP:** Heatmaps, funis de conversão, tracking de sessão anônima, analytics comportamental avançado, footfall attribution.

---

## 4. Requisitos Não Funcionais (MVP)

### 4.1 RNF-01 — Performance
*   Tempo de resposta das APIs < 300ms para 95% das requisições.
*   Carregamento do encarte no mobile em < 3 segundos (conexão 4G).

### 4.2 RNF-02 — Armazenamento de Arquivos (MinIO)
*   `smartmarket-products`: Imagens de produtos.
*   `smartmarket-brands`: Logomarcas dos supermercados.
*   `smartmarket-themes`: Assets decorativos de temas sazonais.

### 4.3 RNF-03 — Segurança
*   Autenticação via JWT com expiração de token configurável.
*   Controle de acesso baseado em roles (ROLE_ADMIN, ROLE_GESTOR).
*   Rotas públicas não exigem autenticação (vitrine, encartes, QR Code).

### 4.4 RNF-04 — Privacidade (LGPD)
*   Exibir modal de aceite de Termos de Uso e Política de Privacidade na criação de conta.
*   No prompt de localização, exibir texto explicativo: *"Usamos sua localização apenas para mostrar as melhores ofertas perto de você."*
*   Não armazenar dados de localização bruta do usuário no MVP.

### 4.5 RNF-05 — Compatibilidade
*   Funcionamento pleno em Chrome e Safari (últimas 2 versões) em iOS e Android.
*   Design mobile-first com responsividade para desktop.

---

## 5. Modelagem de Domínio (MVP)

| Entidade | Atributos Principais |
|---|---|
| **User** | id, email, senha (hash), role, nome |
| **Supermercado** | id, nome, cnpj, status, urlLogomarca, corPrimariaHex, corSecundariaHex, latitude, longitude, endereco |
| **TemaEncarte** | id, nome, urlBackgroundDecorativo, corFundoHex, ativo |
| **Categoria** | id, nome |
| **ProdutoBase** | id, nome, urlImagem, categoriaId |
| **Oferta** | id, supermercadoId, produtoBaseId, preco, dataInicio, dataFim, ativa |
| **EncarteDigital** | id, supermercadoId, temaId, titulo, dataInicio, dataFim, status (RASCUNHO, ATIVO, ENCERRADO) |
| **EncarteOferta** | id, encarteId, ofertaId (tabela associativa) |

---

## 6. Arquitetura Simplificada (Monólito Modular)

### 6.1 Justificativa

Para o MVP com uma equipe de 3 desenvolvedores, a arquitetura de microserviços introduz **complexidade operacional desnecessária** (múltiplos deploys, databases separados, comunicação inter-serviço, service discovery). Um **monólito modular** oferece:

- Desenvolvimento mais ágil e deploys simplificados.
- Separação lógica clara entre domínios (módulos internos).
- Facilidade de refatoração futura para microserviços, se validado.

### 6.2 Estrutura de Módulos

```
smartmarket-api/
├── auth/          → Autenticação, JWT, controle de roles
├── supermarket/   → Cadastro de lojas, Whitelabel, coordenadas
├── catalog/       → Catálogo global de produtos e categorias
├── offer/         → Ofertas por supermercado
├── flyer/         → Encartes digitais e temas sazonais
├── geo/           → Filtro de proximidade (raio simples)
├── analytics/     → Métricas básicas (contadores de views)
└── storage/       → Integração com MinIO (upload de imagens)
```

### 6.3 Banco de Dados

- Um **único banco PostgreSQL** com schemas separados por módulo (quando necessário).
- Migração de schema via **Flyway**.

### 6.4 Diagrama de Alto Nível

```
┌──────────────────────────────────────────────────┐
│                 Frontend Angular                  │
│          (Mobile-First / SPA / Signals)           │
└──────────────────┬───────────────────────────────┘
                   │ HTTP REST (JSON)
┌──────────────────▼───────────────────────────────┐
│              smartmarket-api                       │
│   ┌─────────┬──────────┬────────┬──────────┐     │
│   │  auth   │ catalog  │ offer  │  flyer   │     │
│   ├─────────┼──────────┼────────┼──────────┤     │
│   │ super-  │   geo    │analyt- │ storage  │     │
│   │ market  │          │  ics   │ (MinIO)  │     │
│   └─────────┴──────────┴────────┴──────────┘     │
└──────────────────┬───────────────────────────────┘
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
     PostgreSQL  MinIO    Redis
      (dados)   (imgs)  (cache)
```

---

## 7. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Backend** | Java 21 LTS + Spring Boot 3.4.x |
| **Frontend** | Angular 18+ + Tailwind CSS + Angular Material + Signals |
| **Segurança** | Spring Security + JWT |
| **Banco de Dados** | PostgreSQL 16 (banco único) |
| **Object Storage** | MinIO (compatível com S3) |
| **Cache** | Redis (cache de catálogo e ofertas + dados geoespaciais) |
| **Migração de BD** | Flyway |
| **Containerização** | Docker + Docker Compose |

> **Removido do MVP:** API Gateway dedicado (Spring Cloud Gateway), RabbitMQ, Prometheus/Grafana (observabilidade), arquitetura database-per-service.

---

## 8. Roadmap MVP

| Fase | Escopo | Status |
|---|---|---|
| **Fase 1** | Auth (JWT + Roles) + Cadastro de Supermercados (Whitelabel) | ✅ Concluída |
| **Fase 2** | Catálogo de Produtos + Ofertas + Temas + Encartes Digitais | ✅ Concluída |
| **Fase 3** | Frontend Admin e Gestor (Dashboards) | ✅ Concluída |
| **Fase 4** | Vitrine Pública (Mobile-First) + Geolocalização Simples + QR Code | 🔄 Em andamento |
| **Fase 5** | Métricas Básicas + Polish + Validação com Supermercados Piloto | ⬜ Planejada |

---

## 9. Glossário

*   **Whitelabel:** Capacidade do sistema de assumir a identidade visual do cliente (supermercado).
*   **Sazonal:** Relativo a épocas específicas do ano (Natal, Páscoa, etc).
*   **Encarte Digital:** Tabloide de ofertas visualizado em dispositivos digitais.
*   **MinIO:** Servidor de armazenamento de objetos de alta performance.
*   **PLG (Product-Led Growth):** Estratégia onde o produto é o principal vetor de aquisição de clientes.
*   **Monólito Modular:** Aplicação única com separação lógica interna por módulos de domínio.

---

## 10. Diferencial: Canal Físico-Digital (QR Code)

### 🌱 Visão de Negócio

Esta funcionalidade cria uma ponte entre o ambiente físico do supermercado e a plataforma digital. Um totem ou cartaz na entrada da loja contém um QR Code dinâmico. Ao escanear, o cliente acessa instantaneamente o encarte digital — sem login, sem instalação.

### 10.1 Experiência do Usuário
*   **Interação Instantânea:** Apontar a câmera → abrir o encarte. Sem barreiras.
*   **Navegação Mobile-First:** Visualização otimizada com gestos intuitivos de zoom e scroll.
*   **Acesso Público:** Sem exigência de cadastro ou login (RF-01.4).

### 10.2 Benefício para o Supermercado
*   Substituição do encarte de papel por acesso digital imediato.
*   Posicionamento moderno e ecologicamente consciente.
*   Rastreamento de acessos via parâmetro UTM.

### 10.3 Material de Apoio
*   O SmartMarket deve fornecer ao supermercado um guia básico de identidade visual para criação do totem/cartaz (cores, logo, tipografia).
*   Slogans sugeridos: *"Encarte Digital — Consciência Ambiental"*, *"Aponte, Economize e Ajude o Planeta"*.

---

## 11. Diferencial: Acesso Público sem Fricção (PLG)

### 🎯 Visão de Negócio

O SmartMarket adota a estratégia de *Product-Led Growth*: o usuário percebe valor nos primeiros 5 segundos, sem precisar criar conta. A conversão para usuário logado ocorre de forma orgânica.

### 11.1 Vitrine Universal
*   A página inicial (`/`) exibe imediatamente: Supermercados Próximos, Ofertas em Destaque e Encartes Ativos.
*   Navegação completa sem login: abrir encartes, buscar produtos, usar filtros.

### 11.2 Geolocalização Pública
*   Solicitar permissão de GPS via prompt nativo.
*   Se concedido: filtrar por raio de 3 km.
*   Se negado: exibir campo para CEP/Bairro no header.

### 11.3 UX da Vitrine
*   **Header para anônimos:** Botões claros de "Entrar" e "Criar Conta" no canto superior direito.
*   **Skeleton Screens:** Usar loaders visuais durante carregamento para reter atenção.
*   **Carregamento rápido:** Conteúdo público servido via cache Redis.

### 11.4 Privacidade (LGPD)
*   Texto explicativo claro antes do prompt de localização do OS.
*   Não rastrear nem armazenar localização bruta do usuário no MVP.

---

## 12. 🧾 Backlog (Fase Pós-MVP)

As funcionalidades abaixo foram **documentadas e planejadas**, mas removidas do escopo do MVP para reduzir complexidade e acelerar a validação. Devem ser priorizadas após confirmação das hipóteses H1, H2 e H3.

---

### 🤖 Recommendation Service (IA)
*   Motor de recomendação que cruza geolocalização + perfil de interesses.
*   Tagueamento automático de interesses do usuário baseado em engajamento.
*   Personalização baseada em comportamento anônimo (reordenação de vitrine).
*   Carrossel "Trending na sua Região" com FOMO local.
*   Predição de recompra (AI-Driven) baseada em ciclo de vida do produto.

### 📍 Geofencing e Geolocalização Avançada
*   Captura de localização em background com otimização de bateria.
*   Cálculo de proximidade radial em tempo real (Redis Geospatial avançado).
*   Triggers automáticos de Entry/Exit em zonas de geofencing.
*   Cache por Geohash (agrupamento regional de cache hits).
*   Footfall Attribution (registro de "visita ao supermercado" por proximidade de 20-50m).

### 🔔 Notificações Inteligentes
*   Push Notifications em tempo real ao entrar no raio de um supermercado.
*   Variáveis dinâmicas no texto do push (nome do usuário, nome do supermercado, produto).
*   Deep Links (abrir tela específica do produto/encarte ao clicar no push).
*   Enfileiramento resiliente via RabbitMQ.
*   Frequency Capping (limite de pushes por loja/dia para evitar spam).
*   Fallback para SMS/WhatsApp para usuários VIP com opt-in específico.

### 📊 Analytics Avançado
*   Tracking anônimo com UUID de sessão (Session ID via cookie/localStorage).
*   Funil de conversão: Anônimo → Registrado (identificar qual Soft Gate converte mais).
*   Rastreamento de: taxa de rejeição, tempo no encarte, cliques em produtos, filtros usados.
*   Tempo de permanência em telas e consumo visual de encartes.
*   Mapas de calor (Heatmaps) de onde os usuários abrem o app.
*   Análise comparativa entre canais de aquisição (QR Code vs. orgânico vs. outros).
*   Dashboard de Growth com métricas de engajamento avançado.

### 📈 Campanhas Inteligentes
*   Gestor cria campanhas com regras de segmentação (ex: "usuários que favoritaram carne e estão a 1km").
*   Configuração: Produto/Encarte alvo, Mensagem Customizada, Preço Promocional, Raio de Alcance.
*   Funil da campanha no dashboard: Pushes Enviados → Recebidos → Abertos (CTR).
*   Testes A/B nativos: duas versões de Copy, audiência dividida, vencedor automático.
*   Testes A/B de mensagens no totem QR Code.

### 💳 Billing e Assinatura Automatizada
*   Planos de assinatura dinâmicos (Mensal, Semestral, Anual) com limites configuráveis.
*   Integração com gateway de pagamentos (PIX, Cartão de Crédito, Boleto).
*   Assinatura recorrente com renovação automática.
*   Controle de status: Ativa, Pendente, Cancelada, Expirada.
*   Dashboard Financeiro: receita por período, ranking de planos, churn rate.
*   Bloqueio automático de funcionalidades ao atingir limite do plano.
*   Regras de negócio: downgrade mantém acesso até fim do ciclo pago.
*   Upsell contextual in-app e módulo de add-ons (pacotes avulsos de push).
*   Free Trial de 14 dias.
*   Planos corporativos para redes multi-loja.
*   Conformidade PCI-DSS para dados de cartão.

### 🔗 Integrações Externas
*   Integração com WhatsApp Business API para alertas.
*   Integração com SMS para notificações de alto valor.
*   Login Social (Google, Apple) em 1 clique.
*   CDN Edge Caching para assets públicos.

### ⚡ Infraestrutura Avançada
*   Migração para Microserviços (database-per-service) se escala justificar.
*   API Gateway dedicado (Spring Cloud Gateway).
*   Event-Driven Architecture distribuída via RabbitMQ.
*   Cache multi-layer sofisticado (Frontend → HTTP/CDN → Redis → Event-Driven Invalidation).
*   Observabilidade completa: Prometheus + Grafana + Spring Boot Actuator + OpenTelemetry.
*   Rate Limiting rigoroso em rotas públicas.
*   SLA de 99.95% no endpoint de QR Code.
*   Comunicação síncrona resiliente via OpenFeign + Resilience4j.

### 👤 Funcionalidades de Usuário Final
*   Perfil do consumidor (ROLE_CLIENTE com cadastro completo).
*   Lista de compras (criar, salvar, compartilhar).
*   Favoritar produtos e ofertas (Soft Gate para conversão).
*   Progressive Profiling (dados adicionais solicitados gradualmente).
*   Persistência de dados de conversão ("Seamless Handoff" de lista anônima → logado).
*   Painel de Preferências de Privacidade (opt-in/opt-out de localização e push).

### 🏷️ Funcionalidades de Negócio Adicionais
*   Campanhas específicas via QR Code (ex: "Ofertas de Hortifruti da Terça").
*   Bônus de primeira interação (cupom de desconto no primeiro acesso via totem).
*   Integração com notificações após navegação no encarte (prompt de ativação).
*   Segmentação de usuários por comportamento e perfil.
*   Categorias de interesse (ex: "Churrasco", "Bebês", "Cervejas Artesanais").
*   Relatórios agregados de categorias mais convertidas.

---

> **Nota:** As funcionalidades do backlog estão documentadas nas versões anteriores do REQUIREMENTS.md (v1.7.0) com detalhamento completo de requisitos funcionais, não funcionais e regras de negócio. Este documento deve ser consultado como referência ao iniciar cada fase pós-MVP.
