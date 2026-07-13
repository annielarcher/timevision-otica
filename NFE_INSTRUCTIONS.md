# 🕶️ Guia de Ativação: Emissão de Nota Fiscal Eletrônica (NFC-e)

Este guia descreve como configurar e ativar a emissão direta de Notas Fiscais de Consumidor Eletrônicas (NFC-e) integrada ao painel administrativo da **Timevision Ótica**.

---

## 📋 Pré-requisitos Fiscais

Para que a API local consiga assinar e transmitir notas com validade jurídica perante a SEFAZ (Secretaria de Estado de Fazenda), você precisa providenciar:

1. **Certificado Digital A1 (e-CNPJ)**:
   - Formato do arquivo: `.pfx` ou `.p12`.
   - É o arquivo digital que identifica a sua empresa e assina as notas fiscais.
2. **Inscrição Estadual (IE)** ativa.
3. **Credenciamento na SEFAZ** para emissão de NFC-e (modelo 65):
   - Deve ser solicitado junto ao portal da SEFAZ do seu estado (ex: SEFAZ-RJ).
4. **Token CSC (Código de Segurança do Contribuinte)**:
   - Gerado no portal da SEFAZ. Você receberá um **ID do Token** (ex: `000001`) e um **Valor do Token** (uma chave de segurança longa).

---

## 🛠️ Passo a Passo para Ativação no Painel

Siga as instruções abaixo para ativar a emissão:

### Passo 1: Acessar as Configurações
1. Faça login no **Painel Admin** da Timevision (`/admin`).
2. Acesse a aba **Financeiro** no menu horizontal.
3. Clique no sub-botão **Configurações Fiscais** localizado no canto superior direito do painel financeiro.

### Passo 2: Preencher as Informações Fiscais
Preencha o formulário com os dados exatos obtidos na SEFAZ:
- **CNPJ da Empresa**
- **Inscrição Estadual (IE)**
- **Razão Social** (Nome oficial registrado na receita)
- **ID do Token CSC** e o **Token CSC**

### Passo 3: Carregar o Certificado Digital A1
1. No campo **Arquivo do Certificado A1**, clique para fazer o upload e selecione o arquivo `.pfx` ou `.p12` do seu e-CNPJ.
2. Informe a **Senha do Certificado** cadastrada na compra do e-CNPJ.
3. Um indicador verde `✓ Certificado Carregado e Pronto para Uso` será exibido na tela confirmando a leitura segura do arquivo.

### Passo 4: Salvar e Testar
1. Clique em **Salvar Configurações Fiscais**. Os dados serão persistidos de forma segura e criptografada no banco de dados.
2. Vá para a aba **Resumo e Lançamentos**, localize a tabela **Auditoria de Pedidos** e clique em **Emitir Nota Fiscal** em qualquer venda concluída.
3. O sistema enviará os dados para a API local (`/api/nfe/emit`), gerará o XML estruturado na especificação **Layout 4.00**, enviará à SEFAZ e retornará a chave de acesso.

---

## ⚠️ Códigos de Retorno Comuns da SEFAZ

Ao emitir notas em ambiente de testes ou produção, a SEFAZ pode retornar alguns status:

- **Status 100 (Autorizado)**: A nota foi validada e transmitida com sucesso. O DANFE pode ser impresso.
- **Rejeição 203 (Emissor não habilitado)**: CNPJ ou Inscrição Estadual não credenciada na SEFAZ para emitir NFC-e. Verifique se o credenciamento foi homologado.
- **Rejeição 464 (Certificado expirado/inválido)**: O arquivo do certificado digital carregado venceu ou a senha digitada está incorreta.
- **Rejeição 539 (Duplicidade de nota)**: O ID do pedido já foi enviado à SEFAZ como nota emitida anteriormente. O sistema previne duplicidades automaticamente.
