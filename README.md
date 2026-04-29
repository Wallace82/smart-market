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
    - Criação de Encartes com **Smartphone Preview** (Visualização em tempo real).
    - Busca inteligente e seleção de ofertas.
- **Client Features**:
    - Visualizador de Encarte Imersivo em **Estilo Tabloide de Varejo**.
    - Layout responsivo (1 a 4 colunas) com selos de preço dinâmicos.
    - Rodapé informativo com dados de contato e validade.

## Como Executar

### 1. Preparar o Backend (Compilação)
O Dockerfile espera que os pacotes `.jar` já tenham sido gerados. Antes de subir o ambiente, você deve compilar todos os microserviços.

Na raiz do diretório `backend/`:
```bash
./mvnw clean package -DskipTests
```

### 2. Subir Infraestrutura e Microserviços
Use os scripts em `infra/scripts`:
```powershell
.\infra\scripts\up-local.ps1
```
Isso subirá o PostgreSQL, MinIO, RabbitMQ e todos os microserviços.

### 3. Popular o Banco de Dados (Seed Data)
Para que as telas funcionem com dados de teste (usuário gestor, supermercado modelo, temas e ofertas), rode o script SQL no container do Postgres:
```powershell
Get-Content .\infra\scripts\seed_data.sql | docker exec -i smartmarket-postgres psql -U smartmarket -d smartmarket
```

### 4. Executar o Frontend
1. Vá para `frontend/smartmarket-web`
2. Instale as dependências: `npm install`
3. Inicie com a configuração de proxy:
```bash
ng serve --proxy-config proxy.conf.json
```
4. Acesse `http://localhost:4200/login`
   - **Login:** `gestor@smartmarket.com`
   - **Senha:** `password`

## 🎨 Design System & 🧱 Arquitetura Frontend

O projeto segue diretrizes visuais e uma arquitetura modular robusta no frontend (Angular):
* **Design System:** Focado em conversão e experiência de varejo, utilizando Tailwind CSS e Angular Material. [Veja mais detalhes aqui](./docs/design-system.md).
* **Arquitetura Frontend:** Orientada a domínios (`features/`) e reatividade com Signals. [Veja mais detalhes aqui](./docs/frontend-architecture.md).

## Documentação Técnica
* 📄 [Requisitos Funcionais](./docs/REQUIREMENTS.md)
* 🎨 [Design System](./docs/design-system.md)
* 🧱 [Arquitetura do Frontend](./docs/frontend-architecture.md)
