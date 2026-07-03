# Timevision Ótica — Contexto de Marca para Desenvolvimento do Site

> Este documento é um **resumo técnico e operacional** do Manual de Marca (`TIMEVISION_MANUAL_DE_MARCA.md`), escrito especificamente para ser colado como contexto/system prompt em uma ferramenta de geração de código (Antigravity ou similar). Ele traduz as regras de branding em **decisões diretas de implementação** (cores, fontes, espaçamentos, tom de voz, estrutura de conteúdo), para que a IA de desenvolvimento não "invente" nada fora da identidade da marca.

---

## 1. Resumo da marca em 3 frases

Timevision é uma **boutique óptica de alto padrão** no Recreio dos Bandeirantes (RJ), que une **sofisticação, atendimento personalizado e tecnologia** em lentes e armações. A comunicação visual é **luxuosa, editorial e minimalista** (referências: Louis Vuitton monogram, fotografia de moda em P&B, couro e dourado). O site deve parecer uma **boutique de grife**, não uma ótica de bairro — pense "e-commerce de moda de luxo" mais do que "clínica oftalmológica".

---

## 2. Design tokens (cores)

Usar sempre em **RGB/HEX** (o site é digital — nunca usar CMYK).

```css
:root {
  /* Neutros */
  --tv-off-white:  #F9F7F8; /* fundo padrão claro */
  --tv-gray-mid:   #585858; /* texto secundário sobre fundo escuro */
  --tv-graphite:   #3D3D3D; /* texto principal / logotipo sobre claro */

  /* Institucionais (uso pontual, para destaque e variação) */
  --tv-wine:       #900D13; /* vermelho vinho institucional */
  --tv-petrol:     #004168; /* azul petróleo institucional */
  --tv-gold:       #B5996A; /* dourado/areia — cor de destaque e luxo */

  /* Preto e branco puros — apenas para versão positiva/negativa da logo */
  --tv-black: #000000;
  --tv-white: #FFFFFF;
}
```

**Como distribuir as cores no site (hierarquia sugerida):**
- **Dourado (`--tv-gold`)** → cor de destaque/CTA principal, ícones, detalhes, hover states, bordas finas decorativas. É a cor "de luxo" da marca — usar com generosidade em elementos de destaque, mas não como fundo de blocos de texto extensos.
- **Off-white (`--tv-off-white`)** → fundo padrão da maior parte do site.
- **Grafite (`--tv-graphite`)** → cor principal de texto/tipografia sobre fundo claro.
- **Azul petróleo e vermelho vinho** → usar como cores secundárias de apoio (seções alternadas, badges, categorias de produto/serviço, estados de hover alternativos) — nunca como cor dominante do site inteiro.
- Evitar criar novas cores fora desta paleta (sem cinza-azulado genérico, sem verde, sem cores neon).

---

## 3. Tipografia

```css
/* Wordmark / logotipo — NUNCA recriar em CSS, sempre usar o arquivo de logo oficial (svg/png) */
--font-logo: 'Soligant', serif;

/* Tagline institucional, caixa alta, tracking largo (ex: "ÓTICA", badges, categorias em destaque) */
--font-tagline: 'Identification 05C', sans-serif;

/* Corpo de texto, títulos de seção, menus, botões — fonte "de trabalho" do site inteiro */
--font-body: 'Lora', serif;
```

**Regras de uso:**
- **Lora** é a fonte principal do site (headings, parágrafos, botões, menu). Disponível gratuitamente no Google Fonts — usar sem restrição.
- **Identification 05C** deve ser usada com moderação: caixa alta + letter-spacing generoso (`letter-spacing: 0.15em` a `0.25em`), para pequenos rótulos, categorias, badges, subtítulos curtos — nunca em parágrafos longos.
- **Soligant é licenciada e pode ser usada no site** — inclusive fora do arquivo de logo, em headlines de grande destaque (ex.: hero da home), já que a licença foi adquirida pela própria autora da marca. Só falta confirmar se a licença cobre uso como **web font (@font-face)** — algumas licenças de fonte cobrem apenas uso em design estático (Photoshop/Illustrator/Canva) e exigem um upgrade específico para embutir o arquivo em .woff/.woff2 no site. Vale checar isso no termo de licença antes do deploy.
- **Identification 05C** ainda não teve a licença confirmada — usar com moderação até essa confirmação e, se necessário, ter como plano B uma sans geométrica caixa-alta gratuita (ex.: Montserrat ou Cinzel) com DNA visual semelhante.

---

## 4. Logotipo — regras de implementação no site

- Sempre usar o **arquivo-mestre da logo** (SVG/PNG em alta resolução), nunca recriar via CSS/texto.
- Versões disponíveis: **principal** (horizontal completa), **secundária** (com box colorido em "VISION"), **ícone/monograma** (apenas símbolo).
- **Header do site:** usar a versão principal (ou o ícone, se o header for muito compacto/mobile).
- **Favicon:** usar apenas o ícone/monograma.
- **Área de proteção (clear space):** nunca colar menu, texto ou imagens diretamente na logo — manter um respiro mínimo ao redor equivalente à altura do ícone.
- **Tamanho mínimo:** a versão com tagline "ÓTICA" não deve ser exibida abaixo de ~120–140px de largura (abaixo disso, trocar para o ícone sozinho).
- **Sobre fundos escuros/coloridos:** usar a versão negativa (branca) ou dourada da logo — nunca a versão grafite sobre fundo escuro sem contraste.
- **Nunca**: esticar, distorcer, mudar cor fora da paleta, trocar a fonte, ou alterar o espaçamento entre "TIMEVISION" e "ÓTICA".

---

## 5. Diretrizes de imagem e fotografia

- Estilo: **editorial de moda**, preferencialmente **preto e branco de alto contraste**, ou still-life de armações com boa iluminação e fundo neutro/dourado.
- Evitar fotos "de clínica" (jaleco branco, ambiente clínico genérico, banco de imagens genérico de óculos). O tom é **boutique/lifestyle**, não médico-clínico.
- Quando a logo precisar ser aplicada sobre foto (banners, hero images), usar um **box sólido** (branco, dourado ou institucional) atrás da logo para garantir legibilidade — nunca a logo "flutuando" direto sobre a foto sem contraste garantido.
- O **pattern institucional** (estampa geométrica em losango, inspirada em monograma de luxo) pode ser usado como textura decorativa sutil em fundos de seção, divisores, ou elementos de loading — com baixa opacidade sobre fundo escuro/colorido, nunca atrapalhando a leitura de texto.
- O **ícone/monograma** pode ser usado como marca d'água discreta sobre imagens de produto/still (canto inferior, baixa opacidade).

---

## 6. Tom de voz (para copywriting do site)

Atributos de marca que devem transparecer em todo texto do site: **compromisso, dedicação, respeito, ética, responsabilidade, honestidade, seriedade, verdade.**

Na prática, isso significa:
- Tom **confiante e elegante**, mas nunca arrogante.
- Frases diretas, sem exagero publicitário — a marca valoriza **verdade e transparência** ("É de verdade!" é literalmente um gancho de copy já usado pela marca).
- Pode combinar **conteúdo educativo + venda + prova social**, como nos exemplos reais já usados pela marca:
  - "3 sinais que seus óculos venceram!"
  - "Essa é a armação indicada para o seu tipo de rosto"
  - "Óculos quebrados ou vencidos? Orce aqui!"
  - "Design & elegância!"
- Evitar gírias, emojis em excesso, ou linguagem infantilizada. O público-alvo busca **elegância, conforto e qualidade** — o texto deve refletir isso.

---

## 7. Estrutura de conteúdo sugerida para o site (baseada no manual + destaques de Instagram)

A própria marca já organiza seu conteúdo em blocos temáticos (vistos nos destaques do Instagram) — isso pode inspirar diretamente a arquitetura de páginas/seções do site:

1. **Home** — hero em foto editorial P&B + logo em box + CTA "Faça seu orçamento agora".
2. **A Empresa / Sobre** — conceito da marca (boutique óptica, Recreio dos Bandeirantes, sofisticação + tecnologia).
3. **Catálogo / Armações de grife** — curadoria de modelos, com fotografia still de produto.
4. **Lentes de contato / Saúde visual** — conteúdo mais técnico/educativo, mantendo o tom elegante.
5. **Orçamento** — CTA recorrente ao longo do site (a marca usa "Faça o seu orçamento agora!" e "Orce aqui!" como chamadas consistentes).
6. **Depoimentos / Clientes** — prova social, com estilo editorial (fotos de clientes, texto curto).
7. **Blog / Dicas** — conteúdo educativo no mesmo tom dos posts já usados ("3 sinais que seus óculos venceram", "armação ideal para seu tipo de rosto").
8. **Contato / Localização** — endereço no Recreio dos Bandeirantes, RJ; redes sociais (@oticastimevision).

---

## 8. Checklist de "não fazer" (para revisão antes de publicar qualquer tela)

- [ ] Não usar cores fora da paleta institucional.
- [ ] Não recriar o logotipo digitando texto — sempre usar o arquivo oficial.
- [ ] Não colar elementos dentro da área de proteção da logo.
- [ ] Não aplicar a logo sobre fundo com contraste insuficiente sem um box de apoio.
- [ ] Não usar fotografia de banco de imagens genérica "de ótica popular" — manter o padrão editorial/luxo.
- [ ] Não usar tom de voz informal demais, agressivo de vendas, ou clínico/frio.
- [ ] Não esquecer de confirmar se a licença da Soligant cobre uso como web font (@font-face) antes do deploy — a licença de uso geral já está adquirida.
- [ ] Não esquecer de confirmar a licença de uso da Identification 05C antes do deploy.

---

## 9. Arquivos que ainda seriam úteis pedir ao cliente/agência

Para o Antigravity (ou qualquer dev) trabalhar com 100% de fidelidade à marca, recomenda-se solicitar também:
- Arquivos vetoriais originais da logo (AI/EPS/SVG) em todas as variações (principal, secundária, ícone, positivo/negativo).
- Arquivo da fonte Soligant em formato web (.woff/.woff2) — licença já adquirida, falta apenas gerar/obter o arquivo no formato correto para web.
- Confirmação da licença da fonte Identification 05C (ou substituta aprovada, caso não seja possível liberá-la para uso web).
- Pattern institucional em SVG (para reuso como textura escalável, sem perda de qualidade).
- Banco de fotos oficial da marca (still de produtos, fotos de loja, fotos de clientes/depoimentos) — as imagens do manual são majoritariamente referência de moodboard/stock, não fotos reais da loja.
- Confirmação do endereço completo, telefone, e-mail e redes sociais oficiais da Timevision (o manual só cita o Instagram @oticastimevision).

---

**Arquivo irmão:** `TIMEVISION_MANUAL_DE_MARCA.md` (manual completo, com todas as regras detalhadas seção por seção).
