# Arquitetura Frontend - SmartMarket

Este documento detalha a estrutura técnica e as decisões arquiteturais da aplicação frontend do SmartMarket (Angular 18+).

## 🏗️ Estrutura de Pastas

A aplicação segue uma organização orientada a domínios e responsabilidades:

```
src/app/
├── core/                 # Singleton Services, Models, Guards, Interceptors
│   ├── auth/             # Autenticação e gestão de usuário
│   ├── models/           # Interfaces TypeScript globais
│   └── services/         # Serviços de API (Encarte, Oferta, Supermarket)
├── features/             # Módulos funcionais da aplicação
│   ├── admin/            # Funcionalidades administrativas do SaaS
│   ├── manager/          # Dashboard e ferramentas para o Gestor da Loja
│   │   ├── dashboard/    # Visualizadores e métricas
│   │   ├── flyers/       # Gestão de Encartes (Criação/Edição)
│   │   └── settings/     # Configuração de Identidade Visual
│   └── public/           # Páginas de acesso ao consumidor final
├── shared/               # Componentes, Pipes e Directives reutilizáveis
└── template/             # Layouts principais (Main, Auth, etc.)
```

## 🚦 Gestão de Estado com Signals

Utilizamos **Angular Signals** como o padrão primário para reatividade e gestão de estado local e global.

- **Vantagens:** Melhor performance de Change Detection e código mais declarativo.
- **Exemplo de Uso:**
    - `encarteId = signal<string | null>(null)`
    - `ofertasFiltradas = computed(() => ...)`

## 🔌 Integração com API (Serviços)

Os serviços em `core/services/` são responsáveis pela comunicação com os microserviços Spring Boot.

- **EncarteService**: Gestão de encartes digitais e temas sazonais.
- **OfertaService**: Busca e gestão de ofertas de produtos.
- **SupermarketService**: Gestão whitelabel e dados da loja.

## 📱 Fluxo de Encartes Digitais

O módulo de Encartes é o coração do projeto:

1. **Criação (`FlyerCreateComponent`)**:
    - Formulário reativo para metadados (título, validade, tema).
    - Seleção dinâmica de ofertas com filtros de busca.
    - **Smartphone Preview**: Preview em tempo real que reflete instantaneamente o tema e as ofertas selecionadas em um mockup de celular.
2. **Visualização (`FlyerViewerComponent`)**:
    - Experiência mobile-first para o cliente final.
    - Layout de **Tabloide de Varejo** (Grid responsivo de 1 a 4 colunas).
    - Estilização dinâmica baseada no tema sazonal e cores da marca do supermercado.

## 🛠️ Tecnologias Principais

- **Angular 18+** (Standalone Components, Signals, Router)
- **Tailwind CSS** (Estilização utilitária e responsiva)
- **Angular Material** (Componentes de UI e UX de formulários)
- **RxJS** (Comunicação assíncrona com APIs)
