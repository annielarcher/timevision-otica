# Timevision Ótica — Design Tokens & Sistema de UI

> **Documento de referência para implementação CSS/Tailwind**
> Todos os valores derivam do `TIMEVISION_MANUAL_DE_MARCA.md` e do `TIMEVISION_CONTEXTO_PARA_DESENVOLVIMENTO_WEB.md`.
> Nenhuma cor, fonte ou valor de espaçamento fora deste documento deve ser utilizado no projeto.

---

## 1. Paleta de Cores (CSS Custom Properties)

```css
:root {
  /* ═══════════════════════════════════════════════
     CORES NEUTRAS (fundos e textos)
     ═══════════════════════════════════════════════ */
  --tv-off-white:        #F9F7F8;   /* Fundo padrão claro, superfícies, cards */
  --tv-off-white-rgb:    249,247,248;
  --tv-gray-mid:         #585858;   /* Texto secundário, legendas, bordas sutis */
  --tv-gray-mid-rgb:     88,88,88;
  --tv-graphite:         #3D3D3D;   /* Texto principal, headings, logo positiva */
  --tv-graphite-rgb:     61,61,61;

  /* ═══════════════════════════════════════════════
     CORES INSTITUCIONAIS (destaques e variações)
     ═══════════════════════════════════════════════ */
  --tv-gold:             #B5996A;   /* Cor primária de luxo — CTAs, bordas decorativas, hovers, badges VIP */
  --tv-gold-rgb:         181,153,106;
  --tv-wine:             #900D13;   /* Secundária institucional — badges, etiquetas, botões especiais */
  --tv-wine-rgb:         144,13,19;
  --tv-petrol:           #004168;   /* Secundária institucional — seções alternadas, selos tecnológicos */
  --tv-petrol-rgb:       0,65,104;

  /* ═══════════════════════════════════════════════
     PRETO E BRANCO (uso restrito: logo P/N, overlays)
     ═══════════════════════════════════════════════ */
  --tv-black:            #000000;
  --tv-white:            #FFFFFF;

  /* ═══════════════════════════════════════════════
     CORES DERIVADAS (geradas a partir das oficiais)
     ═══════════════════════════════════════════════ */
  --tv-gold-light:       #D4C4A8;   /* Gold com +30% luminosidade — fundos sutis, estados disabled */
  --tv-gold-dark:        #8A7450;   /* Gold com -20% luminosidade — hover de botão Gold */
  --tv-graphite-light:   #4D4D4D;   /* Hover sobre fundo grafite */
  --tv-wine-light:       #B52A31;   /* Hover de botão Wine */
  --tv-petrol-light:     #005A8E;   /* Hover de botão Petrol */

  /* ═══════════════════════════════════════════════
     CORES SEMÂNTICAS (mapeamento funcional)
     ═══════════════════════════════════════════════ */
  --color-background:    var(--tv-off-white);
  --color-surface:       var(--tv-white);
  --color-surface-dark:  var(--tv-graphite);
  --color-text-primary:  var(--tv-graphite);
  --color-text-secondary:var(--tv-gray-mid);
  --color-text-inverse:  var(--tv-off-white);
  --color-accent:        var(--tv-gold);
  --color-accent-hover:  var(--tv-gold-dark);
  --color-cta-primary:   var(--tv-gold);
  --color-cta-secondary: var(--tv-wine);
  --color-info:          var(--tv-petrol);
  --color-border:        rgba(var(--tv-gray-mid-rgb), 0.20);
  --color-border-accent: rgba(var(--tv-gold-rgb), 0.40);

  /* ═══════════════════════════════════════════════
     ESTADOS DE FEEDBACK (alertas do sistema admin)
     ═══════════════════════════════════════════════ */
  --color-success:       #2D6A4F;
  --color-success-bg:    #D8F3DC;
  --color-warning:       #E9C46A;
  --color-warning-bg:    #FFF3CD;
  --color-error:         var(--tv-wine);
  --color-error-bg:      #F8D7DA;
}
```

### 1.1 Regras de Uso de Cores

| Contexto | Cor Permitida | Proibido |
|---|---|---|
| Fundos de página (site público) | `--tv-off-white`, `--tv-graphite`, `--tv-white` | Cinza-azulado, cinza genérico, verde, neon |
| Fundos de seção alternada | `--tv-petrol`, `--tv-wine` (com texto claro) | Usar como cor dominante do site inteiro |
| Botões CTA primários | `--tv-gold` com texto `--tv-graphite` ou `--tv-white` | Cores fora da paleta |
| Texto principal (claro) | `--tv-graphite` | Preto puro `#000` para texto corrido |
| Texto principal (escuro) | `--tv-off-white` | Branco puro `#FFF` em parágrafos longos |
| Destaques, ícones, hover | `--tv-gold` | Amarelo, laranja ou dourados diferentes |
| Bordas decorativas | `--tv-gold` a 40% opacidade | Bordas coloridas fora da paleta |
| Cards e superfícies elevadas | `--tv-white` ou `--tv-off-white` | Fundos coloridos saturados |

---

## 2. Tipografia

```css
:root {
  /* ═══════════════════════════════════════════════
     FAMÍLIAS TIPOGRÁFICAS
     ═══════════════════════════════════════════════ */

  /* Wordmark / Logo — uso pontual em H1 heroes de grande impacto */
  --font-display:   'Soligant', 'Playfair Display', Georgia, serif;

  /* Taglines, badges, categorias — SEMPRE caixa alta + tracking largo */
  --font-tagline:   'Identification 05C', 'Montserrat', 'Cinzel', sans-serif;

  /* Corpo de texto, headings H2-H6, menus, botões, parágrafos */
  --font-body:      'Lora', Georgia, 'Times New Roman', serif;

  /* ═══════════════════════════════════════════════
     ESCALA TIPOGRÁFICA (fluid, clamp-based)
     ═══════════════════════════════════════════════ */
  --text-xs:        clamp(0.625rem, 0.5rem + 0.25vw, 0.75rem);    /* 10-12px — labels, captions */
  --text-sm:        clamp(0.75rem,  0.65rem + 0.25vw, 0.875rem);   /* 12-14px — descrições, legendas */
  --text-base:      clamp(0.875rem, 0.8rem + 0.2vw, 1rem);         /* 14-16px — corpo de texto */
  --text-lg:        clamp(1rem,     0.9rem + 0.3vw, 1.25rem);      /* 16-20px — subtítulos */
  --text-xl:        clamp(1.25rem,  1rem + 0.5vw, 1.5rem);         /* 20-24px — títulos de seção */
  --text-2xl:       clamp(1.5rem,   1.2rem + 0.75vw, 2rem);        /* 24-32px — títulos de página */
  --text-3xl:       clamp(2rem,     1.5rem + 1vw, 2.5rem);         /* 32-40px — hero subtítulos */
  --text-4xl:       clamp(2.5rem,   1.8rem + 1.5vw, 3.5rem);       /* 40-56px — hero headline */
  --text-5xl:       clamp(3rem,     2rem + 2vw, 4.5rem);            /* 48-72px — hero impacto máximo */

  /* ═══════════════════════════════════════════════
     PESOS TIPOGRÁFICOS
     ═══════════════════════════════════════════════ */
  --font-weight-regular:   400;
  --font-weight-medium:    500;
  --font-weight-semibold:  600;
  --font-weight-bold:      700;

  /* ═══════════════════════════════════════════════
     TRACKING (letter-spacing)
     ═══════════════════════════════════════════════ */
  --tracking-tight:    -0.01em;   /* Headings grandes (Soligant) */
  --tracking-normal:    0;        /* Corpo de texto (Lora) */
  --tracking-wide:      0.05em;   /* Botões e menus */
  --tracking-wider:     0.15em;   /* Taglines (Identification 05C) — mínimo */
  --tracking-widest:    0.25em;   /* Taglines de destaque máximo */

  /* ═══════════════════════════════════════════════
     LEADING (line-height)
     ═══════════════════════════════════════════════ */
  --leading-tight:     1.15;     /* Headlines/Hero */
  --leading-snug:      1.35;     /* Subtítulos */
  --leading-normal:    1.6;      /* Corpo de texto */
  --leading-relaxed:   1.8;      /* Textos longos / blocos educativos */
}
```

### 2.1 Mapa de Aplicação Tipográfica

| Elemento HTML | Fonte | Peso | Tamanho | Tracking | Caixa | Cor |
|---|---|---|---|---|---|---|
| Hero H1 (impacto máximo) | `--font-display` (Soligant) | 700 | `--text-5xl` | `--tracking-tight` | Normal | `--tv-off-white` |
| Badge / Superlabel | `--font-tagline` (Identification 05C) | 600 | `--text-xs` | `--tracking-widest` | `uppercase` | `--tv-gold` |
| H2 (título de seção) | `--font-body` (Lora) | 700 | `--text-2xl` | `--tracking-normal` | Normal | `--tv-graphite` |
| H3 (subtítulo) | `--font-body` (Lora) | 600 | `--text-xl` | `--tracking-normal` | Normal | `--tv-graphite` |
| Parágrafo | `--font-body` (Lora) | 400 | `--text-base` | `--tracking-normal` | Normal | `--tv-graphite` |
| Menu / Nav Link | `--font-body` (Lora) | 600 | `--text-sm` | `--tracking-wide` | Normal | `--tv-off-white` |
| Botão CTA | `--font-body` (Lora) | 700 | `--text-sm` | `--tracking-wide` | Normal | Depende da variante |
| Legenda / Caption | `--font-body` (Lora) | 400 | `--text-xs` | `--tracking-normal` | Normal | `--tv-gray-mid` |
| Label Admin (PDV) | `--font-tagline` | 700 | `--text-xs` | `--tracking-wider` | `uppercase` | `--tv-gray-mid` |

---

## 3. Espaçamento & Layout

```css
:root {
  /* ═══════════════════════════════════════════════
     ESCALA DE ESPAÇAMENTO (rem-based, 4px grid)
     ═══════════════════════════════════════════════ */
  --space-1:    0.25rem;   /* 4px  — micro gaps */
  --space-2:    0.5rem;    /* 8px  — gaps entre ícone e texto */
  --space-3:    0.75rem;   /* 12px — padding interno de badges */
  --space-4:    1rem;      /* 16px — padding de cards */
  --space-5:    1.25rem;   /* 20px — gap de grid */
  --space-6:    1.5rem;    /* 24px — margin entre blocos */
  --space-8:    2rem;      /* 32px — margin entre seções internas */
  --space-10:   2.5rem;    /* 40px — padding de seções */
  --space-12:   3rem;      /* 48px — padding vertical de seções */
  --space-16:   4rem;      /* 64px — padding vertical de seções maiores */
  --space-20:   5rem;      /* 80px — separação entre seções do site */
  --space-24:   6rem;      /* 96px — padding hero vertical */

  /* ═══════════════════════════════════════════════
     LARGURAS MÁXIMAS (containers)
     ═══════════════════════════════════════════════ */
  --max-w-content:   1200px;   /* Container principal do conteúdo */
  --max-w-narrow:    800px;    /* Formulários, textos longos */
  --max-w-wide:      1400px;   /* Galerias, vitrines amplas */
  --max-w-full:      100%;     /* Hero sections full-bleed */

  /* ═══════════════════════════════════════════════
     GRID DO SITE
     ═══════════════════════════════════════════════ */
  --grid-columns:    12;
  --grid-gap:        var(--space-6);
  --grid-gap-mobile: var(--space-4);

  /* ═══════════════════════════════════════════════
     ÁREA DE PROTEÇÃO DA LOGO (Clear Space X)
     Conforme seção 14 do manual de marca.
     X = largura aproximada do monograma/ícone.
     ═══════════════════════════════════════════════ */
  --logo-clear-space:  1em;   /* Relativo ao tamanho da logo renderizada */
}
```

---

## 4. Bordas, Raios e Sombras

```css
:root {
  /* ═══════════════════════════════════════════════
     BORDER RADIUS (cantos arredondados)
     ═══════════════════════════════════════════════ */
  --radius-none:     0;
  --radius-sm:       0.375rem;   /* 6px  — inputs, badges pequenos */
  --radius-md:       0.5rem;     /* 8px  — cards, botões */
  --radius-lg:       0.75rem;    /* 12px — cards maiores, modais */
  --radius-xl:       1rem;       /* 16px — cards de destaque */
  --radius-2xl:      1.5rem;     /* 24px — cards hero */
  --radius-full:     9999px;     /* Botões pill, avatares, badges circulares */

  /* ═══════════════════════════════════════════════
     BORDAS
     ═══════════════════════════════════════════════ */
  --border-thin:     1px solid var(--color-border);
  --border-accent:   1px solid var(--color-border-accent);
  --border-gold:     1px solid var(--tv-gold);
  --border-divider:  1px solid rgba(var(--tv-gray-mid-rgb), 0.12);

  /* ═══════════════════════════════════════════════
     SOMBRAS (hierarquia de elevação)
     Estilo: sutil e sofisticado, sem sombras pesadas.
     ═══════════════════════════════════════════════ */
  --shadow-xs:       0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm:       0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-md:       0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg:       0 8px 24px rgba(0, 0, 0, 0.10);
  --shadow-xl:       0 16px 48px rgba(0, 0, 0, 0.12);
  --shadow-gold:     0 4px 16px rgba(var(--tv-gold-rgb), 0.20);  /* Glow dourado para CTAs hover */
  --shadow-inner:    inset 0 2px 4px rgba(0, 0, 0, 0.06);
}
```

---

## 5. Transições e Animações

```css
:root {
  /* ═══════════════════════════════════════════════
     CURVAS DE EASING
     ═══════════════════════════════════════════════ */
  --ease-default:    cubic-bezier(0.4, 0, 0.2, 1);    /* Suave e elegante */
  --ease-in:         cubic-bezier(0.4, 0, 1, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ═══════════════════════════════════════════════
     DURAÇÕES
     ═══════════════════════════════════════════════ */
  --duration-fast:       150ms;
  --duration-normal:     250ms;
  --duration-slow:       400ms;
  --duration-slower:     600ms;

  /* ═══════════════════════════════════════════════
     TRANSIÇÕES COMPOSTAS (atalhos para uso direto)
     ═══════════════════════════════════════════════ */
  --transition-colors:   color var(--duration-normal) var(--ease-default),
                         background-color var(--duration-normal) var(--ease-default),
                         border-color var(--duration-normal) var(--ease-default);
  --transition-transform: transform var(--duration-normal) var(--ease-default);
  --transition-opacity:   opacity var(--duration-slow) var(--ease-default);
  --transition-shadow:    box-shadow var(--duration-normal) var(--ease-default);
  --transition-all:       all var(--duration-normal) var(--ease-default);
}
```

### 5.1 Micro-Animações Definidas

| Nome | Uso | Descrição |
|---|---|---|
| `fade-in` | Entrada de seções ao scroll (Intersection Observer) | Opacidade 0→1 + translateY(20px→0), 600ms ease-out |
| `fade-in-up` | Cards de produto e depoimentos | Opacidade 0→1 + translateY(30px→0), 400ms ease-out |
| `scale-in` | Modais e overlays | Scale 0.95→1 + opacidade 0→1, 250ms ease-out |
| `shimmer` | Loading placeholders | Gradiente animado horizontal da esquerda para a direita |
| `gold-glow` | Hover no botão CTA Gold | `box-shadow` crescendo com `--shadow-gold`, 300ms |
| `slide-in-right` | Menu mobile (drawer) | translateX(100%→0), 300ms ease-out |
| `pulse-gentle` | Badge de alerta de estoque | Scale 1→1.05→1 em loop suave, 2s |

---

## 6. Breakpoints Responsivos

```css
:root {
  /* ═══════════════════════════════════════════════
     BREAKPOINTS (Mobile-First)
     ═══════════════════════════════════════════════ */
  --bp-sm:    640px;    /* Smartphones grandes / landscape */
  --bp-md:    768px;    /* Tablets portrait */
  --bp-lg:    1024px;   /* Tablets landscape / laptops pequenos */
  --bp-xl:    1280px;   /* Desktops padrão */
  --bp-2xl:   1536px;   /* Monitores grandes */
}
```

### 6.1 Regras de Comportamento Responsivo

| Breakpoint | Colunas do Grid | Navbar | Logo | Cards Produto | Hero Font |
|---|---|---|---|---|---|
| `< 640px` | 1 coluna | Menu Drawer (Sheet) | Monograma (ícone) | 1 por linha | `--text-3xl` |
| `640–767px` | 2 colunas | Menu Drawer | Logo compacta | 2 por linha | `--text-3xl` |
| `768–1023px` | 2–3 colunas | Barra horizontal | Logo principal | 2–3 por linha | `--text-4xl` |
| `1024–1279px` | 3–4 colunas | Barra horizontal | Logo principal | 3–4 por linha | `--text-4xl` |
| `≥ 1280px` | 4 colunas | Barra horizontal | Logo principal | 4 por linha | `--text-5xl` |

---

## 7. Estados de Componentes

### 7.1 ButtonCTA — Variantes

| Variante | Background | Texto | Borda | Hover | Active |
|---|---|---|---|---|---|
| `gold` | `--tv-gold` | `--tv-white` | nenhuma | `--tv-gold-dark` + `--shadow-gold` | `--tv-gold-dark` escurecido 5% |
| `wine` | `--tv-wine` | `--tv-white` | nenhuma | `--tv-wine-light` | Scale 0.98 |
| `petrol` | `--tv-petrol` | `--tv-white` | nenhuma | `--tv-petrol-light` | Scale 0.98 |
| `outline` | `transparent` | `--tv-off-white` | `--border-gold` | bg `--tv-gold` a 10% | Borda `--tv-gold` sólida |
| `ghost` | `transparent` | `--tv-gold` | nenhuma | bg `--tv-gold` a 8% | — |

### 7.2 Input / Form Fields

| Estado | Borda | Fundo | Sombra |
|---|---|---|---|
| Default | `--color-border` | `--tv-off-white` ou `#0a0a0e` (admin) | nenhuma |
| Focus | `--tv-gold` | sem mudança | `--shadow-gold` a 50% opacidade |
| Error | `--tv-wine` | `--color-error-bg` a 5% | nenhuma |
| Disabled | `--color-border` a 50% | bg a 50% opacidade | nenhuma |

### 7.3 Card — Elevações

| Nível | Borda | Sombra | Uso |
|---|---|---|---|
| Flat | `--border-thin` | nenhuma | Listas, tabelas internas |
| Raised | `--border-thin` | `--shadow-sm` | Cards de produto, clientes |
| Elevated | `--border-accent` | `--shadow-md` | Cards em destaque, modais |
| Hero | `--border-gold` | `--shadow-lg` | Cards promocionais, hero cards |

---

## 8. Pattern Institucional (Losangos)

```css
/* Regras de uso do pattern de losangos (conforme seção 18 do manual) */
.pattern-background {
  background-image: url('/assets/pattern-timevision.svg');
  background-repeat: repeat;
  background-size: 60px 60px; /* Tamanho base do módulo do pattern */
}

/* Variações de opacidade permitidas */
.pattern-subtle    { opacity: 0.03; }   /* Fundo de seções claras */
.pattern-light     { opacity: 0.05; }   /* Fundo de seções escuras (grafite) */
.pattern-medium    { opacity: 0.10; }   /* Rodapé, destaques circulares */
.pattern-visible   { opacity: 0.15; }   /* Fundos decorativos de destaque */
.pattern-watermark { opacity: 0.20; }   /* Máximo — apenas em backgrounds não-texto */
```

### 8.1 Combinações de Cores Aprovadas para o Pattern

| Cor do Pattern | Cor de Fundo | Uso |
|---|---|---|
| Dourado (`--tv-gold`) | Grafite (`--tv-graphite`) | Rodapé, vitrines, seções escuras |
| Branco (`--tv-white`) | Grafite ou Petrol | Seções alternadas escuras |
| Preto (`--tv-black`) | Off-white | Seções claras sutis |
| Dourado (`--tv-gold`) | Petrol (`--tv-petrol`) | Seção de tecnologia em lentes |
| Dourado (`--tv-gold`) | Wine (`--tv-wine`) | Seção de ações corporativas |

---

## 9. Z-Index Scale

```css
:root {
  --z-base:       0;
  --z-dropdown:   100;
  --z-sticky:     200;    /* Header fixo */
  --z-overlay:    300;    /* Overlays de fundo */
  --z-modal:      400;    /* Modais e drawers */
  --z-toast:      500;    /* Notificações toast */
  --z-tooltip:    600;    /* Tooltips */
}
```

---

*Referência: `TIMEVISION_MANUAL_DE_MARCA.md` §7 (paleta), §10 (tipografia), §14 (área de proteção), §18 (pattern).*
*Referência: `TIMEVISION_CONTEXTO_PARA_DESENVOLVIMENTO_WEB.md` §2 (tokens de cor), §3 (tipografia), §5 (fotografia).*
