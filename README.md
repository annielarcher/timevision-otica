# 🕶️ Timevision Ótica — Plataforma Web & Painel PDV

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

> Boutique óptica de alto padrão no Recreio dos Bandeirantes, Rio de Janeiro.
> Site institucional + painel administrativo PDV móvel para atendimentos corporativos itinerantes.

---

## ✨ Sobre o Projeto

A **Timevision Ótica** é uma boutique óptica que une sofisticação, curadoria de armações internacionais e tecnologia de ponta em lentes. O projeto consiste em:

- **Site Institucional** — Vitrine editorial de luxo com catálogo de grifes, guia de lentes, sistema de orçamento VIP via WhatsApp e rastreamento de pedidos.
- **Painel Administrativo (PDV Móvel)** — Sistema completo de ponto de venda, controle de estoque, banco de clientes, calculadora de custo/lucro, gerador de Ordem de Serviço em PDF (A4 com 2 vias A6) e gerador de material publicitário.

### Principais Funcionalidades

| Módulo | Funcionalidades |
|---|---|
| **Site Público** | Hero editorial, catálogo de grifes, comparador de lentes, orçamento VIP (WhatsApp), rastreamento de O.S. |
| **Painel Admin** | Dashboard financeiro, venda rápida (PDV), cadastro de clientes, controle de estoque, gerador de O.S. (PDF), gerador de flyer de marketing |
| **Infraestrutura** | Firebase Auth + Firestore (com fallback LocalStorage offline), SEO otimizado, responsivo mobile-first |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **UI** | React 19, Tailwind CSS, shadcn/ui, Lucide Icons |
| **Tipografia** | Lora (Google Fonts), Soligant (display), Identification 05C (tagline) |
| **Backend** | Firebase Auth, Cloud Firestore (com fallback LocalStorage) |
| **PDF** | jsPDF (geração client-side de O.S. e material de marketing) |
| **Deploy** | Firebase App Hosting |

---

## 📁 Estrutura do Projeto

```
oticastimevision/
│
├── TIMEVISION_MANUAL_DE_MARCA.md           ← Manual de identidade visual (agência ThalitaKume®)
├── TIMEVISION_CONTEXTO_PARA_DESENVOLVIMENTO_WEB.md  ← Contexto técnico para desenvolvimento
│
├── docs/                                    ← Documentação estrutural do projeto
│   ├── TIMEVISION_ESTRUTURA_E_WIREFRAME_TEXTUAL.md   — Wireframe seção por seção
│   ├── TIMEVISION_DESIGN_TOKENS.md                   — Tokens CSS (cores, tipografia, espaçamento)
│   ├── TIMEVISION_MODELO_DE_DADOS.md                 — Schema Firestore / LocalStorage
│   ├── TIMEVISION_FLUXOS_E_REGRAS_DE_NEGOCIO.md      — Jornadas de usuário e regras do sistema
│   ├── TIMEVISION_CONTEUDO_E_COPY.md                 — Textos de cada seção e SEO
│   ├── TIMEVISION_INVENTARIO_DE_ASSETS.md             — Checklist de assets visuais
│   └── visual_identity.md                             — Resumo rápido de tokens visuais
│
├── public/                                  ← Assets estáticos
│   ├── fonts/                               — Fontes customizadas (.woff2)
│   ├── logos/                               — Logotipos SVG/PNG (todas as variações)
│   ├── pattern/                             — Pattern institucional de losangos
│   ├── labs/                                — Logos dos laboratórios parceiros
│   ├── products/                            — Fotos de armações (still-life)
│   ├── hero/                                — Imagens hero (banners editoriais)
│   └── testimonials/                        — Fotos de clientes
│
├── src/
│   ├── app/                                 ← Rotas (App Router)
│   │   ├── page.tsx                         — Home (vitrine principal)
│   │   ├── sobre/                           — /sobre (a boutique)
│   │   ├── laboratorios/                    — /laboratorios (parceiros tecnológicos)
│   │   ├── rastreamento/                    — /rastreamento (consulta de O.S.)
│   │   ├── admin/                           — /admin (painel PDV protegido)
│   │   ├── layout.tsx                       — Layout global (header, footer, fonts)
│   │   ├── globals.css                      — Estilos globais e design tokens
│   │   ├── robots.ts                        — Configuração de robots.txt
│   │   └── sitemap.ts                       — Sitemap XML dinâmico
│   │
│   ├── components/
│   │   ├── layout/                          — Header, Footer, Navbar
│   │   ├── sections/                        — Seções da home (Hero, Testimonials, etc.)
│   │   ├── ui/                              — Componentes base (Button, Card, Input, etc.)
│   │   ├── WorkOrderGenerator.tsx           — Gerador de O.S. em PDF (A4, 2 vias A6)
│   │   ├── MarketingFlyer.tsx               — Gerador de flyer/banner publicitário
│   │   └── contact-form.tsx                 — Formulário de contato/orçamento
│   │
│   ├── lib/
│   │   └── firebase.ts                      — Config Firebase, tipos TS e CRUD genérico
│   │
│   └── hooks/
│       └── use-toast.ts                     — Hook de notificações toast
│
├── next.config.ts                           — Config Next.js (Webpack aliases)
├── tailwind.config.ts                       — Config Tailwind (cores, fontes, animações)
├── package.json                             — Dependências e scripts
└── apphosting.yaml                          — Config Firebase App Hosting
```

---

## 🎨 Identidade Visual

A marca foi desenvolvida pela agência **ThalitaKume® — Marketing Digital Agency & Design**.

| Token | Valor | Uso |
|---|---|---|
| Off-white | `#F9F7F8` | Fundo padrão |
| Grafite | `#3D3D3D` | Texto principal, logo positiva |
| Cinza Médio | `#585858` | Texto secundário |
| **Dourado** | `#B5996A` | **Cor de destaque/luxo** — CTAs, bordas, hovers |
| Vinho | `#900D13` | Badges institucionais |
| Azul Petróleo | `#004168` | Seções de tecnologia |

**Tipografia:** `Soligant` (wordmark) · `Identification 05C` (taglines uppercase) · `Lora` (corpo de texto)

> Documentação completa em [`docs/TIMEVISION_DESIGN_TOKENS.md`](docs/TIMEVISION_DESIGN_TOKENS.md)

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/annielarcher/timevision-otica.git

# 2. Acesse a pasta do projeto
cd timevision-otica

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Acesse no navegador
# http://localhost:3000
```

### Painel Admin (modo offline)
- Acesse `http://localhost:3000/admin`
- **E-mail:** `admin@timevision.com`
- **Senha:** `timevision123`

### Build de Produção

```bash
npm run build
npm start
```

---

## 🔥 Firebase (opcional)

O sistema funciona 100% offline com LocalStorage. Para habilitar o Firebase, crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 📚 Documentação do Projeto

Toda a documentação estrutural está em [`docs/`](docs/):

| Documento | Conteúdo |
|---|---|
| [Wireframe Textual](docs/TIMEVISION_ESTRUTURA_E_WIREFRAME_TEXTUAL.md) | Arquitetura de páginas e componentes seção por seção |
| [Design Tokens](docs/TIMEVISION_DESIGN_TOKENS.md) | CSS custom properties, tipografia, espaçamento, animações |
| [Modelo de Dados](docs/TIMEVISION_MODELO_DE_DADOS.md) | Schemas TypeScript/Firestore, índices e regras de segurança |
| [Fluxos & Regras](docs/TIMEVISION_FLUXOS_E_REGRAS_DE_NEGOCIO.md) | Jornadas de usuário, lógica de PDV, numeração de O.S. |
| [Conteúdo & Copy](docs/TIMEVISION_CONTEUDO_E_COPY.md) | Textos definitivos, metatags SEO, mensagens WhatsApp |
| [Inventário de Assets](docs/TIMEVISION_INVENTARIO_DE_ASSETS.md) | Checklist de fontes, logos, fotos, ícones e status |

---

## 🏪 Laboratórios Parceiros

| Nacional | Internacional |
|---|---|
| Padrão Óptico | Zeiss |
| Haytek | Essilor |
| Digilab | Hoyalux |

---

## 👩‍💻 Autora

**Annie Larcher** — Desenvolvedora Front-End

---

## 📄 Licença

Este projeto é privado. Design e identidade visual por **ThalitaKume® Agency**.

© 2026 Timevision Ótica — Todos os direitos reservados.
