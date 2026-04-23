# 🧪 Diretrizes de Testes Backend — SmartMarket

Este guia define os padrões para criação de testes unitários e de integração no ecossistema Spring Boot 3 / Java 21 do SmartMarket.

## 1. Ferramentas e Stack
- **JUnit 5:** Framework de teste principal.
- **Mockito:** Para mocking de dependências.
- **AssertJ:** Para asserções fluentes e legíveis.
- **MockMvc:** Para testes de camada Web (Controllers).

## 2. Estratégia por Camada (Clean Architecture)

### 2.1 Camada de Domínio (`domain`)
- **Foco:** Regras de negócio puras e POJOs.
- **Regra:** Proibido usar Mockito ou Spring Context aqui. Use apenas JUnit puro.
- **O que testar:** Cálculos, validações de entidades e regras de agregados.

### 2.2 Camada de Aplicação (`application`)
- **Foco:** Casos de uso (Use Cases/Services).
- **Regra:** Usar `@ExtendWith(MockitoExtension.class)`. Mockar todas as interfaces de repositório e clientes externos.
- **Cenários:** Fluxo feliz e tratamento de exceções de negócio.

### 2.3 Camada de Infraestrutura (`infrastructure`)
- **Web/Controllers:** Usar `@WebMvcTest`. Testar status HTTP, serialização JSON e validações de `@Valid`.
- **Persistence:** Usar `@DataJpaTest`. Testar queries customizadas (JPQL/Native) no PostgreSQL.

## 3. Padrão de Nomenclatura (BDD Style)
Os métodos de teste devem ser descritivos:
`should[ExpectedBehavior]_When[StateUnderTest]`
*Exemplo:* `shouldThrowException_WhenProductPriceIsNegative()`

## 4. Estrutura do Teste (AAA)
1. **Arrange:** Configuração dos mocks e dados.
2. **Act:** Execução do método testado.
3. **Assert:** Verificação do resultado e comportamentos.