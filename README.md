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
    └── prompts/          # Prompts de geração de código por módulo
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 21 LTS + Spring Boot 3.x, Spring Cloud, Spring Security, JWT |
| Frontend | Angular 18+ + Angular Material + Tailwind CSS + Signals |
| Mensageria | RabbitMQ (Comunicação Assíncrona entre Microserviços) |
| Banco de Dados | PostgreSQL 16+ (Database-per-service) |
| Migração de BD | Flyway |
| Object Storage | MinIO (Imagens de Produtos, Logos e Temas) |
| Containerização | Docker + Docker Compose |
| Testes | JUnit 5 + Mockito + Testcontainers |
| CI/CD | GitHub Actions |

## Perfis de Usuário

- **Admin** — Gestor total da plataforma. Gerencia Temas Sazonais e Catálogo Global.
- **Gestor Supermercado** — Gerencia identidade visual (Whitelabel), produtos, promoções e Encartes Digitais.
- **Cliente** — Consome promoções e monta lista de compras.

## Documentação Técnica

* 📄 [Requisitos Funcionais e Não Funcionais](./docs/REQUIREMENTS.md)
* 🏛️ [Arquitetura e Fluxo de Comunicação](./docs/architecture/ARCHITECTURE.md)

## Status do Projeto

Desenvolvimento Ativo - MVP:
- `auth-service`: Autenticação JWT e Security implementados.
- `supermarket-service`: Gestão de Supermercados com suporte a Whitelabel (Logos e Cores) e Integração MinIO concluída.
- `product-service`: Gestão de Produtos, Ofertas e Encartes Digitais Temáticos (Sazonais) com Integração MinIO concluída.

## Ambiente Local (Docker Compose)

Scripts PowerShell disponíveis em `infra/scripts`:

- Subir ambiente: `.\infra\scripts\up-local.ps1`
- Subir com rebuild: `.\infra\scripts\up-local.ps1 -Build`
- Ver status dos containers: `.\infra\scripts\ps-local.ps1`
- Verificar saude dos servicos: `.\infra\scripts\check-local.ps1`
- Ver logs de tudo: `.\infra\scripts\logs-local.ps1`
- Ver logs de um serviço: `.\infra\scripts\logs-local.ps1 -Service auth-service -Follow`
- Reiniciar tudo: `.\infra\scripts\restart-local.ps1`
- Reiniciar um serviço: `.\infra\scripts\restart-local.ps1 -Service api-gateway`
- Reiniciar com rebuild: `.\infra\scripts\restart-local.ps1 -Build`
- Parar ambiente: `.\infra\scripts\down-local.ps1`
- Parar e remover volumes: `.\infra\scripts\down-local.ps1 -RemoveVolumes`
