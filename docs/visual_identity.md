# Identidade Visual: Timevision Ótica

Este documento registra os tokens de design, cores, tipografia e diretrizes de estilo da **Timevision Ótica** estruturados no código. Ele garante que qualquer agente ou desenvolvedor mantenha a consistência da marca nas próximas iterações.

## Paleta de Cores (Configurada via Variáveis CSS no globals.css)

Atualmente, o projeto utiliza uma paleta escura (Dark Mode) premium com detalhes dourados (Luxo/Alta Qualidade) herdados do BSN:

- **Fundo Principal (Background)**: HSL `224 71% 4%` (Azul Marinho Escuro quase Preto)
- **Fundo de Cards (Card)**: HSL `224 71% 9%` (Azul Escuro Suave)
- **Cor Primária / Destaques (Primary)**: HSL `39 85% 61%` (Dourado Quente - Timevision Gold)
- **Texto Principal (Foreground)**: HSL `39 56% 92%` (Creme Claro com alto contraste)
- **Texto Secundário (Muted Foreground)**: HSL `39 56% 70%` (Cinza Creme Confortável)
- **Bordas / Divisores (Border)**: HSL `224 71% 15%` (Azul Escuro Médio)

---

## Tipografia (Google Fonts)

Configurada nas fontes padrão em `layout.tsx` e `globals.css`:

1. **Títulos (Headline)**: `'Playfair Display'`, serifada clássica. Passa a ideia de tradição, cuidado profissional e elegância.
2. **Textos de Apoio e Tabelas (Body)**: `'PT Sans'`, sem serifa, extremamente legível e limpa para leitura de receitas visuais e especificações técnicas de lentes no celular.
3. **Assinaturas da O.S. (Caligrafia)**: `'Great Vibes'`, cursiva fluida para simular a assinatura manuscrita digital.

---

## Estrutura do Código (Onde Alterar a Identidade Visual?)

Se você quiser trocar as cores oficiais da ótica (ex: adotar tons de azul royal, preto, verde ou prata):

1. **Paleta de Cores**:
   - Edite o arquivo `src/app/globals.css` na seção `:root` e `.dark` (linhas 7 a 53). Modifique os valores HSL de `--background`, `--card`, `--primary`, etc.
2. **Fontes**:
   - Para adicionar novas fontes do Google Fonts, altere o link no `<head>` do arquivo `src/app/layout.tsx` (linhas 93 a 98).
   - Para aplicar nos componentes, atualize as fontes no `tailwind.config.ts` ou mapeie as classes utilitárias.
3. **Logomarca**:
   - As logomarcas podem ser inseridas na pasta `public/` (ex: `public/logo.png`) e serão automaticamente lidas pelos componentes de cabeçalho (`Header`), rodapé (`Footer`) e gerador de PDF (`WorkOrderGenerator`).
