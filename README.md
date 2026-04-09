# SmartMarket

Plataforma SaaS B2B2C que conecta supermercados a clientes via encartes digitais, promoções personalizadas e notificações por geolocalização.

## Estrutura do Workspace

```
smartmarket/
├── backend/              # Microserviços Spring Boot (Java 21)
├── frontend/             # Aplicação Angular 18+ (Signals, Tailwind, Material)
├── infra/                # Docker, Docker Compose, CI/CD
└── docs/
    ├── REQUIREMENTS.md   # Requisitos funcionais e não funcionais
    ├── architecture/     # Diagramas e decisões arquiteturais
    └── prompts/          # Prompts de geração de código por módulo
```

## Status do Projeto (MVP)

### ✅ Backend (Implementado)
- **auth-service**: Segurança JWT e Autenticação.
- **supermarket-service**: Gestão Whitelabel (Logos/Cores) e Integração MinIO.
- **product-service**: Catálogo Global, Ofertas e Encartes Digitais Temáticos.

### ✅ Frontend (Implementado)
- **Core**: AuthService, SupermarketService, EncarteService, OfertaService (todos usando Signals).
- **Manager Features**: 
    - Gestão de Identidade Visual (Upload de Logo, Seleção de Cores Hex).
    - Listagem, Criação e Edição de Encartes Digitais com Temas Sazonais.
- **Client Features**:
    - Visualizador de Encarte Imersivo (Layout de Tabloide Profissional).

## Como Executar

### Backend & Infra
Use os scripts em `infra/scripts`:
- `.\infra\scripts\up-local.ps1` (Sobe o banco, RabbitMQ, MinIO e Microserviços)

### Frontend
1. Vá para `frontend/smartmarket-web`
2. `npm install`
3. `ng serve`
4. Acesse `http://localhost:4200`

## Documentação Técnica
* 📄 [Requisitos Funcionais](./docs/REQUIREMENTS.md)
* 🏛️ [Arquitetura Técnica](./docs/architecture/ARCHITECTURE.md)
