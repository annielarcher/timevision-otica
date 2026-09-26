# Timevision Ótica Security Charter

## Principles

### I. Segredos nunca vivem no código ou no histórico do repositório

Nunca comite chaves de API, credenciais do Firebase, tokens ou qualquer segredo. Sempre carregue segredos via variáveis de ambiente (`.env.local`) e confirme que `.env.local` está no `.gitignore` antes de qualquer commit.

- Why: Uma chave do Firebase ou API key exposta no histórico do git é uma conta comprometida de forma permanente. O histórico do git é público e para sempre — mesmo após uma remoção posterior, bots já terão copiado os dados.

### II. A rota `/admin` e todas as operações de escrita exigem autenticação verificada

Sempre valide o estado de autenticação Firebase no servidor (via Firebase Admin SDK ou middleware Next.js) antes de renderizar ou processar qualquer rota administrativa. Nunca confie apenas no estado client-side para proteger dados sensíveis.

- Why: Autenticação apenas no lado cliente pode ser contornada diretamente via requests à API. Dados de clientes, pedidos e informações financeiras do painel PDV devem ser acessíveis somente a usuários autenticados e verificados.

### III. Todo dado externo é não confiável até validado

Sempre valide e sanitize toda entrada vinda de formulários, parâmetros de URL (ex: número de O.S. no rastreamento) e dados externos com Zod ou schema equivalente antes de qualquer uso em queries, PDFs ou saída em tela. O DOMPurify já presente no projeto DEVE ser aplicado em todo conteúdo HTML dinâmico.

- Why: Entrada não validada é o ponto de entrada de ataques de injeção — seja em queries Firestore, no gerador de PDF ou em saídas HTML. O campo de rastreamento de O.S. aceita entrada pública e é superfície de risco direta.

### IV. As regras do Firestore nunca devem permitir escrita pública irrestrita

As regras do Firestore DEVEM exigir `request.auth != null` para toda operação de escrita. A regra atual `allow read: if true` na coleção `/equipe` é aceitável apenas se esses dados são realmente públicos — confirme antes de expandir. Nunca amplie o acesso de leitura pública sem revisão explícita.

- Why: Uma regra permissiva no Firestore expõe dados de clientes, pedidos e estoque para qualquer pessoa na internet, violando a privacidade dos clientes e a integridade do negócio.

### V. O conteúdo gerado por IA (Genkit/Gemini) não é confiável como dado de sistema

Nunca use saída do Genkit/Gemini diretamente em queries Firestore, comandos de sistema ou como HTML sem sanitização. Sempre trate respostas de IA como dado externo não confiável, validando e escapando antes do uso.

- Why: Prompt injection e saídas inesperadas de modelos de linguagem podem resultar em dados corrompidos, XSS ou comportamento imprevisível se a saída for usada diretamente sem validação.

### VI. PDFs e downloads gerados nunca expõem dados de outros clientes

O gerador de O.S. e flyer DEVE operar apenas com os dados do contexto autenticado atual. Nunca aceite IDs de documentos Firestore diretamente de parâmetros de URL sem verificar que pertencem ao usuário autenticado.

- Why: Referência direta a objetos inseguros (IDOR) em geradores de PDF pode expor Ordens de Serviço de outros clientes, vazando dados pessoais e informações médicas de prescrição óptica.

## Baseline discipline

Lagune holds this charter, every principle, every time. A principle is not suspended because a control looks small, familiar, or unlikely to be hit. This is not a judgement call.

### Only the controls the project needs

Lagune recommends and applies only the controls this project's context calls for. A control the project does not need is never added for completeness, and a generic checklist is not thoroughness. Every later phase acts on what the system actually does, never on what it might hypothetically do.

- Why: effort spent on risks the project does not have buries the risks it does have. Fewer, right-sized controls are easier to apply, prove, and keep true than a checklist no one finishes.

### Prefer the simplest vetted control

When a control is needed, reach for the safest option already proven, in order: a control this project already has, then a platform or framework built-in, then a well-maintained vetted library, and only then custom code. Never hand-roll a security primitive (cryptography, escaping, authentication, sessions) that a vetted standard already provides. A new dependency is new attack surface, justified and not assumed. Code, an endpoint, or a feature the project does not use is attack surface too, so removing it is itself a control.

- Why: hand-rolled security is where subtle, unaudited bugs live, and a second control duplicating an existing one is the one that gets forgotten and drifts. Boring, standard controls are easier to audit and harder to get wrong, and less surface is less to defend.

### When a control seems skippable

A control is held even when a reason to skip it feels reasonable:

- "Too small to need a control": small gaps are where breaches start.
- "Already handled elsewhere": assumed coverage is exactly how gaps hide.
- "Unlikely to be hit": attackers target the path no one is watching.
- "It works, ship it": working and safe are different claims, and the charter requires both.

## Governance

Este charter é mantido junto ao código e revisado sempre que uma nova funcionalidade de autenticação, acesso a dados ou integração externa for adicionada. Qualquer alteração nos princípios requer incremento de versão e registro da data. O Lagune é executado nas fases detect → plan → harden → verify a cada ciclo relevante de desenvolvimento.

Version: 1.0.0 | Ratified: 2026-09-26
