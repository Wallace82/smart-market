# Design System - SmartMarket

O SmartMarket utiliza um Design System focado em conversão e experiência de varejo, combinando a flexibilidade do **Tailwind CSS** com a robustez dos componentes do **Angular Material**.

## 🎨 Identidade Visual

A paleta de cores foi selecionada para transmitir confiança, frescor e urgência (características do varejo alimentar).

### Cores Base
- **Primária (Verde):** `#16a34a` (Emerald-600) - Transmite frescor e sustentabilidade.
- **Destaque (Laranja/Vermelho):** `#f97316` / `#dc2626` - Utilizado para ofertas, badges de desconto e CTAs.
- **Superfície:** `#ffffff` com tons de cinza claro (`#f8fafc`) para profundidade.

### Whitelabel Dinâmico
O sistema permite que cada supermercado aplique sua própria cor primária e logomarca, que são injetadas dinamicamente via CSS Variables ou `[ngStyle]`.

## 🧱 Componentes de Interface

### 1. Tabloide de Varejo (Flyer Viewer)
Inspirado nos tabloides físicos tradicionais, mas com a interatividade do digital:
- **Splash Price Tags**: Selos circulares em Amarelo/Vermelho para preços.
- **Grades Densas**: Layout de 1 a 4 colunas dependendo do dispositivo.
- **Tipografia de Impacto**: Uso extensivo de pesos `font-black` para títulos e preços.

### 2. Smartphone Mockup (Preview)
Utilizado na tela de criação para fornecer feedback imediato ao gestor:
- Moldura realista de smartphone.
- Simulação de visualização do cliente final.

## 📱 Responsividade
Seguimos a filosofia **Mobile-First**.
- **Mobile (< 768px):** 1 ou 2 colunas de ofertas.
- **Tablet (768px - 1024px):** 2 ou 3 colunas.
- **Desktop (> 1024px):** 3 ou 4 colunas.

## 📐 Tipografia
- **Inter**: Família de fontes padrão para todo o sistema devido à sua excelente legibilidade em telas pequenas e grandes variações de peso.

## ⚡ Utilitários de Design
- **Transições:** `transition-all duration-300` para todos os estados de hover e active.
- **Sombra:** `shadow-xl` e `shadow-2xl` para destacar cards de produtos em cima de fundos temáticos.
- **Glassmorphism:** Uso de `backdrop-blur-md` e `bg-white/10` em cabeçalhos imersivos.
