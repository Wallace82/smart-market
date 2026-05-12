# ⚠️ Contratos Pós-MVP — SmartMarket

> Estes contratos definem funcionalidades **planejadas e documentadas**, mas **fora do escopo do MVP**.
> Nenhum endpoint aqui deve ser implementado nas Fases 1–4 do Roadmap.
> Priorizar após confirmação das hipóteses **H1, H2 e H3** (ver `REQUIREMENTS.md` seção 1.4).

---

## 📦 Arquivos neste diretório

| Arquivo | Funcionalidade | Depende de |
|---|---|---|
| `client-service.openapi.yaml` | Perfil de consumidor (ROLE_CLIENTE), favoritos, lista de compras | Fase pós-MVP: cadastro de clientes |
| `billing-service.openapi.yaml` | Planos SaaS, assinaturas, free trial 14 dias, limites por plano | Gateway de pagamentos (PIX/Cartão) |
| `notification-service.openapi.yaml` | Campanhas de push, geofencing, frequency capping, histórico de entregas | RabbitMQ, Ionic/Capacitor (mobile nativo) |
| `notification-service.yaml` | Versão alternativa do notification-service com triggers de geofence e campanhas por proximidade | RabbitMQ, Redis Geospatial avançado |
| `recommendation-service.openapi.yaml` | Motor de recomendação por IA, perfil de interesses, predição de recompra | Analytics avançado, ML pipeline |
| `product-service.yaml` | Versão alternativa do product-service com cache Geohash e resolução de totem QR Code | Redis Geospatial, X-Anonymous-Id tracking |

---

## 🗺️ Quando implementar?

| Fase | Gatilho |
|---|---|
| **client-service** | Após validar H2 (consumidores adotam encarte) — habilitar cadastro e favoritos |
| **billing-service** | Após 3+ supermercados pagantes confirmados (H1 validada) |
| **notification-service** | Após billing ativo — push é feature de planos pagos |
| **recommendation-service** | Após analytics coletar dados suficientes (mín. 30 dias de produção) |

---

> 💡 Os contratos foram preservados para facilitar a retomada futura sem perda de contexto.
> Baseado no backlog documentado em `REQUIREMENTS.md` seção 12.
