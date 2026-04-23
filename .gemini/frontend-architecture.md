# 🧱 Frontend Architecture - SmartMarket

## 🎯 Objetivo

Este documento define o padrão arquitetural do frontend Angular do projeto SmartMarket.

Seu objetivo é garantir:

* Organização
* Escalabilidade
* Padronização
* Facilidade de manutenção

---

## 📁 Estrutura do Projeto

```
src/app/
  core/
  features/
    admin/
    client/
    login/
    manager/
      campaigns/
      dashboard/
      flyers/
      marketing/
      offers/
      products/
      settings/
    public/
    template/
    users/
```

---

## 🧩 Organização por Responsabilidade

### 🔹 core/

Contém:

* Serviços globais
* Guards
* Interceptors
* Configurações gerais

---

### 🔹 features/

Contém todos os módulos de negócio organizados por domínio.

---

## 📦 Padrão de Feature

Cada feature deve seguir a estrutura:

```
feature-name/
  components/
  pages/
  services/
  models/
  feature-name.routes.ts
```

---

## 🧱 Componentes

* Reutilizáveis
* Sem lógica de negócio pesada
* Focados em UI

---

## 📄 Pages

* Representam telas
* Ligadas diretamente às rotas

---

## 🔌 Services

* Comunicação com backend ou mocks
* Organização por domínio

---

## 📊 Models

* Tipagens (interfaces/types)

---

## 🧭 Rotas

* Cada módulo possui seu próprio arquivo de rotas
* Exemplo:

    * `manager.routes.ts`
    * `admin.routes.ts`

---

## 🏷️ Convenção de Nomes

* `*.component.ts`
* `*.page.ts`
* `*.service.ts`
* `*.model.ts`
* `*.routes.ts`

---

## ➕ Adicionando Novas Features

Sempre seguir:

```
features/nome-da-feature/
  components/
  pages/
  services/
  models/
  nome-da-feature.routes.ts
```

---

## 🚫 Regras Importantes

❌ Não criar arquivos fora de `features`
❌ Não misturar responsabilidades
❌ Não duplicar código
❌ Não quebrar a estrutura existente

---

## 🚀 Boas Práticas

* Reutilizar componentes
* Manter código limpo
* Seguir padrão existente
* Pensar em escalabilidade

---

## 🎯 Objetivo Final

Manter o SmartMarket organizado, previsível e preparado para crescimento contínuo.
