# Timevision Ótica Defense Plan

- **Scope:** Varredura completa do projeto
- **Planned:** 2026-09-26

## Fixes

### Credencial hardcoded no painel admin

- **Category:** Hardcoded Credentials (CWE-798)
- **CVSS:** CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical)
- **Priority:** Critical
- **Why this priority:** Um atacante pode acessar o painel de administração diretamente no modo offline sem uma senha, o que permite controle total sobre dados de clientes, Vendas e emissão de NFe, configurando o risco máximo para a aplicação.
- **Upholds:** I. Segredos nunca vivem no código ou no histórico do repositório, II. A rota `/admin` e todas as operações de escrita exigem autenticação verificada
- **Fix:** Remover o e-mail literal `admin@timevision.com.br` dos fallbacks. Remover a lógica de autenticação offline automática baseada apenas em checar a string do e-mail. Caso seja modo offline, usar armazenamento de usuários adequadamente e forçar login autêntico.
- **References:** [CWE-798: Use of Hard-coded Credentials](https://cwe.mitre.org/data/definitions/798.html)

### Link de reset de senha exposto na resposta da API

- **Category:** Information Exposure (CWE-200)
- **CVSS:** CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:N/VA:N/SC:H/SI:H/SA:H (8.7, High)
- **Priority:** High
- **Why this priority:** Expor o link de reset na resposta HTTP permite que qualquer um que chame a API ganhe acesso à redefinição de senha de usuários da equipe, contornando a segurança de e-mail.
- **Upholds:** II. A rota `/admin` e todas as operações de escrita exigem autenticação verificada
- **Fix:** Remover o campo `debugLink` da resposta JSON retornado em `/api/auth/reset-password`. Enviar o link estritamente por e-mail. Se for para modo de teste/dev, imprimir apenas no log do servidor (console.log).

### Página de rastreamento expõe dados de clientes sem autenticação

- **Category:** Insecure Direct Object Reference / IDOR (CWE-639)
- **CVSS:** CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:N/VA:N/SC:N/SI:N/SA:N (8.7, High)
- **Priority:** High
- **Why this priority:** Consultar dados via CPF ou número sequencial de OS permite raspagem massiva de dados pessoais de clientes e suas receitas, o que viola a privacidade, mas não afeta a integridade do sistema inteiro.
- **Upholds:** III. Todo dado externo é não confiável até validado
- **Fix:** Passar a exigir dois fatores combinados (ex: CPF *e* Número do Pedido juntos) para encontrar a O.S., ou mascarar parcialmente os dados do cliente (ex: C*** L*** da S***) na interface pública, para evitar vazamento total.
- **References:** [CWE-639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html)

### Endpoint de login sem rate limiting ou anti-automação

- **Category:** Improper Restriction of Excessive Authentication Attempts (CWE-307)
- **CVSS:** CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:N/SC:N/SI:N/SA:N (8.8, High)
- **Priority:** High
- **Why this priority:** A ausência de limites permite varreduras ilimitadas de senhas (brute-force) o que, ao longo do tempo, invariavelmente levará a um comprometimento da conta administrativa.
- **Upholds:** II. A rota `/admin` e todas as operações de escrita exigem autenticação verificada
- **Fix:** Implementar *rate limiting* e um backoff exponencial local nas rotas e na interface de login e reset de senha. Em caso de muitas tentativas seguidas falhas para o mesmo e-mail ou IP, bloquear o endpoint por um período.

### Senha do localStorage não é protegida

- **Category:** Cleartext Storage of Sensitive Information (CWE-312)
- **CVSS:** CVSS:4.0/AV:L/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:N/SC:N/SI:N/SA:N (7.0, Medium)
- **Priority:** Medium
- **Why this priority:** A senha administrativa armazenada em texto plano no `localStorage` pode ser lida via ataques XSS, embora demande acesso local ao computador ou um segundo vetor de ataque já realizado no browser da vítima.
- **Upholds:** II. A rota `/admin` e todas as operações de escrita exigem autenticação verificada
- **Depends on:** Credencial hardcoded no painel admin
- **Fix:** Nunca armazenar a senha legível. Fazer o hash da senha usando SubtleCrypto (SHA-256 com salt fixo, pelo menos) antes de salvar no localStorage, e comparar os hashes na hora de logar offline.

### ReDoS em script de busca administrativa (search-admin.py)

- **Category:** Regular Expression Denial of Service / ReDoS (CWE-1333)
- **CVSS:** CVSS:4.0/AV:L/AC:L/AT:N/PR:H/UI:N/VC:N/VI:N/VA:L/SC:N/SI:N/SA:N (2.1, Low)
- **Priority:** Low
- **Why this priority:** É um script utilitário de ambiente de desenvolvedor e as keywords atuais são controladas pelo dev, mas é uma má prática. Não tem reflexo direto em produção.
- **Upholds:** III. Todo dado externo é não confiável até validado
- **Fix:** Aplicar `re.escape()` em cada palavra-chave na construção dinâmica da expressão regular no script Python para garantir que meta-caracteres não afetem a engine do regex.
