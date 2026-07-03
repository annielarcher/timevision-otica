# Timevision Ótica — Inventário de Assets

> **Checklist completo de todos os arquivos visuais, fontes e recursos necessários para a implementação.**
> Cada item está classificado por status de disponibilidade e prioridade.

---

## 1. Fontes Tipográficas

| # | Asset | Formato | Status | Prioridade | Ação Necessária |
|---|---|---|---|---|---|
| F1 | **Lora** (Regular, Italic, Bold, Bold Italic) | Google Fonts (WOFF2) | ✅ Disponível | Alta | Importar via `@import` do Google Fonts ou download local |
| F2 | **Soligant** (Logo / Display) | .woff / .woff2 | ⚠️ Pendente | Alta | Confirmar se a licença cobre uso @font-face web. Solicitar arquivo .woff2 à agência ThalitaKume® |
| F3 | **Identification 05C** (Tagline) | .woff / .woff2 | ⚠️ Pendente | Média | Confirmar licença. Se indisponível, usar fallback: `Montserrat` (caixa alta + tracking `0.15em`) ou `Cinzel` |

### Fallbacks Tipográficos
```css
/* Se Soligant não estiver disponível como web font */
--font-display-fallback: 'Playfair Display', Georgia, serif;

/* Se Identification 05C não estiver disponível */
--font-tagline-fallback: 'Montserrat', 'Cinzel', sans-serif;
/* Usar com: text-transform: uppercase; letter-spacing: 0.18em; */
```

---

## 2. Logotipos & Marca

| # | Asset | Formato | Versão | Status | Uso |
|---|---|---|---|---|---|
| L1 | **Logo Principal** (horizontal completa: TIMEVISION + ÓTICA) | SVG + PNG @2x | Positiva (grafite sobre claro) | ⚠️ Solicitar | Header, materiais institucionais |
| L2 | **Logo Principal** | SVG + PNG @2x | Negativa (branca sobre escuro) | ⚠️ Solicitar | Header dark, footer, hero overlay |
| L3 | **Logo Principal** | SVG + PNG @2x | Dourada sobre escuro | ⚠️ Solicitar | Variação premium, materiais VIP |
| L4 | **Logo Secundária** (com box em "VISION") | SVG + PNG @2x | 4 variações de cor do box (dourado, azul, vinho, grafite) | ⚠️ Solicitar | Banners promocionais, material de marketing |
| L5 | **Ícone / Monograma** | SVG + PNG @2x + ICO | Todas as 6 cores da paleta | ⚠️ Solicitar | Favicon, avatar redes sociais, marca d'água, mobile header |
| L6 | **Favicon** (derivado do monograma) | ICO (16×16, 32×32) + PNG (192×192, 512×512) | — | 🔨 Gerar | Aba do navegador, PWA manifest |

### Localização no Projeto
```
public/
├── logo-principal.svg          (L1 positiva)
├── logo-principal-negativa.svg (L2)
├── logo-principal-dourada.svg  (L3)
├── logo-secundaria-gold.svg    (L4)
├── logo-secundaria-petrol.svg  (L4)
├── logo-secundaria-wine.svg    (L4)
├── logo-secundaria-graphite.svg(L4)
├── icon-monograma.svg          (L5)
├── favicon.ico                 (L6)
├── icon-192x192.png            (L6 PWA)
└── icon-512x512.png            (L6 PWA)
```

---

## 3. Pattern Institucional (Padronagem Gráfica)

| # | Asset | Formato | Status | Uso |
|---|---|---|---|---|
| P1 | **Pattern de losangos (tile repetível)** | SVG (vetorial) | ⚠️ Solicitar à agência | `PatternBackground` em seções escuras, rodapé, destaques |
| P2 | **Pattern — variação dourado sobre preto** | SVG ou CSS | 🔨 Derivar de P1 | Seções escuras (hero, vitrine, footer) |
| P3 | **Pattern — variação branco sobre grafite** | SVG ou CSS | 🔨 Derivar de P1 | Seções intermediárias |
| P4 | **Pattern — variação dourado sobre petrol** | SVG ou CSS | 🔨 Derivar de P1 | Seção de tecnologia de lentes |
| P5 | **Pattern — variação dourado sobre vinho** | SVG ou CSS | 🔨 Derivar de P1 | Seção corporativa/itinerante |

### Alternativa de Implementação (sem arquivo SVG)
Se o arquivo vetorial do pattern não for fornecido pela agência, criar via CSS:
```css
/* Pattern geométrico em losangos via CSS puro */
.pattern-diamond {
  background-image:
    linear-gradient(45deg, transparent 45%, var(--tv-gold) 45%, var(--tv-gold) 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, var(--tv-gold) 45%, var(--tv-gold) 55%, transparent 55%);
  background-size: 30px 30px;
  opacity: 0.05;
}
```

---

## 4. Fotografias & Imagens

### 4.1 Hero / Banners

| # | Asset | Descrição | Dimensões | Status | Prioridade |
|---|---|---|---|---|---|
| I1 | **Hero Principal Home** | Fotografia editorial P&B de alto contraste — modelo com óculos de sol/grau de grife | 1920×1080 (16:9) @2x | 🔨 Gerar (IA) ou ⚠️ Solicitar sessão fotográfica | Crítica |
| I2 | **Hero Sobre** | Fotografia editorial P&B — detalhe de armação ou still-life de produto | 1920×800 | 🔨 Gerar ou ⚠️ Sessão | Alta |
| I3 | **Hero Coleções** | Grid/mosaico de armações em iluminação de estúdio | 1920×800 | 🔨 Gerar ou ⚠️ Sessão | Alta |
| I4 | **Hero Orçamento** | Imagem de mãos segurando armação de luxo, tom dourado/quente | 1920×600 | 🔨 Gerar ou ⚠️ Sessão | Média |
| I5 | **Background Corporativo** | Foto de atendimento em ambiente empresarial/grupo, tom profissional | 1200×800 | 🔨 Gerar | Média |

### 4.2 Produtos (Still-Life de Armações)

| # | Asset | Descrição | Dimensões | Status |
|---|---|---|---|---|
| I6-I20 | **Fotos de armações** (mínimo 8, ideal 15) | Still-life de cada armação sobre fundo neutro, iluminação de estúdio | 800×800 (1:1) @2x | ⚠️ Sessão fotográfica ou mock-ups gerados |
| I21 | **Placeholder de produto** | Silhueta elegante de óculos em tom grafite | 800×800 | 🔨 Gerar |

### 4.3 Logos de Laboratórios Parceiros

| # | Asset | Marca | Formato | Status |
|---|---|---|---|---|
| I22 | Zeiss | Logo oficial | SVG ou PNG transparente | ⚠️ Download do site oficial |
| I23 | Essilor | Logo oficial | SVG ou PNG transparente | ⚠️ Download do site oficial |
| I24 | Hoyalux | Logo oficial | SVG ou PNG transparente | ⚠️ Download do site oficial |
| I25 | Padrão Óptico | Logo oficial | SVG ou PNG transparente | ⚠️ Solicitar ao laboratório |
| I26 | Haytek | Logo oficial | SVG ou PNG transparente | ⚠️ Solicitar ao laboratório |
| I27 | Digilab | Logo oficial | SVG ou PNG transparente | ⚠️ Solicitar ao laboratório |

### 4.4 Imagens de Apoio

| # | Asset | Descrição | Status |
|---|---|---|---|
| I28 | **Depoimentos — fotos de clientes** | Fotos reais de clientes satisfeitos (com autorização LGPD) | ⚠️ Solicitar à cliente |
| I29 | **Ícones dos destaques do Instagram** | 5 ícones circulares sobre pattern da marca (A Empresa, Orçamento, Entregas, Depoimentos, Clientes) | 🔨 Gerar com base no pattern |
| I30 | **Mapa do Recreio dos Bandeirantes** | Embed do Google Maps ou screenshot estilizado | 🔨 Implementar via Google Maps Embed API |
| I31 | **Foto do atendimento itinerante** | Consultor atendendo em ambiente corporativo/igreja | 🔨 Gerar (IA) ou ⚠️ Sessão |

---

## 5. Ícones

| # | Biblioteca | Uso | Status |
|---|---|---|---|
| IC1 | **Lucide React** (já instalado) | Todos os ícones de interface: menu, busca, carrinho, seta, check, alerta, etc. | ✅ Disponível |
| IC2 | **Ícones de redes sociais** | Instagram, WhatsApp (footer e contato) | ✅ Lucide ou SVG customizado |
| IC3 | **Ícones dos pilares da marca** | Compromisso, Ética, Tecnologia, Atendimento (seção Manifesto) | 🔨 Usar Lucide ou gerar SVGs simples |
| IC4 | **Ícone de WhatsApp flutuante** | Botão fixo no canto inferior direito para contato rápido | 🔨 SVG do WhatsApp |

---

## 6. Vídeos e Animações

| # | Asset | Descrição | Status | Prioridade |
|---|---|---|---|---|
| V1 | **Vídeo hero (opcional)** | Loop curto (8-15s) de still-life de armações em câmera lenta, P&B | ❌ Opcional | Baixa |
| V2 | **Animação de loading** | Monograma da marca com pulse sutil em dourado | 🔨 CSS animation | Média |
| V3 | **Animação do pattern** | Losangos entrando suavemente (fade-in) como background | 🔨 CSS animation | Baixa |

---

## 7. Documentos e Arquivos de Referência (já disponíveis)

| # | Arquivo | Localização | Status |
|---|---|---|---|
| D1 | Manual de Marca completo | `TIMEVISION_MANUAL_DE_MARCA.md` | ✅ |
| D2 | Contexto para Dev Web | `TIMEVISION_CONTEXTO_PARA_DESENVOLVIMENTO_WEB.md` | ✅ |
| D3 | Wireframe Textual | `TIMEVISION_ESTRUTURA_E_WIREFRAME_TEXTUAL.md` | ✅ |
| D4 | Design Tokens | `TIMEVISION_DESIGN_TOKENS.md` | ✅ |
| D5 | Modelo de Dados | `TIMEVISION_MODELO_DE_DADOS.md` | ✅ |
| D6 | Fluxos & Regras de Negócio | `TIMEVISION_FLUXOS_E_REGRAS_DE_NEGOCIO.md` | ✅ |
| D7 | Conteúdo & Copy | `TIMEVISION_CONTEUDO_E_COPY.md` | ✅ |
| D8 | Inventário de Assets | `TIMEVISION_INVENTARIO_DE_ASSETS.md` (este documento) | ✅ |

---

## 8. Resumo de Ações Pendentes

### 🔴 Solicitar à Agência ThalitaKume® ou à Cliente

| Item | O que pedir |
|---|---|
| **Fontes** | Arquivo .woff2 da Soligant + confirmação de licença web. Confirmação de licença da Identification 05C. |
| **Logos** | Pacote completo de SVGs: logo principal (positiva, negativa, dourada), logo secundária (4 boxes), monograma (6 cores). |
| **Pattern** | Arquivo SVG vetorial do pattern de losangos (tile repetível). |
| **Contato** | Endereço completo, telefone, WhatsApp e horário de funcionamento oficiais. |
| **Laboratórios** | Logos oficiais dos laboratórios nacionais (Padrão, Haytek, Digilab). |
| **Depoimentos** | Depoimentos reais de clientes + autorização de uso (LGPD). |
| **CNPJ/Razão Social** | Dados empresariais para a O.S. e rodapé legal. |

### 🟡 Gerar Internamente (IA / CSS / Ferramentas)

| Item | Como gerar |
|---|---|
| **Fotos hero e produto** | Usar `generate_image` para criar mocks editoriais em P&B |
| **Favicon** | Converter monograma SVG para ICO/PNG em múltiplos tamanhos |
| **Pattern CSS** | Implementar alternativa em CSS puro caso SVG não seja fornecido |
| **Ícones de pilares** | Selecionar de Lucide React ou criar SVGs simples |
| **Animação loading** | CSS keyframes com o monograma |

### ✅ Já Disponível

| Item | Status |
|---|---|
| Lora (Google Fonts) | Pronto para uso |
| Lucide React (ícones) | Já instalado no projeto |
| Documentação de marca | 8 documentos completos na raiz do projeto |
| Código-base Next.js | Funcional e compilando sem erros |

---

## 9. Estrutura de Diretórios para Assets

```
public/
├── fonts/
│   ├── Soligant-Regular.woff2       (⚠️ pendente)
│   ├── Identification05C.woff2      (⚠️ pendente)
│   └── README.md                    (instruções de licença)
├── logos/
│   ├── logo-principal.svg
│   ├── logo-principal-negativa.svg
│   ├── logo-principal-dourada.svg
│   ├── logo-secundaria-gold.svg
│   ├── logo-secundaria-petrol.svg
│   ├── logo-secundaria-wine.svg
│   ├── logo-secundaria-graphite.svg
│   └── icon-monograma.svg
├── pattern/
│   └── pattern-losangos.svg         (⚠️ pendente ou CSS fallback)
├── labs/
│   ├── zeiss.svg
│   ├── essilor.svg
│   ├── hoyalux.svg
│   ├── padrao.svg
│   ├── haytek.svg
│   └── digilab.svg
├── products/
│   ├── armacao-001.webp
│   ├── armacao-002.webp
│   ├── ...
│   └── placeholder-product.webp
├── hero/
│   ├── hero-home.webp
│   ├── hero-sobre.webp
│   ├── hero-colecoes.webp
│   └── hero-orcamento.webp
├── testimonials/
│   ├── cliente-01.webp
│   ├── cliente-02.webp
│   └── cliente-03.webp
├── favicon.ico
├── icon-192x192.png
└── icon-512x512.png
```

---

*Referência: `TIMEVISION_MANUAL_DE_MARCA.md` §4 (ícone), §5 (versões da logo), §17 (arquivos), §18 (pattern), §19 (marca d'água)*
*Referência: `TIMEVISION_CONTEXTO_PARA_DESENVOLVIMENTO_WEB.md` §4 (logo no site), §5 (fotografia), §9 (arquivos pendentes)*
