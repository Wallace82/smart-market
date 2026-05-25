# 📋 SmartMarket — Documento de Requisitos (MVP)

> **Versão:** 3.0.0
> **Data:** 2026-05-25
> **Status:** MVP — Escopo Validado

---

## 📑 Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Perfis de Usuário](#2-perfis-de-usuário)
3. [Requisitos Funcionais (MVP)](#3-requisitos-funcionais-mvp)
4. [Requisitos Não Funcionais (MVP)](#4-requisitos-não-funcionais-mvp)
5. [Modelagem de Domínio](#5-modelagem-de-domínio)
6. [Arquitetura dos Microsserviços](#6-arquitetura-dos-microsserviços)
7. [Glossário](#7-glossário)

---

## 1. Visão Geral do Produto

O **SmartMarket** é uma plataforma SaaS B2B2C responsiva e mobile-first, que conecta redes de supermercados locais diretamente a seus consumidores regionais através de encartes de ofertas dinâmicos, vitrines interativas baseadas em geolocalização e personalização visual completa (whitelabel) sem nenhuma barreira de cadastro obrigatório para visualização.

O sistema ajuda a combater o desperdício ecológico de impressão de encartes em papel, melhora o tempo de atração de clientes dos gestores de lojas, e fornece uma interface assistida (Concierge) automatizada para entrada veloz de novos encartes.

---

## 2. Perfis de Usuário e Níveis de Acesso

*   **Administrador Global (ROLE_ADMIN):** Cadastro do catálogo de produtos padrão da plataforma, aprovação e monitoramento de novos estabelecimentos e criação dos **Temas Sazonais** decorativos.
*   **Gestor do Supermercado (ROLE_GESTOR):** Responsável por atualizar o perfil whitelabel da sua loja, cadastrar ofertas válidas vinculadas a produtos da plataforma, gerenciar sua assinatura e comprar add-ons, fazer uploads de listagens manuais e emitir encartes.
*   **Atendente Concierge (ROLE_ATENDENTE):** Operador que recebe arquivos de ofertas (Excel, Imagens, PDFs), insere esses dados na plataforma e monta os encartes em nome do gestor do supermercado de acordo com a SLA de seu plano.
*   **Cliente Final (Anônimo ou ROLE_CLIENTE):** Consumidor local que navega pelas vitrines de encartes e ofertas de sua vizinhança. **A navegação é 100% livre e sem fricção de login.**

---

## 3. Requisitos Funcionais (MVP)

### 3.1 RF-01 — Segurança e Sessões
*   **RF-01.1:** Login seguro com E-mail/Senha com hash BCrypt para perfis administrativos (`ADMIN`, `GESTOR`, `ATENDENTE`).
*   **RF-01.2:** Emissão e validação de tokens de segurança JWT de forma stateless.
*   **RF-01.3:** Roteamento público explícito no API Gateway e filtros Spring Security liberados para rotas `/api/v1/public/**`.
*   **RF-01.4:** **Acesso Sem Fricção (PLG):** A página inicial, listagem de ofertas, visualização imersiva do encarte tabloide e leitura de QR Codes devem estar disponíveis publicamente sem exigência de login ou registro do cliente final.

### 3.2 RF-02 — Identidade Visual Whitelabel
*   **RF-02.1:** O Gestor pode configurar a Logomarca da sua loja (persiste no bucket `smartmarket-brands` do MinIO).
*   **RF-02.2:** O Gestor deve poder escolher a Paleta de Cores (Cores Hexadecimal Primária e Secundária).
*   **RF-02.3:** O Angular deve ler os dados whitelabel da loja e usar a diretiva customizada `appWhitelabelTheme` para injetar variáveis CSS `--color-primary` e `--color-secondary` no DOM de forma dinâmica no client-side.

### 3.3 RF-03 — Catálogo de Produtos e Categorias
*   **RF-03.1:** O Admin mantém o Catálogo Global de Produtos vinculados a categorias específicas (CRUD completo com imagens no bucket `smartmarket-products`).
*   **RF-03.2:** O Gestor seleciona produtos do Catálogo Global e cria suas ofertas locais definindo o preço promocional e a data de vigência.

### 3.4 RF-04 — Encartes Digitais (Tabloide)
*   **RF-04.1:** O Admin define **Temas Sazonais** (com cores decorativas e imagens de background no bucket `smartmarket-themes`).
*   **RF-04.2:** O Gestor monta um Encarte escolhendo um Tema decorativo e inserindo um conjunto de ofertas vigentes. O status do encarte segue a máquina de estados: `RASCUNHO`, `ATIVO` e `ENCERRADO`.
*   **RF-04.3:** O Cliente visualiza o tabloide completo de forma imersiva e mobile-first no celular.

### 3.5 RF-05 — Geolocalização Radial Simplificada
*   **RF-05.1:** O frontend solicita permissão de coordenadas GPS via API nativa do browser `navigator.geolocation`.
*   **RF-05.2:** Se a permissão for concedida, o sistema filtra e ordena os supermercados parceiros mais próximos em um raio padrão de **3 km** através de cálculo radial usando a fórmula de Haversine direto no banco PostgreSQL.
*   **RF-05.3:** Se a permissão for negada ou indisponível, o sistema exibe um formulário amigável no topo da página para o usuário digitar seu **CEP ou Bairro** manualmente, redefinindo o centro de buscas.

### 3.6 RF-06 — Fila Inteligente (Operação Concierge)
*   **RF-06.1: Upload de Listagem:** O Gestor pode fazer upload de arquivos de imagem, PDF, Excel ou Word com novos tabloides para serem processados pela equipe interna.
*   **RF-06.2: Cálculo Dinâmico de Prioridade (Score):** A fila de atendentes é ordenada automaticamente de acordo com o score de prioridade de cada chamado atualizado a cada minuto pela fórmula ponderada:
    $$\text{Score} = (0.4 \times \text{Urgência SLA}) + (0.3 \times \text{Prioridade Plano}) + (0.2 \times \text{Tempo Espera}) - (0.1 \times \text{Complexidade})$$
*   **RF-06.3: Lock Transacional:** Ao iniciar o chamado, o sistema cria uma trava atômica vinculando o `atendenteId`, marcando o status como `EM_PROCESSAMENTO`, bloqueando tentativas concorrentes de captura.
*   **RF-06.4: Aprovação da Prévia:** O Gestor recebe um link exclusivo para inspecionar, editar e aprovar as ofertas geradas pelo Concierge antes de ativá-las publicamente.

---

## 4. Requisitos Não Funcionais (MVP)

*   **RNF-01 — Performance de Acesso:** Tempo de carregamento de páginas estáticas e encartes públicos inferior a **3 segundos** em conexões móveis 4G. APIs públicas de catálogo respondem em menos de **300ms** utilizando caching distribuído via Redis.
*   **RNF-02 — Armazenamento Dedicado:** Uso de Buckets isolados no MinIO com controle de download anônimo para imagens de marcas, produtos e temas sazonais.
*   **RNF-03 — Conformidade com Privacidade (LGPD):** Banner claro de consentimento de geolocalização explicando que a localização do browser é usada exclusivamente para filtragem local instantânea e nunca é armazenada de forma bruta no banco de dados.

---

## 5. Modelagem de Domínio

```text
Supermercado (id, nomeFantasia, cnpj, status, latitude, longitude, corPrimariaHex, corSecundariaHex, urlLogomarca)
   │
   ├── 1:N ──> Oferta (id, produtoBaseId, preco, dataInicio, dataFim, ativa)
   │
   ├── 1:N ──> EncarteDigital (id, temaId, titulo, status, dataInicio, dataFim)
   │
   └── 1:N ──> SolicitacaoConcierge (id, atendenteId, status, prioridadeScore, slaDefinido, urlArquivoOriginal)
```

---

## 6. Arquitetura de Microsserviços

O backend é subdividido em microsserviços autônomos que isolam as responsabilidades de negócio e dados:
*   `api-gateway`
*   `auth-service`
*   `supermarket-service`
*   `product-service`
*   `billing-service`
*   `concierge-service`
*   `client-service`
*   `notification-service`
*   `recommendation-service`

---

## 7. Glossário

*   **Whitelabel:** Customização visual completa assumindo a marca do supermercado cliente.
*   **Product-Led Growth (PLG):** Metodologia de crescimento centrada na experiência rápida e sem fricção do produto.
*   **Haversine:** Fórmula trigonométrica para calcular distâncias radiais entre pontos geográficos na superfície terrestre.
