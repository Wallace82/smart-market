# 🏛️ Arquitetura Técnica — SmartMarket MVP

> **Versão:** 2.0.0
> **Data:** 2026-05-04
> **Status:** MVP — Escopo Validável
> **Alinhado com:** REQUIREMENTS.md v2.0

---

## 1. Visão Geral da Arquitetura

O SmartMarket utiliza uma **Arquitetura de Microserviços**. Esta escolha permite escalabilidade independente dos domínios críticos, isolamento de falhas e especialização tecnológica.

Principais características:
- **Isolamento de Dados:** Cada microserviço gerencia seu próprio schema de banco de dados.
- **Escalabilidade Independente:** Módulos de alto processamento (como o `concierge-service`) podem ser escalados separadamente.
- **Desenvolvimento Descentralizado:** Facilita a manutenção e evolução de domínios específicos sem impactar o sistema como um todo.

> ⚠️ **No MVP, os serviços compartilham a mesma instância de PostgreSQL e RabbitMQ para reduzir custos infraestruturais, mas mantêm isolamento lógico estrito.**

---

## 2. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Backend** | Java 21 LTS + Spring Boot 3.4.x |
| **Frontend** | Angular 18+ + Tailwind CSS + Angular Material + Signals |
| **Segurança** | Spring Security + JWT (stateless) |
| **Banco de Dados** | PostgreSQL 16 — **banco único** |
| **Migração de BD** | Flyway |
| **Object Storage** | MinIO (compatível com S3) |
| **Cache** | Redis (cache de catálogo, ofertas e dados geoespaciais simples) |
| **Containerização** | Docker + Docker Compose |
| **Documentação de API** | OpenAPI 3.0 (Swagger UI via SpringDoc) |

> **Removido do MVP:** Ionic/Capacitor, API Gateway Spring Cloud, RabbitMQ, Prometheus/Grafana, OpenTelemetry/Jaeger, ELK Stack, Kubernetes.

---

## 3. Estrutura de Microserviços (Backend)

O ecossistema de backend é composto pelos seguintes serviços independentes:

*   **`auth-service`**: Responsável por autenticação, controle de acesso (RBAC) e gestão de usuários.
*   **`product-service`**: Core business, gerindo Catálogo Global, Ofertas, Encartes e Temas Sazonais.
*   **`concierge-service`**: Gerencia a operação assistida, upload de listas, **Fila Inteligente** e auditoria.
*   **`billing-service`**: Módulo de assinaturas e faturamento (integração com gateways de pagamento).
*   **`api-gateway`**: (Em evolução) Ponto de entrada único para o ecossistema.

### 3.1 Banco de Dados

- **Um único banco PostgreSQL** com schemas organizados por módulo quando conveniente.
- Isolamento lógico garantido por convenção de nomenclatura de tabelas (prefixo por módulo).
- Migrações versionadas via **Flyway**.

```
PostgreSQL (único banco)
├── schema: auth       → users
├── schema: supermarket → supermarkets
├── schema: catalog     → categories, products
├── schema: offer       → offers
├── schema: flyer       → flyers, flyer_offers, themes
└── schema: analytics   → events
```

---

## 4. Padrões Arquiteturais do Backend

### 4.1 Clean Architecture (por módulo)

Cada módulo interno segue a separação em camadas:

```
[módulo]/
├── domain/
│   ├── model/         → Entidades de domínio puras (sem JPA, sem Spring)
│   ├── repository/    → Interfaces de repositório (ports)
│   └── exception/     → Exceções de domínio
├── application/
│   ├── usecase/       → Casos de uso (regras de negócio)
│   └── dto/           → DTOs de entrada e saída
└── infrastructure/
    ├── persistence/   → Entidades JPA, Spring Data Repos, Mappers (MapStruct)
    ├── web/           → Controllers REST, GlobalExceptionHandler
    └── storage/       → Adaptador MinIO (apenas no módulo storage)
```

**Regra:** O `domain` é 100% livre de dependências de infraestrutura. MapStruct converte `Domain ↔ DTO ↔ JPA Entity`.

### 4.2 Stateless Authentication (JWT)

- O `auth` module valida credenciais e emite tokens JWT com `userId`, `email` e `role`.
- Roles suportados no MVP: `ROLE_ADMIN`, `ROLE_GESTOR`.
- Rotas públicas (`/api/v1/public/**`) são liberadas sem autenticação (RF-01.4).
- Um `JwtAuthFilter` no `SecurityFilterChain` valida o token a cada requisição.

### 4.3 Injeção de Dependências

- Construtor injection via Lombok `@RequiredArgsConstructor` em todos os componentes.
- Sem field injection (`@Autowired`).

---

## 5. Diagrama de Alto Nível

```
┌──────────────────────────────────────────────────────┐
│              Frontend Angular 18+                     │
│         (Mobile-First / SPA / Signals)                │
└─────────────────────────┬────────────────────────────┘
                          │ HTTP REST (JSON)
┌─────────────────────────▼────────────────────────────┐
│                    API Gateway / Reverse Proxy        │
└──────────────┬──────────────┬──────────────┬─────────┘
               │              │              │
    ┌──────────▼───┐  ┌───────▼──────┐  ┌────▼─────────┐
    │ auth-service │  │product-servic│  │concierge-serv│
    └──────────────┘  └──────────────┘  └──────────────┘
               │              │              │
          PostgreSQL        MinIO          Redis
       (Schemas Sep.)      (Object)       (Cache)
```

---

## 6. Gestão de Arquivos e Imagens (MinIO)

Buckets organizados por tipo de asset (RNF-02):

| Bucket | Conteúdo | Módulo responsável |
|---|---|---|
| `smartmarket-products` | Imagens do catálogo global de produtos | `catalog` / `storage` |
| `smartmarket-brands` | Logomarcas dos supermercados (Whitelabel) | `supermarket` / `storage` |
| `smartmarket-themes` | Assets decorativos dos Temas Sazonais | `flyer` / `storage` |

**Fluxo de upload:** Controller recebe `MultipartFile` → `storage` module persiste no MinIO → retorna URL pública → URL é salva na entidade correspondente no PostgreSQL.

**Leitura:** O Frontend consome a URL pública diretamente do MinIO, sem tráfego adicional na API.

---

## 7. Customização Visual — Whitelabel e Temas Sazonais

O encarte digital mescla dois layers de identidade visual (RF-05.3):

1. **Whitelabel da Loja** (`supermarket` module):
   - `logoUrl` → MinIO bucket `smartmarket-brands`
   - `primaryColorHex` e `secondaryColorHex` → definidos pelo Gestor

2. **Tema Sazonal** (`flyer` module):
   - `backgroundImageUrl` → MinIO bucket `smartmarket-themes`
   - `backgroundColorHex` → definido pelo Admin

3. **Composição no Frontend:**
   O Angular aplica as cores da loja como variáveis CSS customizadas (`--color-primary`, `--color-secondary`) e renderiza o background do tema como layer decorativo. A composição é feita inteiramente no client-side, sem processamento de imagem no servidor.

---

## 8. Geolocalização Simplificada (RF-06)

No MVP, a geolocalização é implementada com **cálculo de distância euclidiana simples** no PostgreSQL, sem Redis Geospatial avançado.

**Estratégia:**

```sql
-- Filtro por raio usando fórmula de Haversine simplificada via PostgreSQL
SELECT *, 
  (6371000 * acos(cos(radians(:lat)) * cos(radians(latitude))
   * cos(radians(longitude) - radians(:lng))
   + sin(radians(:lat)) * sin(radians(latitude)))) AS distance_meters
FROM supermarkets
WHERE status = 'ATIVO'
HAVING distance_meters <= :radiusMeters
ORDER BY distance_meters ASC;
```

**Fluxos:**
- **GPS disponível (RF-06.1/06.2):** Frontend solicita coordenadas via `navigator.geolocation` → envia `lat/lng` para `GET /api/v1/public/supermarkets/nearby`.
- **GPS negado (RF-06.3):** Usuário informa CEP ou bairro → `GET /api/v1/public/supermarkets/by-location` → API consulta endereço no banco.

> ⚠️ **Fora do escopo MVP:** Redis Geospatial avançado, Geohash, geofencing, tracking em background.

---

## 10. Fila Inteligente e Operação Assistida (`concierge-service`)

O microserviço de Concierge utiliza um algoritmo de priorização dinâmica para otimizar o atendimento operacional.

### 10.1 Score de Prioridade Dinâmico
A prioridade é calculada considerando:
- **Urgência (SLA):** Peso 0.4 (proximidade do deadline).
- **Plano do Cliente:** Peso 0.3 (VIP/Premium primeiro).
- **Tempo de Espera:** Peso 0.2 (evita starvation).
- **Complexidade:** Peso 0.1 (penaliza itens muito grandes para balanceamento).

### 10.2 Lock de Atendimento
Para garantir atomicidade, o sistema implementa um **Lock Transacional**:
- Ao assumir um chamado, o status muda para `EM_PROCESSAMENTO` e o `atendenteId` é vinculado.
- Qualquer tentativa concorrente de assumir o mesmo chamado resulta em conflito (`HTTP 409`).

---

## 10. Analytics Essencial (RF-08)

O módulo `analytics` persiste eventos simples no PostgreSQL. **Não há sistema de streaming ou fila no MVP.**

| Evento | Trigger | RF |
|---|---|---|
| `FLYER_VIEW` | Frontend chama `POST /public/analytics/events` ao renderizar encarte | RF-08.1 |
| `QR_CODE_SCANNED` | Frontend chama `POST /public/analytics/events` ao detectar `utm_source=totem` | RF-08.2 |

O **Dashboard do Gestor** (RF-08.3) é servido por queries agregadas simples no PostgreSQL com filtro de período.

> ⚠️ **Fora do escopo MVP:** Heatmaps, funis de conversão, tracking de sessão anônima, footfall attribution, analytics comportamental avançado.

---

## 11. Estratégia de Cache (Redis — Simplificada)

No MVP, o Redis é utilizado apenas para **cache de leitura das rotas públicas mais acessadas**, sem complexidade de invalidação reativa.

| Dado em cache | TTL | Chave |
|---|---|---|
| Lista de supermercados próximos | 60s | `nearby:{geohash_nivel5}` |
| Encarte ativo de uma loja | 120s | `flyer:active:{supermarketId}` |
| Catálogo de categorias | 300s | `categories:all` |

**Invalidação:** Por TTL simples. Ao publicar ou encerrar um encarte, o módulo `flyer` invalida explicitamente a chave `flyer:active:{supermarketId}` via `@CacheEvict`.

> ⚠️ **Fora do escopo MVP:** Invalidação reativa via RabbitMQ, cache multi-layer com ETag no Gateway, Geohash avançado.

---

## 12. Estrutura do Frontend Angular

O projeto Angular é organizado de forma modular com **Lazy Loading** por feature:

```
src/app/
├── core/
│   ├── guards/        → AuthGuard, RoleGuard
│   ├── interceptors/  → JwtInterceptor (adiciona Bearer token)
│   └── services/      → AuthService, GeoService
│
├── features/
│   ├── auth/          → Login, recuperação de senha
│   ├── admin/
│   │   ├── supermarkets/  → Cadastro e aprovação de lojas
│   │   ├── catalog/       → Catálogo global de produtos e categorias
│   │   └── themes/        → Gestão de Temas Sazonais
│   ├── manager/
│   │   ├── dashboard/     → Métricas básicas (RF-08.3)
│   │   ├── whitelabel/    → Logo, cores, endereço (RF-02)
│   │   ├── offers/        → Ofertas da loja (RF-04)
│   │   ├── flyers/        → Encartes digitais (RF-05)
│   │   └── qrcode/        → Visualização e download do QR Code (RF-07)
│   └── storefront/        → Vitrine pública (anônima ou autenticada)
│       ├── home/          → Supermercados e ofertas por localização
│       └── flyer-view/    → Visualização imersiva do encarte (RF-05.4)
│
├── shared/
│   ├── components/    → Skeleton screens, empty-state, cards
│   ├── pipes/         → CurrencyBRL, DatePT
│   └── directives/    → WhitelabelTheme (aplica CSS vars da loja)
│
└── assets/
```

**Regras de UX:**
- **Skeleton Screens** em todos os carregamentos de dados remotos.
- Variáveis CSS customizadas (`--primary`, `--secondary`) injetadas via `WhitelabelTheme` directive para renderização do encarte.
- **Mobile-First**: breakpoints `sm` → `md` → `lg`.
- Conteúdo público servido via cache Redis → carregamento < 300ms (RNF-01).

---

## 13. Fluxo de Segurança

```
[Usuário]
   │
   ├─ POST /api/v1/auth/login  {email, password}
   │         │
   │    [auth module]
   │    valida senha (BCrypt) → gera JWT {userId, email, role}
   │         │
   │    retorna {accessToken, refreshToken}
   │
   └─ Próximas requisições: Authorization: Bearer <token>
             │
        [JwtAuthFilter]
        valida assinatura → extrai role → SecurityContext
             │
        [Controller] → verifica @PreAuthorize("hasRole('ADMIN')")
```

**Rotas públicas** (`/api/v1/public/**`) são excluídas do filtro JWT no `SecurityFilterChain`.

---

## 14. Roadmap Arquitetural (Pós-MVP)

Após validação das hipóteses H1, H2 e H3:

| Fase | Evolução |
|---|---|
| **Extração de Serviços** | Separar módulos em microserviços independentes (database-per-service) |
| **API Gateway** | Introduzir Spring Cloud Gateway para roteamento, rate limiting e CORS central |
| **Mensageria** | Introduzir RabbitMQ para EDA: invalidação de cache reativa, notificações push |
| **Observabilidade** | Prometheus + Grafana, OpenTelemetry + Jaeger, ELK Stack |
| **Mobile Nativo** | Ionic/Capacitor para push notifications e background geolocation |
| **Billing** | Módulo de assinaturas com gateway de pagamentos (PIX, Cartão) |
