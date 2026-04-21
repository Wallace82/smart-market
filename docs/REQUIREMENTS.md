﻿﻿﻿# 📋 SmartMarket — Documento de Requisitos

> **Versão:** 1.6.0
> **Data:** 2025-07-29
> **Status:** MVP - Backend & Frontend Implementados
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
12. [Diferencial Estratégico: Marketing Inteligente por Proximidade](#12-diferencial-estratégico-marketing-inteligente-por-proximidade)
13. [Diferencial Estratégico: Canal de Aquisição Físico-Digital (Totem QR Code)](#13-diferencial-estratégico-canal-de-aquisição-físico-digital-totem-qr-code)
14. [Diferencial Estratégico: Acesso Público e Experiência sem Fricção (Product-Led Growth)](#14-diferencial-estratégico-acesso-público-e-experiência-sem-fricção-product-led-growth)
15. [Estratégia de Cache em Múltiplas Camadas (Alta Performance)](#15-estratégia-de-cache-em-múltiplas-camadas-alta-performance)

---

## 1. Visão Geral do Produto

### 1.1 Descrição

O **SmartMarket** é uma plataforma SaaS web responsiva do modelo **B2B2C**, que conecta supermercados a seus clientes por meio de encartes digitais, promoções personalizadas e notificações por geolocalização. O sistema opera com um catálogo base unificado de produtos e permite a personalização visual da loja virtual do supermercado, incluindo temas para encartes sazonais.

### 1.2 Problema que Resolve

| Problema | Impacto |
|---|---|
| Encartes impressos em papel | Desperdício ambiental e custo elevado |
| Dificuldade de divulgação dos supermercados | Perda de clientes e oportunidades |
| Trabalho manual e duplicado no cadastro de produtos | Perda de tempo dos gestores de supermercado |
| Falta de flexibilidade para o cliente final | Dificuldade em montar lista de compras mais barata |
| Descaracterização da marca do supermercado no app | Sensação de distanciamento e falta de confiança pelo cliente |
| Baixo engajamento em datas comemorativas | Dificuldade em criar campanhas temáticas rapidamente |

### 1.3 Proposta de Valor

*   **Para CLIENTES:** Promoções do supermercado mais próximo + recomendações personalizadas.
*   **Para SUPERMERCADOS:** Catálogo de produtos pronto + atração de clientes + **Tabloide Digital Temático e Whitelabel (Identidade Visual Própria e Temas Sazonais)**.
*   **Para o NEGÓCIO:** SaaS com modelo de assinatura por supermercado + catálogo padronizado e limpo.

### 1.4 Identificação do Produto

| Item | Detalhe |
|---|---|
| **Nome** | SmartMarket |
| **Tipo** | Web Responsiva + APIs REST |
| **Modelo de Negócio** | SaaS B2B2C |
| **Fase Atual** | MVP — Backend & Frontend Implementados |

---

## 2. Perfis de Usuário e Dashboards

### 2.1 Detalhamento dos Perfis

| Perfil | Descrição | Acesso Principal |
|---|---|---|
| **Admin** (ROLE_ADMIN) | Gestor total da plataforma SmartMarket. Responsável pelo negócio SaaS, pelo Catálogo Global e pelos **Temas Base**. | Painel administrativo global (Backoffice). |
| **Gestor Supermercado** (ROLE_GESTOR) | Responsável pela operação comercial de um ou mais supermercados. Adiciona ofertas e cria encartes usando sua marca e **temas**. | Painel do estabelecimento (Dashboard Loja). |
| **Cliente** (ROLE_CLIENTE) | Usuário final (consumidor) das promoções. | App web responsivo / Mobile-first. |

### 2.2 Especificação dos Dashboards

#### 1. Dashboard Admin (Visão Global)
*   Gestão de Catálogo (Aprovação de produtos e imagens).
*   Gestão de Supermercados (Aprovação de novos parceiros).
*   **Gestão de Temas Sazonais:** Criar temas globais (ex: Natal, Black Friday) com backgrounds e cores.

#### 2. Dashboard Gestor Supermercado (Visão da Loja)
*   **Personalização de Loja:** Configuração de Logomarca, Cor Primária e Secundária.
*   Gestão de Ofertas (Preços dos produtos na sua loja).
*   **Gestão de Encartes Digitais:** Listagem, Criação e Edição de tabloides digitais escolhendo um Tema Sazonal.

#### 3. Visão do Cliente (App)
*   Home com promoções geolocalizadas.
*   **Visualização de Tabloide Imersiva:** Renderização do encarte com as cores da loja + elementos gráficos do tema sazonal.

---

## 3. Requisitos Funcionais

### 3.1 RF-01 — Autenticação e Segurança
*   **RF-01.1:** O sistema deve permitir login via E-mail/Senha para os três perfis.
*   **RF-01.2:** Uso de JWT para sessões stateless.
*   **RF-01.3:** Uso de Signals para estado reativo do usuário no Frontend.
*   **RF-01.4:** O acesso a páginas protegidas sem autenticação deve redirecionar o usuário para a tela de login.
*   **RF-01.5:** A vitrine do cliente final (ofertas, produtos e encartes) deve ter **acesso público**, permitindo a navegação tanto para usuários logados quanto não logados (anônimos).

### 3.2 RF-02 — Gestão de Supermercados (Whitelabel)
*   **RF-02.1:** O Admin deve cadastrar/aprovar supermercados.
*   **RF-02.2:** O Gestor deve poder fazer upload da **Logomarca** (MinIO).
*   **RF-02.3:** O Gestor deve definir a **Paleta de Cores** (Primária e Secundária).

### 3.3 RF-03 — Catálogo e Ofertas
*   **RF-03.1:** O Admin mantém o Catálogo Global de Produtos.
*   **RF-03.2:** O Gestor seleciona produtos do catálogo e define o preço de oferta para sua loja.
*   **RF-03.3:** O Cliente (logado ou não logado) deve poder visualizar os produtos e ofertas disponíveis.
*   **RF-03.4:** O Cliente deve poder aplicar diversos filtros na busca de ofertas (por categoria, faixa de preço, supermercado, etc.).

### 3.4 RF-04 — Encartes Virtuais Temáticos
*   **RF-04.1:** O Admin cadastra **Temas Sazonais** (Assets gráficos e cores de fundo).
*   **RF-04.2:** O Gestor cria um **Encarte Digital** associando um Tema e uma lista de Ofertas.
*   **RF-04.3:** O sistema gera um preview do encarte mesclando Whitelabel (Loja) + Tema (Sazonal).
*   **RF-04.4:** O Cliente (logado ou não logado) deve poder visualizar o encarte completo (tablóide digital) do supermercado de forma imersiva.

### 3.5 RF-05 — Notificações e Geolocalização
*   **RF-05.1:** O sistema deve capturar a **geolocalização do usuário** (via permissão de GPS do navegador/dispositivo ou entrada manual de CEP).
*   **RF-05.2:** Disparo de notificações push (RabbitMQ) quando o cliente entra no raio de atuação de um supermercado com ofertas ativas.
*   **RF-05.3:** **Busca por proximidade:** O sistema deve permitir a aplicação de filtros em um raio de localização configurável (ex: ofertas a num raio de 5km, 10km).
*   **RF-05.4:** **Exibição de supermercados próximos:** A vitrine principal deve priorizar automaticamente e destacar os estabelecimentos fisicamente mais próximos do usuário.
*   **RF-05.5:** **Personalização de ofertas por região:** O catálogo exibido para o cliente deve ser dinâmico, exibindo apenas encartes e produtos disponíveis na sua região de cobertura.

### 3.6 RF-06 — Coleta de Dados e Estatísticas (Analytics)
*   **RF-06.1:** O sistema deve ser orientado a dados (data-driven), coletando métricas de engajamento de forma contínua.
*   **RF-06.2:** Registro de **produtos mais visualizados** e **ofertas mais clicadas**.
*   **RF-06.3:** Rastreamento contínuo das **preferências dos usuários** e **histórico de navegação**.
*   **RF-06.4:** Monitoramento analítico dos **filtros mais utilizados** nas telas de busca.
*   **RF-06.5:** Medição do **tempo de permanência nas telas** e no consumo visual dos encartes digitais.
*   **RF-06.6:** Captura da **localização dos acessos** (mediante permissão do usuário) para gerar mapas de calor de interesse.

---

## 4. Requisitos Não Funcionais

### 4.1 RNF-01 — Performance
*   Tempo de resposta das APIs < 200ms para 95% das requisições.
*   Carregamento do encarte no mobile em < 2 segundos.

### 4.2 RNF-02 — Escalabilidade
*   Arquitetura de Microserviços para escala independente.
*   Uso de Cache (Redis) para catálogo e ofertas frequentes.

### 4.3 RNF-03 — Armazenamento de Arquivos (MinIO)
*   `smartmarket-products`: Imagens de produtos.
*   `smartmarket-brands`: Logomarcas dos supermercados.
*   `smartmarket-themes`: Assets decorativos de campanhas sazonais.

---

## 5. Modelagem de Domínio (V1.6)

| Entidade | Atributos Principais |
|---|---|
| **Supermercado** | id, nome, cnpj, status, urlLogomarca, corPrimariaHex, corSecundariaHex |
| **TemaEncarte** | id, nome, urlBackgroundDecorativo, corFundoHex, ativo |
| **EncarteDigital** | id, supermercadoId, temaId, titulo, dataInicio, dataFim, status |
| **ProdutoBase** | id, nome, urlImagem, categoriaId |
| **Oferta** | id, supermercadoId, produtoBaseId, preco |

---

## 6. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Backend** | Java 21 LTS + Spring Boot 3.4.x |
| **Frontend** | Angular 18+ + Tailwind CSS + Angular Material + Signals |
| **API Gateway** | Spring Cloud Gateway |
| **Segurança** | Spring Security + JWT |
| **Banco de Dados** | PostgreSQL 16 (Database-per-service) |
| **Object Storage** | MinIO (Object Storage compatível com S3) |
| **Mensageria** | RabbitMQ (Comunicação Assíncrona e Eventos) |
| **Migração de BD** | Flyway |
| **Observabilidade** | Prometheus + Grafana + Spring Boot Actuator |
| **Containerização** | Docker + Docker Compose |

---

## 7. Roadmap Macro

1.  **Fase 1 (Concluída):** Fundamentos de Segurança e Auth-Service.
2.  **Fase 2 (Concluída):** Supermarket-Service com Whitelabel e Product-Service com Encartes Temáticos.
3.  **Fase 3 (Concluída):** Frontend Angular (Portal Admin e Gestor).
4.  **Fase 4 (Em andamento):** App Cliente (Mobile First) e Geolocalização.
5.  **Fase 5:** Notificações Push e Analytics.

---

## 8. Glossário

*   **Whitelabel:** Capacidade do sistema de assumir a identidade visual do cliente (supermercado).
*   **Sazonal:** Relativo a épocas específicas do ano (Natal, Páscoa, etc).
*   **Encarte Digital:** Tabloide de ofertas visualizado em dispositivos digitais.
*   **MinIO:** Servidor de armazenamento de objetos de alta performance.

---

## 10. Definição dos Microserviços

*   **auth-service:** Centraliza usuários e permissões.
*   **supermarket-service:** Cadastro de lojas e dados de Whitelabel.
*   **product-service:** Catálogo global, Ofertas, Temas e Encartes.
*   **client-service:** Perfil do consumidor e listas de compras.
*   **notification-service:** Orquestração de Pushes e E-mails.
*   **recommendation-service:** IA para sugestão de ofertas baseadas no perfil.

---

## 12. Diferencial Estratégico: Marketing Inteligente por Proximidade

### 🏪 Visão de Negócio
Esta funcionalidade posiciona o SmartMarket não apenas como um repositório de encartes, mas como uma **plataforma inteligente de divulgação e atração de tráfego físico (Drive-to-Store)**. Trata-se de um canal direto de marketing para o supermercado, altamente segmentado, baseado em dados reais de intenção de compra e focado em alta conversão.

### 12.1. Funcionalidade: Marketing Inteligente por Proximidade
Um ecossistema automatizado que conecta a localização em tempo real do consumidor com seu histórico de preferências, disparando gatilhos de marketing (Push Notifications) exatos no momento em que ele está fisicamente propício a realizar uma compra.

### 12.2. Requisitos Funcionais (Coleta e Campanhas)
*   **RF-12.2.1:** O sistema deve monitorar e registrar a navegação do usuário no aplicativo (cliques em produtos, encartes abertos, buscas realizadas e tempo de tela).
*   **RF-12.2.2:** O sistema deve taguear automaticamente os interesses do usuário baseado no engajamento (ex: afinidade com "Cervejas Artesanais", "Itens de Churrasco", "Fraldas e Bebês").
*   **RF-12.2.3:** O Gestor do Supermercado deve poder criar "Campanhas Inteligentes" no painel, definindo regras de segmentação (ex: "Enviar para usuários que favoritaram carne e estão a 1km da loja").
*   **RF-12.2.4:** A configuração da campanha deve permitir a definição de: Produto/Encarte alvo, Mensagem Customizada (Copy), Preço Promocional e Raio de Alcance (ex: 500m, 1km, 3km).

### 12.3. Requisitos de Geolocalização
*   **RF-12.3.1:** O aplicativo móvel deve capturar e atualizar a localização (Latitude/Longitude) do usuário em background, otimizando o consumo de bateria.
*   **RF-12.3.2:** O backend (via `notification-service` e Redis Geospatial) deve calcular a proximidade radial entre as coordenadas do usuário e as coordenadas dos supermercados parceiros.
*   **RF-12.3.3:** O sistema deve gerar eventos (triggers) automáticos de *Geofencing* quando o usuário realizar "Entry" (entrar no raio) ou "Exit" (sair do raio) de uma zona configurada pela campanha.

### 12.4. Requisitos de Personalização
*   **RF-12.4.1:** O motor de recomendação deve cruzar a geolocalização do usuário com seu perfil de interesses para validar se uma notificação deve ser enviada.
*   **RF-12.4.2:** O sistema deve suportar variáveis dinâmicas no texto do Push (ex: `"Olá {Nome}, a Picanha que você olhou ontem está em oferta a 500 metros daqui, no {Nome_Supermercado}!"`).

### 12.5. Requisitos de Notificação Push
*   **RF-12.5.1:** O disparo da notificação deve ocorrer em tempo real (tolerância de até 1 minuto) após a entrada do usuário no raio configurado.
*   **RF-12.5.2:** O conteúdo da notificação deve conter um "Deep Link" que, ao ser clicado, abra diretamente a tela do produto ou o encarte da oferta no app.
*   **RF-12.5.3:** O sistema deve garantir resiliência no disparo utilizando mensageria (RabbitMQ) para enfileiramento dos Pushes.

### 12.6. Requisitos de Analytics e Métricas (Crítico)
*   **RF-12.6.1 - Engajamento:** O sistema deve rastrear e exibir no dashboard do supermercado o funil da campanha: Quantidade de Pushes Enviados ➔ Pushes Recebidos ➔ Pushes Abertos (CTR).
*   **RF-12.6.2 - Comportamento Físico (Footfall Attribution):** O sistema deve registrar uma "Visita ao Supermercado" caso o usuário entre em um raio de altíssima proximidade (ex: 20 a 50 metros) em até 24 horas após receber a notificação.
*   **RF-12.6.3 - Inteligência de Dados:** O sistema deve gerar relatórios agregados de: Categorias mais convertidas via Push, Mapas de Calor (Heatmaps) de onde os usuários abrem o app, e Correlação exata entre o investimento na campanha e o tráfego físico gerado.

### 12.7. Requisitos de Privacidade e Consentimento (Obrigatório)
*   **RF-12.7.1:** O sistema deve estar 100% aderente à **LGPD**, exibindo um modal claro solicitando o aceite aos Termos de Uso e Política de Privacidade na criação da conta.
*   **RF-12.7.2:** O aplicativo deve solicitar permissão explícita (OS-level prompt) para acesso à localização, explicando claramente o benefício ("Para enviar ofertas exclusivas quando você estiver perto").
*   **RF-12.7.3:** O usuário deve ter um painel de Preferências de Privacidade onde possa gerenciar facilmente o *Opt-in* e *Opt-out* de rastreamento de localização e notificações push, a qualquer momento.
*   **RF-12.7.4:** Dados sensíveis de localização bruta devem ser retidos pelo tempo mínimo necessário ou anonimizados para fins estatísticos (Data Anonymization).

### 🛠️ Diferenciais, Sugestões e Boas Práticas (Growth Features)
Para elevar esta funcionalidade ao nível "World Class", recomendo a implementação das seguintes estratégias na esteira de evolução:

1.  **Frequency Capping (Controle de Fadiga):** Implementar um limite rígido (ex: máximo de 1 push por loja por dia, ou 3 por semana) para evitar que o usuário considere o app como *Spam* e o desinstale.
2.  **Testes A/B Nativos:** Permitir que o gestor do supermercado crie duas versões de texto (Copy) para a mesma campanha de proximidade, enviando para fatias da audiência e usando a vencedora automaticamente.
3.  **Predição de Recompra (AI-Driven):** O `recommendation-service` pode calcular o ciclo de vida do produto (ex: pacote de fraldas acaba em média a cada 15 dias). O Push de proximidade se torna muito mais forte se ativado na janela exata da provável recompra.
4.  **Fallback para SMS/WhatsApp:** Para usuários de alto valor (VIPs do supermercado) que optaram por desligar o Push, permitir o roteamento do alerta via WhatsApp corporativo da loja, desde que haja opt-in específico.

---

## 13. Diferencial Estratégico: Canal de Aquisição Físico-Digital (Totem QR Code)

### 🌱 Visão de Negócio e Posicionamento Sustentável
Esta funcionalidade estabelece uma ponte estratégica entre o ambiente físico do supermercado e a plataforma digital SmartMarket. O objetivo é criar um canal de aquisição e engajamento de baixo atrito, posicionando o produto como uma solução moderna e ecologicamente consciente. Ao substituir o encarte de papel por um acesso digital imediato, reforçamos o valor de sustentabilidade e modernização para o supermercado parceiro.

### 13.1. Funcionalidade: Totem de Acesso ao Encarte Digital
Um totem físico, posicionado estrategicamente na entrada do supermercado, contendo um QR Code dinâmico. Ao escanear o código, o cliente é direcionado instantaneamente para o encarte digital daquela loja específica, sem a necessidade de login ou instalação de aplicativo.

### 13.2. Requisitos Funcionais (RF-07)
*   **RF-07.1 - Geração de QR Code por Loja:** O painel do Gestor do Supermercado deve fornecer uma área para gerar ou visualizar um QR Code único para sua loja. Este QR Code deve conter parâmetros de rastreamento (ex: `?utm_source=totem&utm_campaign=acesso_fisico`).
*   **RF-07.2 - Vinculação Dinâmica:** O QR Code deve ser permanente. O sistema deve garantir que o link associado a ele sempre redirecione para o encarte digital que estiver ativo no momento do escaneamento.
*   **RF-07.3 - Acesso Público e Imediato:** A página de destino do QR Code deve ser pública, de carregamento rápido e não exigir qualquer tipo de autenticação, em conformidade com o requisito **RF-01.5**.

### 13.3. Requisitos de Experiência do Usuário (UX)
*   **UX-13.3.1 - Interação Instantânea:** A experiência do usuário deve ser fluida. Ao apontar a câmera, o acesso ao encarte deve ser percebido como instantâneo.
*   **UX-13.3.2 - Navegação Mobile-First:** A visualização do encarte deve ser 100% otimizada para dispositivos móveis, com gestos intuitivos de zoom e navegação entre as páginas ou ofertas.
*   **UX-13.3.3 - Incentivo à Exploração (CTA):** Durante a navegação no encarte, o sistema deve apresentar *Call-to-Actions* (CTAs) contextuais e não intrusivos para incentivar o engajamento mais profundo, como "Criar minha lista de compras" ou "Salvar oferta".

### 13.4. Requisitos de Analytics e Métricas (RF-08)
*   **RF-08.1 - Rastreamento de Origem:** O sistema de analytics deve ser capaz de identificar e segmentar todos os acessos provenientes do QR Code do totem.
*   **RF-08.2 - Funil de Conversão Físico-Digital:** O dashboard do gestor deve exibir métricas chave para este canal:
    *   Número de escaneamentos do QR Code.
    *   Tempo médio de sessão por usuário vindo do totem.
    *   Produtos e ofertas mais visualizados a partir deste canal.
    *   Taxa de conversão (usuários que realizaram uma ação secundária, como salvar uma oferta ou iniciar um cadastro).
*   **RF-08.3 - Análise Comparativa:** Permitir a comparação de desempenho entre o tráfego originado pelo totem físico e outros canais de aquisição digital.

### 13.5. Requisitos Não Funcionais (RNF-04)
*   **RNF-04.1 - Performance de Carregamento:** A página do encarte acessada via QR Code deve ter um *Largest Contentful Paint (LCP)* inferior a 2 segundos em uma conexão 4G.
*   **RNF-04.2 - Alta Disponibilidade:** O endpoint de redirecionamento do QR Code deve ter um SLA de 99.95% de disponibilidade.
*   **RNF-04.3 - Compatibilidade Mobile:** Garantir funcionamento pleno nos navegadores padrão (Chrome, Safari) das duas últimas versões dos sistemas operacionais iOS e Android.

### 13.6. Requisitos de Negócio e Material de Apoio
*   **RN-13.6.1 - Guia de Design do Totem:** A plataforma SmartMarket deve fornecer aos supermercados um guia de identidade visual para a construção do totem, com especificações de cores, logo e tipografia, garantindo consistência da marca.
*   **RN-13.6.2 - Slogans Recomendados:** Sugerir frases de impacto para o totem, como: "Aponte, Economize e Ajude o Planeta" ou "Seu Encarte Agora é Digital. Rápido e Ecológico".

### 🛠️ Diferenciais e Evolução (Growth Features)
Para maximizar o impacto deste canal, as seguintes evoluções devem ser consideradas no roadmap:

1.  **Testes A/B de Mensagens:** Permitir que o gestor teste diferentes chamadas (slogans) no totem e meça qual gera mais escaneamentos, otimizando a comunicação.
2.  **Campanhas Específicas via QR Code:** Evoluir o sistema para que o QR Code possa apontar para campanhas específicas (ex: "Ofertas de Hortifruti da Terça") em vez de apenas o encarte principal, criando um senso de urgência e exclusividade.
3.  **Bônus de Primeira Interação:** Oferecer um cupom de desconto exclusivo para o primeiro acesso via totem, como forma de incentivar a experimentação e criar um ciclo de retorno.
4.  **Integração com Notificações:** Após o usuário navegar pelo encarte, exibir um prompt amigável sugerindo a ativação de notificações para ser avisado sobre novas promoções daquela loja.

---

## 14. Diferencial Estratégico: Acesso Público e Experiência sem Fricção (Product-Led Growth)

### 🎯 Visão de Negócio e Growth
Para maximizar a adoção da plataforma e reduzir o Custo de Aquisição de Clientes (CAC), o SmartMarket adota a estratégia de *Product-Led Growth* através de um modelo "Try Before You Buy" (ou "Navegue Antes de Logar"). O usuário deve perceber o valor da plataforma (ofertas relevantes e próximas) nos primeiros 5 segundos de uso, removendo a barreira do cadastro obrigatório. A conversão para usuário logado ocorrerá de forma orgânica e por engajamento.

### 14.1. Funcionalidade: Tela Inicial Universal e Acesso Desbloqueado
Todos os usuários, autenticados ou anônimos, têm acesso a uma experiência rica. O conteúdo core da plataforma (encartes, produtos em destaque e vitrines) é totalmente consumível sem bloqueios de tela ou forçantes de login.

### 14.2. Requisitos Funcionais (RF-09)
*   **RF-09.1 - Vitrine Universal:** A página inicial (`/`) deve exibir de imediato: Produtos em Destaque, Supermercados Próximos e Encartes Ativos, independentemente do status de autenticação.
*   **RF-09.2 - Navegação Completa Anônima:** O usuário anônimo pode abrir encartes (visualização de tablóide), buscar produtos por barra de pesquisa e usar todos os filtros de categoria e preço.
*   **RF-09.3 - Conversão Contextual (Soft Gate):** Ações de personalização e retenção, como "Favoritar Produto" ou "Criar Lista de Compras", devem abrir um modal amigável (Soft Gate) convidando o usuário a criar uma conta ou fazer login, sem perder o contexto (após o login, a ação de favoritar é concluída automaticamente).

### 14.3. Requisitos de Geolocalização Pública (Raio de 3KM)
*   **RF-09.4 - Permissão Opcional de GPS:** Ao carregar a tela inicial pela primeira vez, o aplicativo deve solicitar, via prompt nativo do navegador/OS, acesso à geolocalização.
*   **RF-09.5 - Raio Padrão (3 KM):** Se a permissão for concedida, o sistema (via Redis Geospatial) filtra automaticamente e exibe apenas os supermercados e ofertas em um raio de até 3 km do usuário.
*   **RF-09.6 - Fallback para Busca Manual:** Se a permissão for negada (ou falhar), a interface deve exibir um campo visível no Header para que o usuário informe seu CEP ou Bairro, garantindo o funcionamento do filtro geográfico.

### 14.4. Requisitos de Experiência do Usuário (UX)
*   **UX-14.4.1 - Header de Conversão:** O Header para usuários não logados deve conter botões claros de "Entrar" (Secundário) e "Criar Conta" (Primário / Destaque), posicionados no canto superior direito.
*   **UX-14.4.2 - Skeleton Screens:** Durante o carregamento da Home, utilizar *Skeleton Loaders* para mitigar a percepção de tempo de espera e reter a atenção do usuário.
*   **UX-14.4.3 - Progressive Profiling:** Em vez de pedir todos os dados no cadastro, o SmartMarket deve adotar o *Login Social* (Google, Apple) em 1 clique para reduzir a fricção e pedir dados adicionais (como CPF ou interesses) apenas posteriormente.

### 14.5. Requisitos de Analytics e Comportamento Anônimo (Crítico)
*   **RF-09.7 - Tracking Anônimo:** O sistema de analytics deve gerar um UUID de sessão anônima (`Session ID`), armazenado localmente (cookie/local storage), para rastrear a jornada de usuários não logados.
*   **RF-09.8 - Eventos a Monitorar:** Devemos rastrear: 1) Taxa de rejeição sem interação, 2) Tempo gasto no encarte anônimo, 3) Interação com o filtro de localização, 4) Cliques em produtos.
*   **RF-09.9 - Funil de Conversão (Anonymous to Registered):** O dashboard de Growth do administrador deve exibir a métrica de "Taxa de Conversão de Sessões Anônimas para Usuários Logados", identificando qual "Soft Gate" (ex: "clicou em favoritar") mais gerou conversões.

### 14.6. Requisitos de Privacidade (LGPD)
*   **RF-09.10 - Banner de Cookies e Privacidade:** Exibir de forma sutil, na parte inferior da tela, o aviso sobre uso de cookies para melhoria de experiência anônima.
*   **RF-09.11 - Transparência de Dados:** No prompt de localização (customizado antes do prompt do OS), deve haver um texto explicativo claro: "Usamos sua localização apenas para mostrar as melhores ofertas perto de você".

### 14.7. Requisitos Não Funcionais (RNF-05)
*   **RNF-05.1 - Performance com Tráfego Público:** Como a página inicial será pública, requisições do catálogo base devem ser servidas por Cache em Memória (Redis) e, se possível, os *assets* (imagens/banners) devem usar CDN Edge Caching. O *Time to First Byte* (TTFB) da vitrine anônima deve ser inferior a 150ms.
*   **RNF-05.2 - Rate Limiting:** Implementar Rate Limiting rigoroso no `api-gateway` para rotas públicas, visando proteger a infraestrutura contra ataques de botnets ou *web scraping* automatizado extraindo ofertas.

### 🛠️ Diferenciais, Sugestões e Boas Práticas (Growth & IA Features)
Para enriquecer a experiência dos usuários mesmo sem possuirmos seus dados nominais:

1.  **Personalização Baseada em Comportamento Anônimo:** Usar o `local storage` para salvar categorias recentemente clicadas na mesma sessão. Se o usuário clicou em 3 itens de "Churrasco", a vitrine passa a priorizar e reordenar a seção de Carnes no topo da Home.
2.  **Trending "Na sua Região" (Recomendação Inteligente):** Em vez de exibir apenas produtos genéricos, criar um carrossel na Home: "Produtos mais buscados no seu bairro hoje". Isso cria um *Fear Of Missing Out* (FOMO) local.
3.  **Persistência de Dados de Conversão:** Ao tentar salvar uma "Lista de Compras" sem estar logado, o sistema salva os itens em cache. Após o usuário completar a criação da conta, o SmartMarket migra a lista em cache para o banco de dados oficial dele, não frustrando o esforço inicial do usuário ("Seamless Handoff").

---

## 15. Estratégia de Cache em Múltiplas Camadas (Alta Performance)

Para suportar o alto volume de tráfego gerado pela vitrine pública (acessos anônimos) e garantir tempo de resposta na casa dos milissegundos, o SmartMarket adota uma estratégia de cache em 4 camadas.

### 15.1. Camada 1: Cache no Frontend (Angular)
*   **RF-15.1.1:** O frontend deve utilizar cache em memória via RxJS (`shareReplay`) para evitar requisições duplicadas de componentes que consomem os mesmos endpoints na mesma sessão de tela.
*   **RF-15.1.2:** O sistema deve utilizar `localStorage` para reter o estado de preferências não-sensíveis do usuário anônimo (ex: o CEP da busca fallback) para evitar requisições desnecessárias na reabertura do site.

### 15.2. Camada 2: Cache HTTP e Edge (CDN/Browser)
*   **RF-15.2.1:** As respostas de endpoints públicos (catálogo, vitrine) devem obrigatoriamente utilizar a diretiva HTTP `Cache-Control: stale-while-revalidate`, fornecendo ao usuário um dado de forma instantânea enquanto o backend renova a informação em segundo plano.
*   **RF-15.2.2:** O backend deve emitir cabeçalhos `ETag`. O frontend (ou browser) enviará `If-None-Match`, permitindo ao Gateway responder com HTTP `304 Not Modified` caso os dados não tenham sofrido alteração, reduzindo o consumo de banda.

### 15.3. Camada 3: Cache no Backend (Spring Boot + Redis)
*   **RF-15.3.1:** Consultas custosas do banco de dados devem ser mantidas no cache em memória usando o cluster do Redis.
*   **RF-15.3.2 (Cache por Geohash):** O sistema NÃO deve cachear listas de ofertas utilizando a Latitude/Longitude granular do dispositivo. Em vez disso, o sistema de localização deve converter a coordenada para um **Geohash** (com tamanho fixo, ex: raio de 600m). O sistema agrupará os usuários geograficamente, garantindo que toda a sub-região receba um único "Cache Hit".

### 15.4. Camada 4: Invalidação de Cache Crítico (Event-Driven)
*   **RF-15.4.1:** Para evitar que o usuário enxergue preços inconsistentes, a invalidação do Redis deve ser ativa e não apenas por expiração de tempo (TTL).
*   **RF-15.4.2:** Após o banco de dados (PostgreSQL) registrar a alteração de uma oferta ou encarte, o serviço de origem deve publicar um evento (ex: `OfferPriceChangedEvent`) no RabbitMQ.
*   **RF-15.4.3:** O listener deste evento cuidará do "Eviction" (despejo) exato no cache regional (`Geohash`) do produto/encarte recém-alterado.
