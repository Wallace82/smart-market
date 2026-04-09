# 📋 SmartMarket — Documento de Requisitos

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

### 3.2 RF-02 — Gestão de Supermercados (Whitelabel)
*   **RF-02.1:** O Admin deve cadastrar/aprovar supermercados.
*   **RF-02.2:** O Gestor deve poder fazer upload da **Logomarca** (MinIO).
*   **RF-02.3:** O Gestor deve definir a **Paleta de Cores** (Primária e Secundária).

### 3.3 RF-03 — Catálogo e Ofertas
*   **RF-03.1:** O Admin mantém o Catálogo Global de Produtos.
*   **RF-03.2:** O Gestor seleciona produtos do catálogo e define o preço de oferta para sua loja.

### 3.4 RF-04 — Encartes Virtuais Temáticos
*   **RF-04.1:** O Admin cadastra **Temas Sazonais** (Assets gráficos e cores de fundo).
*   **RF-04.2:** O Gestor cria um **Encarte Digital** associando um Tema e uma lista de Ofertas.
*   **RF-04.3:** O sistema gera um preview do encarte mesclando Whitelabel (Loja) + Tema (Sazonal).

### 3.5 RF-05 — Notificações e Geolocalização
*   **RF-05.1:** O sistema deve identificar a localização do Cliente.
*   **RF-05.2:** Disparo de notificações push (RabbitMQ) quando o cliente entra no raio de atuação de um supermercado com ofertas ativas.

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
