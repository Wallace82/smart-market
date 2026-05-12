# 📄 Contratos OpenAPI — SmartMarket

> **Versão:** 2.0.0 | **Fase:** MVP

Este diretório organiza os contratos OpenAPI 3.0 da plataforma SmartMarket,
separando o que está **em desenvolvimento no MVP** do que está **planejado para o futuro**.

---

## ✅ Contratos MVP (implementar agora)

| Arquivo | Módulo | Responsabilidade |
|---|---|---|
| `auth-service.openapi.yaml` | `auth` | Login JWT, refresh token, criação de usuários (ADMIN, GESTOR) |
| `supermarket-service.openapi.yaml` | `supermarket` | CRUD de lojas, whitelabel, QR Code, vitrine pública por GPS/CEP |
| `product-service.openapi.yaml` | `catalog` + `offer` + `flyer` | Catálogo global, ofertas, temas sazonais, encartes digitais |
| `analytics-service.yaml` | `analytics` | Eventos de visualização de encarte e scan de QR Code, dashboard básico |

---

## ⚠️ Contratos Pós-MVP

Ver pasta [`posmvp/`](./posmvp/README.md) — **não implementar até validação das hipóteses H1, H2 e H3.**
