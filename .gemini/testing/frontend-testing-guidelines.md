# 🧪 Diretrizes de Testes Frontend — SmartMarket

Este documento estabelece as regras para testes no Angular 18+ usando Jasmine e Karma (ou Jest).

## 1. Foco dos Testes

### 1.1 Services (Data & Logic)
- **Prioridade Máxima.** Testar lógica de transformação de dados e integração com API.
- **Mocks:** Usar `HttpTestingController` para simular respostas do backend sem chamadas reais.
- **Signals:** Validar se os `computed` signals reagem corretamente às mudanças de estado.

### 1.2 Components (UI & Interaction)
- **Componentes Shared:** Testar inputs/outputs e renderização condicional.
- **Pages:** Testar se as ações do usuário (cliques) disparam os métodos corretos nos serviços.
- **Regra:** Evitar testar detalhes de CSS; focar no comportamento do DOM.

## 2. Padrões de Implementação

### 2.1 Setup com `TestBed`
Sempre configurar o `TestBed` para cada suíte de testes, injetando mocks em vez de serviços reais para evitar dependências de rede.

### 2.2 SpyOn e Mocks
- Use `spyOn(service, 'method').and.returnValue(...)` para isolar a unidade de teste.
- Prefira criar `Mocks` manuais para serviços complexos.

## 3. Cobertura Mínima
- **Services:** 90% de cobertura de ramificação.
- **Guards e Interceptors:** 100% de cobertura (são críticos para segurança).
- **Utils/Pipes:** 100% de cobertura.

## 4. Exemplo de Estrutura de Teste
```typescript
describe('OfferService', () => {
  let service: OfferService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OfferService]
    });
    service = TestBed.inject(OfferService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should calculate discount correctly', () => {
    // Arrange & Act & Assert
  });
});