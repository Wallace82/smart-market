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
| Backend | Java 21 LTS + Spring Boot 3.x |
| Frontend | Angular 18+ + Angular Material |
| Banco de Dados | PostgreSQL 16+ |
| Containerização | Docker + Docker Compose |
| Testes | JUnit 5 |
| CI/CD | GitHub Actions |

## Perfis de Usuário

- **Admin** — Gestor total da plataforma
- **Gestor Supermercado** — Gerencia produtos, promoções e dashboards
- **Cliente** — Consome promoções e monta lista de compras

## Documentação

- [Requisitos Funcionais e Não Funcionais](./docs/REQUIREMENTS.md)

## Status do Projeto

MVP em definição — Startup / Projeto Pessoal

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
