# Timevision Ótica Detect Map

- **Scope:** Varredura completa do projeto
- **Mapped:** 2026-09-26

## Findings

### Credencial hardcoded no painel admin

- **What it is:** O painel administrativo contém um fallback literal hardcoded — o e-mail `admin@timevision.com.br` é usado como valor padrão em múltiplas atribuições de `criadoPor`, `vendedorId` e também como identidade do "desenvolvedor" que é autenticado no modo offline sem verificar senha real. Na linha 1635, qualquer um pode entrar como administrador no modo offline apenas digitando esse e-mail.
- **Why it matters:** Qualquer pessoa com acesso ao código-fonte — ou que tente esse e-mail no modo offline — pode se autenticar como administrador sem precisar de uma senha real. Isso expõe todos os dados de clientes, vendas e configurações fiscais.
- **Evidence:** A função de login offline no componente de admin, que define `currentUser` com o e-mail literal `admin@timevision.com.br` e armazena `tv_admin_auth: true` no localStorage sem validação de senha.

### Link de reset de senha exposto na resposta da API

- **What it is:** O endpoint de redefinição de senha retorna o link de reset diretamente no corpo da resposta JSON (campo `debugLink`), mesmo em produção. O link contém o e-mail do usuário como parâmetro de URL não assinado.
- **Why it matters:** Qualquer script ou atacante que faça uma requisição ao endpoint de reset para qualquer e-mail da equipe recebe de volta o link de acesso direto ao painel, sem precisar de acesso ao e-mail de recuperação. O link não é um token assinado, o que o torna previsível e reutilizável.
- **Evidence:** O campo `debugLink` no objeto retornado pelo `POST /api/auth/reset-password`, construído com `encodeURIComponent(email)` e enviado diretamente na resposta.

### Página de rastreamento expõe dados de clientes sem autenticação

- **What it is:** A página pública `/rastreamento` permite consultar qualquer Ordem de Serviço pelo CPF do cliente ou número da O.S., sem exigir qualquer forma de autenticação. O resultado exibe nome completo do cliente, armação, lentes, e status do pedido.
- **Why it matters:** CPFs são semipúblicos e números de O.S. são sequenciais (TV-1001, TV-1002...). Qualquer pessoa pode enumerar pedidos e acessar dados pessoais e informações de prescrição óptica de todos os clientes, o que constitui violação à LGPD.
- **Evidence:** A função `handleSearch` na página de rastreamento, que chama `getItems('vendas')` sem checar `auth.currentUser` e exibe `clienteNome`, produtos e status para qualquer resultado encontrado.

### Endpoint de login sem rate limiting ou anti-automação

- **What it is:** O fluxo de autenticação do painel admin, que usa Firebase Auth (`signInWithEmailAndPassword`) no modo online e uma comparação de localStorage no modo offline, não tem nenhuma limitação de tentativas, progressão de delay ou proteção contra bots.
- **Why it matters:** Um atacante pode tentar senhas indefinidamente contra qualquer e-mail da equipe (os 4 endereços estão hardcoded na rota de reset), fazendo brute force ou credential stuffing sem nenhum custo adicional ou bloqueio.
- **Evidence:** As funções de login e primeiro acesso no componente admin, e a lista fixa `TEAM_EMAILS` na rota de reset que funciona como oráculo de enumeração de usuários.

### Senha do localStorage não é protegida

- **What it is:** No modo offline (sem Firebase), a senha definida no primeiro acesso é armazenada diretamente no `localStorage` como texto legível em `tv_pwd_${email}`. A autenticação offline subsequente compara senhas diretamente com esse valor.
- **Why it matters:** O `localStorage` é acessível por qualquer script rodando na mesma origem. Se houver alguma vulnerabilidade XSS, a senha do administrador pode ser roubada diretamente. Além disso, senhas nunca devem ser armazenadas legíveis — nem mesmo no cliente.
- **Evidence:** A linha `localStorage.setItem(\`tv_pwd_${emailLower}\`, firstAccessPassword)` no fluxo de primeiro acesso do painel admin.

### ReDoS em script de busca administrativa (search-admin.py)

- **What it is:** O script utilitário `search-admin.py` constrói expressões regulares dinamicamente concatenando palavras-chave com o padrão `\\b` e aplica `re.search` sobre o conteúdo do arquivo admin. O hook de regex sinalizou esse arquivo como tendo regexes potencialmente vulneráveis a ReDoS.
- **Why it matters:** Se alguma dessas palavras-chave viesse de entrada externa (ou o arquivo lido fosse controlado por um atacante), uma regex construída dinamicamente poderia travar o interpretador Python em backtracking exponencial. No estado atual é um risco baixo por ser um script interno, mas o padrão de construção dinâmica de regex deve ser eliminado.
- **Evidence:** O loop `for kw in keywords: re.search(r'\\b' + kw + r'\\b', line, re.IGNORECASE)` em `search-admin.py`.

## Applied sub-skills

- `.lagune/skills/secrets.md`: "Credencial hardcoded no painel admin" e "Link de reset de senha exposto na resposta da API"
- `.lagune/skills/access-control.md`: "Página de rastreamento expõe dados de clientes sem autenticação", "Endpoint de login sem rate limiting ou anti-automação", "Senha do localStorage não é protegida"
- `.lagune/skills/credential-endpoint.md`: "Endpoint de login sem rate limiting ou anti-automação"
- `.lagune/skills/http-request.md`: verificado — nenhum CORS bypassável encontrado (hook retornou limpo)
- `.lagune/skills/regex.md` [required]: "ReDoS em script de busca administrativa" — hook encontrou regex construída dinamicamente em `search-admin.py` e sinalizou `src/app/admin/page.tsx`
