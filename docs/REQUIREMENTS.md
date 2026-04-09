# 📋 SmartMarket — Documento de Requisitos

> **Versão:** 1.2.0
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

O **SmartMarket** é uma plataforma SaaS web responsiva do modelo **B2B2C**, que conecta supermercados a seus clientes por meio de encartes digitais, promoções personalizadas e notificações por geolocalização. O sistema opera com um catálogo base unificado de produtos.

### 1.2 Problema que Resolve

| Problema | Impacto |
|---|---|
| Encartes impressos em papel | Desperdício ambiental e custo elevado |
| Dificuldade de divulgação dos supermercados | Perda de clientes e oportunidades |
| Trabalho manual e duplicado no cadastro de produtos | Perda de tempo dos gestores de supermercado |
| Falta de flexibilidade para o cliente final | Dificuldade em montar lista de compras mais barata |

### 1.3 Proposta de Valor

*   **Para CLIENTES:** Promoções do supermercado mais próximo + recomendações personalizadas.
*   **Para SUPERMERCADOS:** Catálogo de produtos pronto (basta colocar o preço) + atração de clientes próximos.
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
| **Admin** (ROLE_ADMIN) | Gestor total da plataforma SmartMarket. Responsável pelo negócio SaaS e pelo **Catálogo Global de Produtos**. | Painel administrativo global (Backoffice). |
| **Gestor Supermercado** (ROLE_GESTOR) | Responsável pela operação comercial de um ou mais supermercados. Apenas consulta o catálogo para adicionar seu próprio preço/oferta. | Painel do estabelecimento (Dashboard Loja). |
| **Cliente** (ROLE_CLIENTE) | Usuário final (consumidor) das promoções. | App web responsivo / Mobile-first. |

### 2.2 Especificação dos Dashboards

A interface de cada usuário será adaptada para suas necessidades operacionais:

#### 1. Dashboard Admin (Visão Global da Plataforma)
*   **Métricas Principais:**
    *   Total de Produtos no Catálogo Global.
    *   Total de Supermercados Ativos vs Inativos.
    *   MRR (Monthly Recurring Revenue) estimado baseado nos planos ativos.
*   **Ações e Gráficos:**
    *   **Gestão de Catálogo:** Aprovar e incluir novos produtos com suas imagens padrão no MinIO.
    *   Gráfico de crescimento de novas assinaturas (Mês a Mês).
    *   Tabela de supermercados com plano vencendo nos próximos 7 dias.

#### 2. Dashboard Gestor Supermercado (Visão da Loja)
*   **Métricas Principais:**
    *   Total de produtos do catálogo vinculados à sua loja (Produtos Ofertados).
    *   Visitas ao encarte ativo atual.
    *   Total de vezes que produtos da loja foram adicionados em listas de compras.
*   **Ações e Gráficos:**
    *   Ranking: "Top 5 Produtos mais Favoritados/Visualizados".
    *   Gráfico "Horários de Pico".
    *   Mapa de calor de acessos por bairro.

#### 3. Visão do Cliente (App)
*   **Home Personalizada:** Banners de mercados próximos, carrossel de recomendações e botão de lista de compras.

---

## 3. Requisitos Funcionais

### RF-01 — Autenticação e Autorização
| ID | Descrição | Perfil | Prioridade |
|---|---|---|---|
| RF-01.1 | Login com e-mail e senha via JWT | Todos | Alta |
| RF-01.2 | Refresh token com expiração configurável | Todos | Alta |
| RF-01.3 | Controle de acesso por perfil (RBAC) | Todos | Alta |

### RF-02 — Gestão de Supermercados (Admin)
| ID | Descrição | Prioridade |
|---|---|---|
| RF-02.1 | CRUD completo de supermercados | Alta |
| RF-02.2 | Ativação e inativação de supermercados | Alta |

### RF-03 — Catálogo Base Global (Admin) — *Nova Regra Core*

| ID | Descrição | Prioridade |
|---|---|---|
| RF-03.1 | **CRUD de Produtos Base:** Admin cadastra os produtos globais (Nome, Marca, Unidade de Medida, Peso/Volume, Categoria). | Alta |
| RF-03.2 | **Upload de Imagens para o MinIO:** O Admin faz o upload da imagem padrão do produto, que será salva em um bucket no MinIO. | Alta |
| RF-03.3 | Gestão de Categorias base (Hortifruti, Limpeza, Açougue, etc). | Alta |
| RF-03.4 | O Gestor de Supermercado **não pode** criar novos produtos livremente, ele deve solicitar ao Admin caso falte no catálogo base. | Média |

### RF-04 — Ofertas e Encartes (Gestor Supermercado)

| ID | Descrição | Prioridade |
|---|---|---|
| RF-04.1 | **Associação de Preço (Oferta):** O Gestor busca um Produto Base no catálogo global e cria uma Oferta vinculando o seu preço (Preço Normal ou Promocional) a ele. | Alta |
| RF-04.2 | Publicação de encarte digital (conjunto de Ofertas). | Alta |
| RF-04.3 | Histórico de publicações anteriores e agendamento futuro. | Média |

### RF-05 — Push Notifications por Geolocalização e Campanhas

*(... Ver fluxo detalhado de Geofencing documentado na versão 1.1 ...)*

---

## 4. Requisitos Não Funcionais

*(... Requisitos gerais de Performance e Segurança da V1 mantidos ...)*

### RNF-08 — Armazenamento de Arquivos
| ID | Descrição |
|---|---|
| RNF-08.1 | As imagens dos produtos do Catálogo Global devem ser obrigatoriamente armazenadas no **MinIO** (Object Storage compatível com S3 API). |
| RNF-08.2 | As URLs das imagens salvas no MinIO devem ser públicas para leitura no Frontend. |

---

## 5. Modelagem de Domínio (Revisada V1.2)

### 5.1 Entidades Críticas Atualizadas

Para acomodar a regra do Catálogo Global vs. Oferta do Supermercado:

| Entidade | Descrição de Negócio | Atributos Principais |
|---|---|---|
| **ProdutoBase (Catálogo Global)** | Produto único gerenciado pelo Admin (fica no `product-service`). | id, nome, descricao, marca, unidadeMedida (kg, L, un), pesoVolume, urlImagem (MinIO), categoriaId, ativo |
| **OfertaSupermercado** | Preço atribuído pelo Supermercado a um Produto Base. | id, supermercadoId, produtoBaseId, precoAtual, precoPromocional, validadePromocao, ativo |
| **EncarteItem** | Associação entre o encarte digital e uma OfertaSupermercado. | id, encarteId, ofertaId, destaque |

### 5.2 Regras de Negócio Revisadas

| ID | Regra |
|---|---|
| RN-06 | *Removida/Alterada* |
| RN-06.1 | O **ProdutoBase** pertence à Plataforma (Admin). Supermercados apenas consomem esse catálogo. |
| RN-06.2 | A URL da imagem do produto deve apontar para o bucket do MinIO do `product-service`. |
| RN-06.3 | Um Supermercado não pode ter mais de uma **OfertaSupermercado** ativa para o mesmo **ProdutoBase** ao mesmo tempo sem sobreposição de datas. |

---

## 6. Stack Tecnológica Atualizada

| Camada | Tecnologia |
|---|---|
| Backend | Java 21 LTS + Spring Boot 3.x |
| Frontend | Angular 18+ + Angular Material |
| Armazenamento de Arquivos | **MinIO (S3 Compatible)** *(Adicionado)* |
| Banco de Dados | PostgreSQL 16+ |
| Comunicação | RabbitMQ (Assíncrono) + Feign (Síncrono) |
| Containerização | Docker + Docker Compose |

---
*(O restante das seções — Arquitetura, Microserviços, Estrutura de Pastas — permanece conforme as versões anteriores).*
