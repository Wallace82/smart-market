# 📋 SmartMarket — Documento de Requisitos

> **Versão:** 1.4.0
> **Data:** 2025
> **Status:** Em desenvolvimento
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
| **Fase Atual** | MVP — Em desenvolvimento |

---

## 2. Perfis de Usuário e Dashboards

### 2.1 Detalhamento dos Perfis

A plataforma atende a três papéis distintos, cada um com sua visão e acesso específico.

| Perfil | Descrição | Acesso Principal |
|---|---|---|
| **Admin** (ROLE_ADMIN) | Gestor total da plataforma SmartMarket. Responsável pelo negócio SaaS, pelo Catálogo Global e pelos **Temas Base**. | Painel administrativo global (Backoffice). |
| **Gestor Supermercado** (ROLE_GESTOR) | Responsável pela operação comercial de um ou mais supermercados. Adiciona ofertas e cria encartes usando sua marca e **temas**. | Painel do estabelecimento (Dashboard Loja). |
| **Cliente** (ROLE_CLIENTE) | Usuário final (consumidor) das promoções. | App web responsivo / Mobile-first. |

### 2.2 Especificação dos Dashboards

#### 1. Dashboard Admin (Visão Global da Plataforma)
*   **Métricas Principais:** Total de Produtos, Supermercados Ativos, MRR.
*   **Ações e Gráficos:**
    *   Gestão de Catálogo (Aprovação e imagens).
    *   **Gestão de Temas Sazonais (NOVO):** Criar e disponibilizar temas globais (ex: Natal, Black Friday, Dia das Mães) para os supermercados utilizarem nos seus encartes.
    *   Métricas financeiras e logs.

#### 2. Dashboard Gestor Supermercado (Visão da Loja)
*   **Métricas Principais:** Produtos Ofertados, Visitas ao encarte, Listas de Compras.
*   **Ações e Gráficos:**
    *   **Personalização de Loja:** Logomarca, Cor Primária e Secundária.
    *   **Criação de Encarte com Tema (NOVO):** Ao criar um encarte, o gestor escolhe um "Tema" (ex: "Semana do Consumidor" ou "Padrão"). O tabloide herda o fundo, assets decorativos do tema, mas mantém as cores/logo do supermercado.
    *   **Preview do Tabloide:** Ver a composição do Tema + Produtos + Cores do Mercado antes de publicar.
    *   Analytics de acesso.

#### 3. Visão do Cliente (App)
*   **Home Personalizada:** Banners, recomendações.
*   **Visão de Tabloide:** Visualização do encarte mesclando o "Tema Sazonal" (elementos gráficos festivos) com a identidade do Supermercado (Logo e paleta).

---

## 3. Requisitos Funcionais

### RF-01 a RF-03
*(... Autenticação, Gestão de Mercados e Catálogo Base mantidos conforme v1.3 ...)*

### RF-04 — Ofertas e Encartes Virtuais Temáticos

| ID | Descrição | Prioridade |
|---|---|---|
| RF-04.1 | **Associação de Preço:** Gestor busca um Produto Base e cria uma Oferta vinculando seu preço. | Alta |
| RF-04.2 | **Gestão de Temas Base (Admin):** O Administrador cadastra temas globais (Nome, Cor de Fundo do Tema, URL de Background Decorativo, URL de Banners/Enfeites). | Alta |
| RF-04.3 | **Criação do Encarte com Tema:** O Gestor cria um encarte, seleciona as ofertas ativas e escolhe um Tema Base disponibilizado pelo Admin (ou "Sem Tema/Padrão"). | Alta |
| RF-04.4 | **Preview Temático:** A prévia do tabloide renderiza os elementos do tema sazonal por baixo/junto da identidade visual do supermercado (Logo e Cores primárias). | Alta |
| RF-04.5 | Publicação de encarte digital para os clientes. | Alta |

### RF-05 — Push Notifications por Geolocalização e Campanhas
*(... Ver fluxo detalhado de Geofencing documentado na versão 1.1 ...)*

---

## 4. Requisitos Não Funcionais

### RNF-08 — Armazenamento de Arquivos
| ID | Descrição |
|---|---|
| RNF-08.1 | Imagens dos produtos armazenadas no MinIO (`smartmarket-products`). |
| RNF-08.2 | Logomarcas dos supermercados armazenadas no MinIO (`smartmarket-brands`). |
| RNF-08.3 | **Assets de Temas** (Fundos de tela de Natal, banners temáticos) armazenados no MinIO (`smartmarket-themes`). |
| RNF-08.4 | URLs públicas para leitura no Frontend. |

---

## 5. Modelagem de Domínio (Revisada V1.4)

### 5.1 Entidades Críticas Atualizadas

| Entidade | Descrição de Negócio | Atributos Principais |
|---|---|---|
| **TemaEncarte (NOVO)** | Tema sazonal ou promocional criado pelo Admin. | id, nome (ex: Natal 2025), urlBackgroundDecorativo, corFundoHex, ativo |
| **Supermercado** | Unidade de negócio (Whitelabel). | id, nomeFantasia, cnpj, status, ..., **urlLogomarca**, **corPrimariaHex**, **corSecundariaHex** |
| **ProdutoBase** | Produto do catálogo global. | id, nome, urlImagem, ... |
| **OfertaSupermercado** | Preço da loja para o produto. | id, supermercadoId, produtoBaseId, precoAtual... |
| **EncarteDigital** | O tabloide publicado. Agora possui um Tema. | id, supermercadoId, **temaId**, titulo, dataInicio, dataFim, status |
| **EncarteItem** | Associação encarte-oferta. | id, encarteId, ofertaId, ordemExibicao, destaque |

### 5.2 Regras de Negócio Revisadas

| ID | Regra |
|---|---|
| RN-18 | A renderização do Encarte no Frontend deve priorizar o CSS do Supermercado (Logo/Cores). Caso um `TemaEncarte` esteja selecionado, ele fornece os assets gráficos de fundo (background images) da campanha. |

---

## 6. Stack Tecnológica Atualizada

*(... Mantida conforme v1.3 ...)*
