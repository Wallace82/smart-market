# 🎨 SmartMarket - Design System

Este documento define as diretrizes visuais e de interface para garantir consistência em toda a plataforma SmartMarket (SaaS B2B2C).

---

## 1. 🎨 Paleta de Cores

A paleta foi desenhada para transmitir um ar tecnológico e moderno (Indigo) sem perder a essência do varejo e supermercados (Verde/Laranja).

### Cores Principais
| Nome | HEX | Variável CSS | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **Primary (Indigo)** | `#4f46e5` | `--color-primary` | Botões principais, Header, Destaques SaaS. |
| **Primary Dark** | `#3730a3` | `--color-primary-dark` | Hover em botões primários. |
| **Secondary (Emerald)** | `#10b981` | `--color-secondary` | Elementos de varejo, ícones de sucesso, badges. |
| **Accent (Orange)** | `#f59e0b` | `--color-accent` | Alertas de promoção, botões de ação secundária. |

### Neutras e Fundo (Backgrounds & Surfaces)
| Nome | HEX | Variável CSS | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **Background Base** | `#f3f4f6` | `--color-bg-base` | Fundo principal (telas cinza claro). |
| **Surface (Cards)** | `#ffffff` | `--color-surface` | Fundo de modais, cards e formulários. |
| **Border Light** | `#e5e7eb` | `--color-border` | Divisores de tabela, bordas de input. |

### Tipografia (Textos)
| Nome | HEX | Variável CSS | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **Text Title** | `#111827` | `--color-text-title` | Títulos (H1, H2), destaque máximo. |
| **Text Body** | `#4b5563` | `--color-text-body` | Parágrafos e textos gerais. |
| **Text Muted** | `#9ca3af` | `--color-text-muted` | Labels de input, placeholders, textos auxiliares. |

---

## 2. 🔤 Tipografia

O projeto utiliza a família tipográfica **Inter** (ou Roboto, padrão do Material), focada em legibilidade e interfaces SaaS.

*   **Fonte Principal:** `Inter`, sans-serif
*   **Pesos:**
    *   `Regular (400)`: Corpo de texto.
    *   `Medium (500)`: Botões e subtítulos.
    *   `Bold (700)`: Títulos principais de cards.
    *   `Black (900)`: Logo e cabeçalhos de alto impacto (Hero).

---

## 3. 📏 Espaçamento, Layout e Grid

Utilizamos o **Sistema de Grid de 8px** (padrão Tailwind). Isso garante que o ritmo vertical e horizontal seja sempre harmônico.

*   **Espaçamentos (Padding/Margin):** `8px`, `16px`, `24px`, `32px`, `48px`, `64px`.
*   **Border Radius:**
    *   `--radius-sm` (4px): Checkboxes e tags pequenas.
    *   `--radius-md` (8px): Inputs, botões padrão.
    *   `--radius-lg` (16px): Cards principais, modais.
*   **Sombras (Elevation):**
    *   `--shadow-sm`: Elementos clicáveis (botões).
    *   `--shadow-md`: Cards, Dropdowns e Modais.

---

## 4. 📦 Componentes Padrão

### Botões
*   **Primary:** Fundo `--color-primary`, texto branco, border-radius `8px`, sem borda.
*   **Secondary:** Fundo transparente, borda de `1px solid --color-border`, texto `--color-text-title`.
*   **Disabled:** Fundo `#e5e7eb`, texto `#9ca3af`, cursor `not-allowed`.

### Inputs e Formulários
*   Estilo visual "Outline" do Angular Material.
*   Foco: Borda muda para `--color-primary`.
*   Fundo interno: Branco (`--color-surface`).

### Cards
*   Fundo: `--color-surface` (Branco).
*   Borda: `1px solid --color-border`.
*   Sombra: `--shadow-md`.
*   Border-radius: `--radius-lg`.

---

## 5. 🎯 Boas Práticas

*   **NUNCA use cores Hardcoded** no código (ex: `color: #ff0000`). Use as variáveis CSS configuradas em `styles.scss` ou as classes semânticas do Tailwind.
*   Sempre mantenha os estados de *Loading* e *Error* padronizados em todos os formulários.
*   Utilize Empty States criativos com fundo pontilhado/tracejado e ícones em escala de cinza (`--color-text-muted`).