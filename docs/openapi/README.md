# 📄 Contratos OpenAPI — SmartMarket

> **Versão:** 2.0.0 | **Fase:** MVP

Este diretório organiza os contratos **OpenAPI 3.0** da plataforma SmartMarket, garantindo alinhamento técnico absoluto entre a documentação de referência das APIs, o roteamento do API Gateway, os controladores Spring Boot e o SPA Angular.

Todos os contratos ativos foram atualizados e revisados para corresponder às rotas de produção reais (em português) e à assinatura precisa de seus parâmetros e schemas.

---

## ✅ Contratos MVP (Implementação Ativa)

| Arquivo | Módulo | Responsabilidade Técnica |
| :--- | :--- | :--- |
| [`auth-service.openapi.yaml`](./auth-service.openapi.yaml) | `auth` | Login JWT, renovação de tokens (refresh), criação e alteração de status de usuários (`ADMIN`, `GESTOR`). |
| [`supermarket-service.openapi.yaml`](./supermarket-service.openapi.yaml) | `supermarket` | Cadastro de lojas, whitelabel de marcas, upload de logos, geolocalização e busca pública por CEP/GPS. |
| [`product-service.openapi.yaml`](./product-service.openapi.yaml) | `product` (catalog + offers + flyers) | Curadoria de produtos base, criação de ofertas limitadas, temas sazonais e publicação de encartes. |
| [`concierge-service.openapi.yaml`](./concierge-service.openapi.yaml) | `concierge` | Fila de digitalização assistida, locks de conciliação por atendente, aprovações, rejeições e contestação via réplicas. |
| [`analytics-service.yaml`](./analytics-service.yaml) | `analytics` | Rastreamento de visualizações de encartes e leituras de QR Codes de totens para métricas básicas. |

---

## ⚠️ Contratos Pós-MVP

Para especificações planejadas para futuras fases de expansão da plataforma, consulte o diretório [`posmvp/`](./posmvp/README.md).

> **Aviso Importante**: Não implementar os contratos pós-MVP até a validação das hipóteses de negócio H1, H2 e H3 do Product-Led Growth (PLG).
