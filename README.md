# SmartMarket

Plataforma SaaS B2B2C que conecta supermercados a clientes via encartes digitais, promoções personalizadas e notificações por geolocalização.

## Estrutura do Workspace

```
smartmarket/
├── backend/              # Microserviços Spring Boot (Java 21)
├── frontend/             # Aplicação Angular 18+
├── infra/                # Docker, Docker Compose, CI/CD
└── docs/
    ├── REQUIREMENTS.md   # Requisitos funcionais e não funcionais
    ├── architecture/     # Diagramas e decisões arquiteturais
    └── images/           # Assets de marca e logos
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 21 LTS + Spring Boot 3.4.x, Spring Cloud, Spring Security, JWT |
| Frontend | Angular 18+ + Angular Material + Tailwind CSS + Signals |
| Mensageria | RabbitMQ (Comunicação Assíncrona entre Microserviços) |
| Banco de Dados | PostgreSQL 16+ (Database-per-service) |
| Migração de BD | Flyway |
| Object Storage | MinIO (Imagens de Produtos, Logos e Temas) |
| Containerização | Docker + Docker Compose |

## Status do Projeto (MVP)

### Backend ✅
- `auth-service`: Autenticação JWT e Security.
- `supermarket-service`: Gestão de Supermercados com suporte a Whitelabel (Logos e Cores).
- `product-service`: Gestão de Produtos, Ofertas e Encartes Digitais Temáticos.

### Frontend 🔄 (Em progresso avançado)
- **Autenticação:** Login e gerenciamento de estado com Signals concluído.
- **Portal do Gestor:** 
    - Gestão de Identidade Visual (Cores e Logo) concluída.
    - Listagem e Edição de Encartes concluídas.
    - Criação de Encarte com temas sazonais e seleção de ofertas concluída.
- **Visão do Cliente:** 
    - Visualizador de Tabloide Imersivo (Whitelabel + Temas) concluído.

## Ambiente Local
Utilize os scripts em `infra/scripts` para subir o ambiente completo com Docker Compose.
