# 🛠️ Infraestrutura e Ambiente Local — SmartMarket

Este diretório contém a configuração e os scripts necessários para instanciar a infraestrutura local e os microsserviços do **SmartMarket** de forma rápida e padronizada utilizando Docker e PowerShell.

---

## 🏛️ Desenho da Infraestrutura Local

O ecossistema local foi arquitetado para emular o ambiente de produção com baixo consumo de recursos, compartilhando uma única instância do PostgreSQL e Redis, mas isolando logicamente as tabelas por convenção de schemas e nomenclatura de microsserviços.

```
                  [ PORTAL / CONSUMIDOR (Angular) ]
                               │
                HTTP/REST      │ (Port 8080)
                               ▼
                    [ API GATEWAY (Spring Cloud) ]
                               │
        ┌──────────────────────┼──────────────────────┬──────────────────────┐
        │ (Port 8081)          │ (Port 8082)          │ (Port 8083)          │ (Port 8085)
        ▼                      ▼                      ▼                      ▼
  [ auth-service ]     [ supermarket-svc ]     [ product-service ]    [ concierge-svc ]
        │                      │                      │                      │
        └───────────┬──────────┴───────────┬──────────┴───────────┬──────────┘
                    │                      │                      │
              PostgreSQL                 MinIO                  Redis
             (Port 5432)            (Ports 9000/9001)        (Port 6379)
         (Schemas de Serviços)      (Buckets de Assets)       (Cache L2)
```

---

## 🔌 Portas e Endereços de Serviços

| Serviço / Recurso | Porta no Host | Endpoint de Health Check / Acesso | Finalidade |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8080` | `http://localhost:8080` | Ponto de entrada unificado para os microsserviços |
| **Auth Service** | `8081` | `http://localhost:8081/health` | Autenticação, gestão de usuários e segurança JWT |
| **Supermarket Service** | `8082` | `http://localhost:8082/health` | Cadastro de lojas, whitelabel e geolocalização |
| **Product Service** | `8083` | `http://localhost:8083/health` | Catálogo global de produtos, ofertas e encartes |
| **Billing Service** | `8084` | `http://localhost:8084/health` | Gestão de assinaturas, planos de faturamento e limites |
| **Concierge Service** | `8085` | `http://localhost:8085/health` | Operação assistida e fila inteligente com score |
| **PostgreSQL** | `5432` | `localhost:5432` (db: `smartmarket`) | Persistência relacional de todos os microsserviços |
| **Redis** | `6379` | `localhost:6379` | Cache de rotas públicas e cache de catálogo local |
| **MinIO API** | `9000` | `http://localhost:9000` | Armazenamento de imagens (Object Storage) |
| **MinIO Console** | `9001` | `http://localhost:9001` | Interface web de gerência do MinIO |

---

## 📦 MinIO (Object Storage)

O ambiente cria automaticamente os seguintes buckets com acesso público de leitura:
*   `smartmarket-products`: Imagens de produtos cadastrados no Catálogo Global.
*   `smartmarket-brands`: Logomarcas enviadas pelos supermercados para whitelabel.
*   `smartmarket-themes`: Imagens e backgrounds decorativos de temas sazonais.
*   `smartmarket-concierge`: Planilhas, PDFs e imagens enviados pelos gestores para digitação.

### Credenciais Locais do MinIO
*   **Usuário Root:** `admin`
*   **Senha Root:** `password`
*   **Endereço de Acesso (Console Web):** [http://localhost:9001](http://localhost:9001)

---

## 🚀 Scripts de Gerenciamento (PowerShell)

Para facilitar a operação diária do ambiente, criamos scripts utilitários no diretório `infra/scripts/`. 

> [!IMPORTANT]
> Execute estes scripts sempre a partir do PowerShell, na raiz do projeto ou no próprio diretório de infraestrutura.

### 1. Iniciar o Ambiente
Para subir todos os bancos, MinIO, Redis, buckets automatizados e microsserviços:
```powershell
.\infra\scripts\up-local.ps1
```
*   **Forçar Recompilação:** Se você alterou arquivos Dockerfile ou quer recriar as imagens docker:
    ```powershell
    .\infra\scripts\up-local.ps1 -Build
    ```

### 2. Parar o Ambiente
Para parar todos os containers sem apagar os volumes de dados:
```powershell
.\infra\scripts\down-local.ps1
```
*   **Limpeza Total (Reset de Banco/MinIO):** Para remover também os volumes do Postgres, Redis e MinIO (útil para iniciar do zero):
    ```powershell
    .\infra\scripts\down-local.ps1 -RemoveVolumes
    ```

### 3. Reiniciar Serviços
Para reiniciar todo o ambiente:
```powershell
.\infra\scripts\restart-local.ps1
```
*   **Reiniciar um microsserviço específico:**
    ```powershell
    .\infra\scripts\restart-local.ps1 -Service product-service
    ```
*   **Reiniciar e forçar recompilação da imagem:**
    ```powershell
    .\infra\scripts\restart-local.ps1 -Service auth-service -Build
    ```

### 4. Verificar Saúde dos Serviços
Para fazer uma chamada HTTP nos endpoints `/health` de cada microsserviço e validar a integridade da API:
```powershell
.\infra\scripts\check-local.ps1
```

### 5. Verificar Logs
Para acompanhar em tempo real os logs unificados de todos os serviços:
```powershell
.\infra\scripts\logs-local.ps1
```

### 6. Popular Banco de Dados (Seed Data)
Para injetar massa de dados padrão (supermercados de teste, produtos do catálogo global, usuários Admin/Gestor e ofertas iniciais):
```powershell
Get-Content .\infra\scripts\seed_data.sql | docker exec -i smartmarket-postgres psql -U smartmarket -d smartmarket
```

Para injetar dados de teste para a fila do concierge:
```powershell
Get-Content .\infra\scripts\seed_concierge_test.sql | docker exec -i smartmarket-postgres psql -U smartmarket -d smartmarket
```

---

## 🛠️ Resolução de Problemas Comuns

### ❌ Erro: "Dockerfile not found" ao rodar docker compose
*   **Causa:** Os microsserviços utilizam o build local a partir da compilação de seus respectivos pacotes jar.
*   **Solução:** Certifique-se de compilar as dependências no diretório `backend/` antes de rodar o compose:
    ```bash
    cd backend
    ./mvnw clean package -DskipTests
    ```

### ❌ Conexão com o banco Postgres falha ou schemas não criados
*   **Causa:** Os microsserviços sobem antes que o banco esteja 100% pronto para aceitar conexões, fazendo com que as migrações do Flyway falhem na primeira tentativa.
*   **Solução:** O arquivo `docker-compose.local.yml` possui `healthcheck` integrados para aguardar o Postgres e MinIO estarem saudáveis. Caso ocorra erro de concorrência, basta reiniciar o microsserviço afetado:
    ```powershell
    .\infra\scripts\restart-local.ps1 -Service product-service
    ```

### ❌ Buckets do MinIO não aparecem ou imagens não carregam no frontend
*   **Causa:** O container auxiliar `smartmarket-mc` falhou ao se comunicar com a API do MinIO para registrar os buckets.
*   **Solução:** Verifique os logs do container `smartmarket-mc`. Você pode reiniciá-lo individualmente via docker:
    ```bash
    docker compose -f .\infra\compose\docker-compose.local.yml up -d create-bucket
    ```
