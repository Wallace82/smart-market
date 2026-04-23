# Quality Gates — Smart Market

> Fonte única de regras de qualidade. Referenciado por QUALITY-GATES.md

## Gates obrigatórios (todo PR)

### 1. Build e lint

- `ng build` deve passar
- `ng lint` deve passar

### 2. Testes (Vitest)

- `ng test` deve passar
- Código novo ou alterado deve ter testes

### 3. Anti-patterns Angular 21 (BLOCKERS)

Rejeitar o PR se **qualquer** um dos itens abaixo aparecer em arquivos alterados:

- `constructor(private` ou `constructor(readonly` → usar `inject()`
- Propriedade `template` com HTML inline (string no TypeScript) → usar `templateUrl` com arquivo `.html` separado
- `*ngIf`, `*ngFor`, `*ngSwitch` → usar `@if`, `@for`, `@switch`
- `@Input()`, `@Output()` (decorators) → usar `input()`, `output()`
- `BehaviorSubject` para estado local → usar `signal()`
- `standalone: true` explícito → remover (é o padrão)
- Imports Jest/Karma → usar Vitest

### 4. Design System

- Sem cores hardcoded (hex/rgb)
- Tokens smart-market para cores, espaçamento, tipografia e raio (border-radius)
- Respeitar os principios de designsystem

### 5. Segurança / LGPD

- Sem secrets no código
- Sem PII em `console.log` ou em logs
- Sem dados sensíveis em `localStorage`

## Gates condicionais

### OpenAPI (se contratos alterados)

- Spec válida em OpenAPI 3.1
- `securitySchemes` presentes
- Paginação segue o padrão do projeto
- `BACKEND-NOTES.md` atualizado
- Breaking changes sinalizadas

### Domínios sensíveis à LGPD (cadastro, saude, disciplinar, pagamento, restricao-medica, aptidao-fisica)

- CPF mascarado na exibição
- Dados de saúde/disciplinares com restrição por papéis (roles)
- Formulários com campos sensíveis devidamente configurados

## Severidades

- **Blocker**: anti-patterns, falha de build, testes ausentes → rejeitar PR
- **Major**: violação do Design System, problema LGPD → corrigir antes do merge
- **Minor**: nomenclatura, lacuna de documentação → corrigir ou criar follow-up
