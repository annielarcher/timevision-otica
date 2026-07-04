import { useState } from "react";
import {
  MapPin, Instagram, Clock, Star, ArrowRight, Menu, X,
  Check, Package, CheckCircle, ShoppingBag, Users, BarChart2,
  FileText, Search, ChevronRight, Eye, Send, AlertCircle,
  Printer, Download, Plus, Image as ImageIcon, Phone,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type Page = "home" | "sobre" | "colecoes" | "lentes" | "orcamento" | "rastreamento" | "admin";
type AdminTab = "dashboard" | "pdv" | "clientes" | "estoque" | "os" | "flyer";

const GOLD = "#B5996A";
const GRAPHITE = "#3D3D3D";
const WINE = "#900D13";
const PETROL = "#004168";
const OFF_WHITE = "#F9F7F8";
const GRAY = "#585858";

const FONT_DISPLAY = "'Bodoni Moda', serif";
const FONT_BODY = "'Lora', serif";
const FONT_LABEL = "'Josefin Sans', sans-serif";

const diamondPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z' fill='none' stroke='%23B5996A' stroke-width='0.5'/%3E%3C/svg%3E")`;

// ─── SHARED ───────────────────────────────────────────────────────────────────

function Logo({ inverted = false, size = "md" }: { inverted?: boolean; size?: "sm" | "md" | "lg" }) {
  const s = { sm: { title: "1.05rem", sub: "0.5rem" }, md: { title: "1.5rem", sub: "0.58rem" }, lg: { title: "2.1rem", sub: "0.75rem" } }[size];
  return (
    <div className="flex flex-col leading-none select-none" style={{ gap: "3px" }}>
      <span style={{ fontFamily: FONT_DISPLAY, letterSpacing: "0.08em", color: inverted ? OFF_WHITE : GRAPHITE, fontSize: s.title, fontWeight: 700, lineHeight: 1 }}>
        TIMEVISION
      </span>
      <span style={{ fontFamily: FONT_LABEL, letterSpacing: "0.32em", color: GOLD, fontSize: s.sub, fontWeight: 300, textTransform: "uppercase" }}>
        ÓTICA · RECREIO · RJ
      </span>
    </div>
  );
}

function Badge({ children, variant = "gold" }: { children: React.ReactNode; variant?: "gold" | "wine" | "petrol" }) {
  const c = { gold: { bg: GOLD, color: OFF_WHITE }, wine: { bg: WINE, color: OFF_WHITE }, petrol: { bg: PETROL, color: OFF_WHITE } }[variant];
  return (
    <span className="inline-block px-3 py-1 text-xs" style={{ background: c.bg, color: c.color, fontFamily: FONT_LABEL, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 400 }}>
      {children}
    </span>
  );
}

function Btn({ children, variant = "gold", onClick, className = "", type = "button" }: {
  children: React.ReactNode; variant?: "gold" | "wine" | "petrol" | "outline" | "outline-light";
  onClick?: () => void; className?: string; type?: "button" | "submit";
}) {
  const s = {
    gold: { background: GOLD, color: OFF_WHITE, border: `1px solid ${GOLD}` },
    wine: { background: WINE, color: OFF_WHITE, border: `1px solid ${WINE}` },
    petrol: { background: PETROL, color: OFF_WHITE, border: `1px solid ${PETROL}` },
    outline: { background: "transparent", color: GRAPHITE, border: `1px solid ${GRAPHITE}` },
    "outline-light": { background: "transparent", color: OFF_WHITE, border: `1px solid rgba(249,247,248,0.6)` },
  }[variant];
  return (
    <button type={type} onClick={onClick} className={`inline-flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase transition-all duration-200 hover:opacity-75 active:scale-[0.98] ${className}`} style={{ ...s, fontFamily: FONT_LABEL, letterSpacing: "0.2em" }}>
      {children}
    </button>
  );
}

function SectionTitle({ label, title, subtitle, light = false, center = false }: { label?: string; title: string; subtitle?: string; light?: boolean; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      {label && <p className="mb-3 text-xs tracking-widest uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.3em" }}>{label}</p>}
      <h2 className="mb-4" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.75rem, 4vw, 2.9rem)", fontWeight: 700, color: light ? OFF_WHITE : GRAPHITE, lineHeight: 1.15, letterSpacing: "0.02em" }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: FONT_BODY, color: light ? "rgba(249,247,248,0.7)" : GRAY, fontSize: "1rem", lineHeight: 1.75, maxWidth: "36rem", ...(center ? { margin: "0 auto" } : {}) }}>{subtitle}</p>}
    </div>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

const products = [
  { id: 1, brand: "Ray-Ban", name: "Clubmaster RB3016", category: "Masculino", price: "R$ 1.290", img: "1511499767150-a48a237f0083" },
  { id: 2, brand: "Tom Ford", name: "FT5634-B Blue Block", category: "Feminino", price: "R$ 3.850", img: "1574258495973-f010dfbb5371" },
  { id: 3, brand: "Gucci", name: "GG0010S Titanium", category: "Solar", price: "R$ 4.200", img: "1508214751196-bcfd4ca60f91" },
  { id: 4, brand: "Prada", name: "PR 56ZS Minimal", category: "Feminino", price: "R$ 3.650", img: "1548036161-4b6c6f931c27" },
  { id: 5, brand: "Oakley", name: "Holbrook XL", category: "Solar", price: "R$ 890", img: "1511499767150-a48a237f0083" },
  { id: 6, brand: "Timevision", name: "Signature No. 3", category: "Titânio", price: "R$ 2.100", img: "1574258495973-f010dfbb5371" },
];

function ProductCard({ product, onContact }: { product: typeof products[0]; onContact?: () => void }) {
  return (
    <div className="group relative overflow-hidden" style={{ background: "#1A1A1A" }}>
      <div className="relative overflow-hidden h-64 bg-zinc-900">
        <img
          src={`https://images.unsplash.com/photo-${product.img}?w=400&h=300&fit=crop&auto=format&q=75`}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
        <div className="absolute top-3 left-3">
          <Badge variant={product.category === "Titânio" ? "petrol" : "gold"}>{product.category}</Badge>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs mb-1" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase" }}>{product.brand}</p>
        <h3 className="mb-3 text-base" style={{ fontFamily: FONT_BODY, color: OFF_WHITE, fontWeight: 500 }}>{product.name}</h3>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: FONT_DISPLAY, color: GOLD, fontSize: "1.1rem", fontWeight: 700 }}>{product.price}</span>
          <button onClick={onContact} className="text-xs py-2 px-4 transition-all hover:opacity-75" style={{ fontFamily: FONT_LABEL, color: GRAPHITE, background: GOLD, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Consultar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const testimonials = [
  { name: "Fernanda Albuquerque", initials: "FA", rating: 5, text: "Atendimento impecável! Fui orientada com muito cuidado na escolha da armação ideal. As lentes Zeiss são de outra qualidade. Recomendo de olhos fechados." },
  { name: "Rodrigo Mendonça", initials: "RM", rating: 5, text: "Comprei meus óculos Tom Ford e adorei cada detalhe da experiência. Um ambiente sofisticado e profissionais extremamente qualificados no Recreio." },
  { name: "Ana Paula Silveira", initials: "AS", rating: 5, text: "Uso óculos há 20 anos e nunca fui tão bem atendida. A qualidade das lentes Essilor é incomparável. A Timevision é referência absoluta no Recreio." },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="relative p-8 overflow-hidden" style={{ background: OFF_WHITE }}>
      <div className="absolute bottom-2 right-3 opacity-[0.04] pointer-events-none" style={{ fontFamily: FONT_DISPLAY, fontSize: "7rem", color: GRAPHITE, fontWeight: 700, lineHeight: 1 }}>TV</div>
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={13} fill={GOLD} color={GOLD} />)}
      </div>
      <p className="mb-6 italic relative z-10" style={{ fontFamily: FONT_BODY, color: GRAPHITE, lineHeight: 1.85, fontSize: "0.95rem" }}>"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: GRAPHITE, color: GOLD, fontFamily: FONT_LABEL }}>
          {t.initials}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ fontFamily: FONT_BODY, color: GRAPHITE }}>{t.name}</p>
          <p className="text-xs" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase" }}>Cliente Verificada</p>
        </div>
      </div>
    </div>
  );
}

// ─── PRESCRIPTION GRID ────────────────────────────────────────────────────────

type RxData = { od?: Record<string, string>; oe?: Record<string, string>; dnp?: string; altura?: string };

function PrescriptionGrid({ value, onChange }: { value: RxData; onChange: (v: RxData) => void }) {
  const fields = [{ label: "Esférico", key: "esferico" }, { label: "Cilíndrico", key: "cilindrico" }, { label: "Eixo", key: "eixo" }, { label: "Adição", key: "adicao" }];
  const eyes: { label: string; key: "od" | "oe" }[] = [{ label: "OD — Olho Direito", key: "od" }, { label: "OE — Olho Esquerdo", key: "oe" }];
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: GRAPHITE }}>
              <th className="p-3 text-left" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.18em", fontSize: "0.65rem", textTransform: "uppercase", fontWeight: 400 }}>Olho</th>
              {fields.map(f => <th key={f.key} className="p-3 text-center" style={{ fontFamily: FONT_LABEL, color: OFF_WHITE, letterSpacing: "0.12em", fontSize: "0.65rem", textTransform: "uppercase", fontWeight: 400 }}>{f.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {eyes.map(eye => (
              <tr key={eye.key} style={{ borderBottom: "1px solid rgba(61,61,61,0.1)" }}>
                <td className="p-3 whitespace-nowrap" style={{ fontFamily: FONT_LABEL, color: GRAPHITE, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{eye.label}</td>
                {fields.map(f => (
                  <td key={f.key} className="p-2 text-center">
                    <input
                      type="text"
                      placeholder="—"
                      value={value?.[eye.key]?.[f.key] || ""}
                      onChange={e => onChange({ ...value, [eye.key]: { ...(value?.[eye.key] || {}), [f.key]: e.target.value } })}
                      className="w-full text-center p-2 text-sm outline-none transition-colors"
                      style={{ fontFamily: FONT_BODY, border: "1px solid rgba(61,61,61,0.18)", background: OFF_WHITE, color: GRAPHITE }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-4">
        {[{ label: "DNP (mm)", key: "dnp", placeholder: "Ex: 32/33" }, { label: "Altura (mm)", key: "altura", placeholder: "Ex: 20/21" }].map(f => (
          <div key={f.key} className="flex-1">
            <label className="block mb-1.5 text-xs tracking-widest uppercase" style={{ fontFamily: FONT_LABEL, color: GRAPHITE, letterSpacing: "0.18em" }}>{f.label}</label>
            <input
              type="text"
              placeholder={f.placeholder}
              value={(value as any)?.[f.key] || ""}
              onChange={e => onChange({ ...value, [f.key]: e.target.value })}
              className="w-full p-2 text-sm outline-none"
              style={{ fontFamily: FONT_BODY, border: "1px solid rgba(61,61,61,0.18)", background: OFF_WHITE, color: GRAPHITE }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header({ current, go }: { current: Page; go: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const links: { label: string; page: Page }[] = [
    { label: "A Boutique", page: "sobre" },
    { label: "Coleções", page: "colecoes" },
    { label: "Lentes & Tecnologia", page: "lentes" },
    { label: "Rastreamento", page: "rastreamento" },
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: GRAPHITE, borderBottom: `1px solid ${GOLD}35` }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => go("home")} className="transition-opacity hover:opacity-80">
          <Logo inverted />
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l.page} onClick={() => go(l.page)} className="text-sm transition-all duration-200" style={{ fontFamily: FONT_BODY, color: current === l.page ? GOLD : "rgba(249,247,248,0.72)", borderBottom: `1px solid ${current === l.page ? GOLD : "transparent"}`, paddingBottom: "2px" }}>
              {l.label}
            </button>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Btn variant="gold" onClick={() => go("orcamento")}>Orçamento VIP</Btn>
          <button onClick={() => go("admin")} className="text-xs transition-opacity opacity-25 hover:opacity-50" style={{ color: OFF_WHITE, fontFamily: FONT_LABEL, letterSpacing: "0.15em" }}>ADM</button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ color: OFF_WHITE }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4" style={{ background: GRAPHITE, borderTop: `1px solid ${GOLD}20` }}>
          {links.map(l => (
            <button key={l.page} onClick={() => { go(l.page); setOpen(false); }} className="text-left py-2" style={{ fontFamily: FONT_BODY, color: current === l.page ? GOLD : OFF_WHITE, fontSize: "0.95rem" }}>
              {l.label}
            </button>
          ))}
          <Btn variant="gold" onClick={() => { go("orcamento"); setOpen(false); }}>Orçamento VIP</Btn>
        </div>
      )}
    </header>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ go }: { go: (p: Page) => void }) {
  const pageLabels: Partial<Record<Page, string>> = { sobre: "A Boutique", colecoes: "Coleções & Grifes", lentes: "Lentes & Tecnologia", orcamento: "Orçamento VIP", rastreamento: "Rastreamento" };
  return (
    <footer className="pt-16 pb-8 px-6" style={{ background: GRAPHITE, borderTop: `1px solid ${GOLD}30` }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Logo inverted size="lg" />
            <p className="mt-6 text-sm leading-relaxed max-w-xs" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.6)", lineHeight: 1.8 }}>
              Boutique óptica de alto padrão no Recreio dos Bandeirantes, Rio de Janeiro. Curadoria exclusiva de grifes internacionais e lentes de altíssima precisão.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com/oticastimevision" target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60"><Instagram size={18} color={GOLD} /></a>
              <a href="tel:+5521999999999" className="transition-opacity hover:opacity-60"><Phone size={18} color={GOLD} /></a>
            </div>
          </div>
          <div>
            <p className="mb-5 text-xs tracking-widest uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.3em" }}>Navegação</p>
            {(Object.entries(pageLabels) as [Page, string][]).map(([p, label]) => (
              <button key={p} onClick={() => go(p)} className="block mb-2.5 text-sm text-left transition-colors hover:text-white" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.55)" }}>
                {label}
              </button>
            ))}
          </div>
          <div>
            <p className="mb-5 text-xs tracking-widest uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.3em" }}>Contato</p>
            <div className="flex flex-col gap-4">
              {[
                { Icon: MapPin, text: "Av. das Américas, Recreio dos Bandeirantes, Rio de Janeiro — RJ" },
                { Icon: Instagram, text: "@oticastimevision" },
                { Icon: Clock, text: "Seg–Sex 10h–19h · Sáb 10h–17h" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <Icon size={14} color={GOLD} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.55)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: `${GOLD}20` }}>
          <p className="text-xs" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.3)", letterSpacing: "0.14em" }}>© 2025 TIMEVISION ÓTICA. TODOS OS DIREITOS RESERVADOS.</p>
          <p className="text-xs" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.2)", letterSpacing: "0.12em" }}>DESENVOLVIDO POR THALITAKUME®</p>
        </div>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage({ go }: { go: (p: Page) => void }) {
  const [filter, setFilter] = useState("Todos");
  const filters = ["Todos", "Feminino", "Masculino", "Solar", "Titânio", "Grifes"];
  const grifes = ["Ray-Ban", "Tom Ford", "Gucci", "Prada", "Oakley"];
  const filtered = filter === "Todos" ? products : products.filter(p => p.category === filter || (filter === "Grifes" && grifes.includes(p.brand)));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ height: "88vh", background: GRAPHITE }}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1600&h=1000&fit=crop&auto=format&q=80" alt="Modelo com óculos de luxo" className="w-full h-full object-cover grayscale" style={{ opacity: 0.35 }} />
        </div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: diamondPattern, backgroundSize: "40px 40px" }} />
        <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <Badge variant="gold">Boutique Óptica Atemporal — Recreio dos Bandeirantes, RJ</Badge>
            <h1 className="mt-6 mb-4" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)", color: OFF_WHITE, fontWeight: 700, lineHeight: 1.08, letterSpacing: "0.02em" }}>
              A Elegância<br />que sua Visão<br />Merece
            </h1>
            <p className="mb-10 leading-relaxed" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.72)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: "420px" }}>
              Curadoria exclusiva de armações internacionais, lentes de altíssima precisão e atendimento personalizado.
            </p>
            <div className="flex flex-wrap gap-4">
              <Btn variant="gold" onClick={() => go("orcamento")}>Solicitar Orçamento VIP <ArrowRight size={13} /></Btn>
              <Btn variant="outline-light" onClick={() => go("colecoes")}>Conheça as Coleções</Btn>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-10 opacity-[0.07] pointer-events-none hidden md:block" style={{ fontFamily: FONT_DISPLAY, fontSize: "10rem", color: OFF_WHITE, fontWeight: 700, lineHeight: 1 }}>TV</div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 px-6" style={{ background: OFF_WHITE }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-4 text-xs tracking-widest uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.3em" }}>O Luxo de Enxergar Bem</p>
            <h2 className="mb-6" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)", color: GRAPHITE, fontWeight: 700, lineHeight: 1.2 }}>
              Mais do que óculos.<br />Uma experiência.
            </h2>
            <p className="mb-8 leading-relaxed" style={{ fontFamily: FONT_BODY, color: GRAY, lineHeight: 1.85 }}>
              No coração do Recreio dos Bandeirantes, a Timevision Ótica nasceu com um propósito preciso: oferecer uma experiência boutique única para quem entende que visão é investimento. Cada detalhe reflete nosso compromisso com excelência.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {["Compromisso", "Ética", "Seriedade", "Verdade", "Dedicação", "Respeito", "Responsabilidade", "Honestidade"].map(attr => (
                <div key={attr} className="flex items-center gap-2">
                  <div className="w-1 h-4 flex-shrink-0" style={{ background: GOLD }} />
                  <span style={{ fontFamily: FONT_LABEL, color: GRAPHITE, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.68rem" }}>{attr}</span>
                </div>
              ))}
            </div>
            <Btn variant="outline" onClick={() => go("sobre")}>Nossa História <ChevronRight size={13} /></Btn>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden bg-zinc-200" style={{ aspectRatio: "4/5" }}>
              <img src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=700&h=875&fit=crop&auto=format&q=80" alt="Armações de luxo Timevision" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-6 left-6 p-3" style={{ background: OFF_WHITE }}>
              <Logo size="sm" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border pointer-events-none" style={{ borderColor: GOLD, zIndex: -1 }} />
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="py-24 px-6 relative" style={{ background: GRAPHITE }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: diamondPattern, backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionTitle label="Curadoria Exclusiva" title="Coleções em Destaque" subtitle="Grifes internacionais selecionadas com rigor para compor nossa vitrine boutique." light />
            <Btn variant="outline-light" onClick={() => go("colecoes")}>Ver Todas <ArrowRight size={13} /></Btn>
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-4 py-1.5 text-xs uppercase transition-all duration-200" style={{ fontFamily: FONT_LABEL, letterSpacing: "0.18em", background: filter === f ? GOLD : "transparent", color: filter === f ? OFF_WHITE : "rgba(249,247,248,0.45)", border: `1px solid ${filter === f ? GOLD : "rgba(249,247,248,0.2)"}` }}>
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} onContact={() => go("orcamento")} />)}
          </div>
        </div>
      </section>

      {/* LENSES */}
      <section className="py-24 px-6" style={{ background: PETROL }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="gold">Tecnologia & Procedência</Badge>
            <h2 className="mt-5 mb-4" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.75rem, 4vw, 3rem)", color: OFF_WHITE, fontWeight: 700 }}>É de verdade!</h2>
            <p className="max-w-xl mx-auto" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.7)", lineHeight: 1.8 }}>
              Transparência absoluta na procedência de suas lentes. Trabalhamos exclusivamente com laboratórios certificados.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { brand: "Zeiss", name: "DuraVision Platinum UV", benefit: "Antirreflexo Premium", detail: "Tratamento de última geração com proteção UV 400 e 4× mais resistência a riscos." },
              { brand: "Essilor", name: "Crizal Sapphire 360°", benefit: "Visão Omnidirecional", detail: "Antirreflexo multidirecional com proteção contínua contra luz azul e UV." },
              { brand: "Hoya", name: "iD LifeStyle V+", benefit: "Progressiva HD Binocular", detail: "Tecnologia binocular que se adapta ao seu estilo de vida com precisão individual." },
            ].map(l => (
              <div key={l.brand} className="p-8 border" style={{ background: "rgba(249,247,248,0.05)", borderColor: `${GOLD}28` }}>
                <Badge variant="gold">{l.brand}</Badge>
                <h3 className="mt-4 mb-2" style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "1.18rem", fontWeight: 700 }}>{l.name}</h3>
                <p className="mb-3 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.15em" }}>{l.benefit}</p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.6)" }}>{l.detail}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Btn variant="gold" onClick={() => go("lentes")}>Comparar Tecnologias <ArrowRight size={13} /></Btn>
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="py-16 px-6" style={{ background: OFF_WHITE }}>
        <div className="max-w-7xl mx-auto">
          <div className="p-10 md:p-16 border-2" style={{ background: WINE, borderColor: GOLD }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <Badge variant="gold">Programa Corporativo & Institucional</Badge>
                <h2 className="mt-5 mb-4" style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: 700, lineHeight: 1.2 }}>
                  Atendimento Móvel para Empresas & Igrejas
                </h2>
                <p className="leading-relaxed mb-6" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.8)", lineHeight: 1.8 }}>
                  Levamos a experiência boutique até você. Nosso programa de saúde visual itinerante atende equipes corporativas e comunidades religiosas com agendamento exclusivo e preços diferenciados.
                </p>
                <div className="flex flex-col gap-2 mb-8">
                  {["Triagem visual in loco", "Condições especiais para grupos", "Emissão de O.S. e nota fiscal", "Entrega diretamente no local"].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <Check size={13} color={GOLD} />
                      <span className="text-sm" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.85)" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <Btn variant="gold">Falar com Consultor <ArrowRight size={13} /></Btn>
              </div>
              <div className="hidden md:flex items-center justify-center opacity-[0.08] pointer-events-none">
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: "12rem", color: OFF_WHITE, fontWeight: 700, lineHeight: 1 }}>TV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6" style={{ background: GRAPHITE }}>
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="Depoimentos" title="O que nossos clientes dizem" subtitle="Mais de uma década de relacionamentos construídos com confiança e excelência." light center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
            {testimonials.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
          <div className="text-center mt-10">
            <a href="https://instagram.com/oticastimevision" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              <Instagram size={14} />@oticastimevision
            </a>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-24 px-6" style={{ background: OFF_WHITE }}>
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="Saúde Visual" title="Dicas & Conteúdo Educativo" subtitle="Porque cuidar da visão começa com informação de qualidade." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { title: "3 sinais de que seus óculos venceram", desc: "Visão embaçada mesmo com graduação correta? Riscos que comprometem a visão? Saiba quando é hora de renovar suas lentes.", tag: "Lentes" },
              { title: "Armação ideal para seu tipo de rosto", desc: "Oval, redondo, quadrado ou coração? Descubra qual formato de armação valoriza suas feições com o guia Timevision.", tag: "Estilo" },
              { title: "Lentes de luz azul: quando usar?", desc: "Com a vida digital intensificada, proteger os olhos da luz artificial é essencial. Entenda como as lentes de filtragem funcionam.", tag: "Tecnologia" },
            ].map(post => (
              <div key={post.title} className="group cursor-pointer">
                <div className="mb-4 overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:opacity-80" style={{ height: "200px", background: `linear-gradient(140deg, ${GRAPHITE}, ${GRAY})` }}>
                  <Eye size={48} color={`${GOLD}50`} />
                </div>
                <Badge variant="gold">{post.tag}</Badge>
                <h3 className="mt-3 mb-2" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "1.08rem", fontWeight: 700, lineHeight: 1.3 }}>{post.title}</h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: FONT_BODY, color: GRAY }}>{post.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-24 px-6" style={{ background: GRAPHITE }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <SectionTitle label="Localização & Horários" title="Visite nossa Boutique" subtitle="Estamos no Recreio dos Bandeirantes, Rio de Janeiro, prontos para receber você." light />
            <div className="mt-8 flex flex-col gap-6">
              {[
                { Icon: MapPin, label: "Endereço", text: "Av. das Américas, Recreio dos Bandeirantes\nRio de Janeiro — RJ, CEP 22790-701" },
                { Icon: Clock, label: "Horários", text: "Segunda a Sexta: 10h às 19h\nSábado: 10h às 17h · Domingo: Fechado" },
                { Icon: Instagram, label: "Redes Sociais", text: "@oticastimevision" },
              ].map(({ Icon, label, text }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}38` }}>
                    <Icon size={17} color={GOLD} />
                  </div>
                  <div>
                    <p className="text-xs mb-1 uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.2em" }}>{label}</p>
                    <p style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.7)", lineHeight: 1.65, whiteSpace: "pre-line", fontSize: "0.9rem" }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Btn variant="gold" onClick={() => go("orcamento")}>Agendar Atendimento</Btn>
            </div>
          </div>
          <div className="relative overflow-hidden" style={{ height: "420px", border: `1px solid ${GOLD}28` }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=420&fit=crop&auto=format&q=75" alt="Localização Recreio dos Bandeirantes" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6" style={{ background: `${GRAPHITE}CC` }}>
                <MapPin size={30} color={GOLD} className="mx-auto mb-2" />
                <p style={{ fontFamily: FONT_LABEL, color: OFF_WHITE, letterSpacing: "0.2em", fontSize: "0.72rem", textTransform: "uppercase", lineHeight: 1.8 }}>
                  Recreio dos Bandeirantes<br />Rio de Janeiro — RJ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── SOBRE PAGE ───────────────────────────────────────────────────────────────

function SobrePage() {
  const attrs = [
    { name: "Compromisso", desc: "Com cada cliente, do primeiro contato à entrega final." },
    { name: "Dedicação", desc: "Total atenção na escolha da armação e precisão das lentes." },
    { name: "Respeito", desc: "Por cada pessoa e suas necessidades visuais únicas." },
    { name: "Ética", desc: "Transparência em preços, procedência e diagnósticos." },
    { name: "Responsabilidade", desc: "Social e ambiental em cada decisão da boutique." },
    { name: "Honestidade", desc: "Nunca indicamos o que não é necessário para sua saúde visual." },
    { name: "Seriedade", desc: "Profissionalismo e rigor técnico em cada par de óculos." },
    { name: "Verdade", desc: "Nossa maior promessa: nunca comprometemos sua visão." },
  ];
  return (
    <>
      <section className="relative flex items-end" style={{ height: "62vh", background: GRAPHITE }}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=800&fit=crop&auto=format&q=75" alt="Interior Timevision Ótica" className="w-full h-full object-cover grayscale opacity-25" />
        </div>
        <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: diamondPattern, backgroundSize: "40px 40px" }} />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none hidden lg:block" style={{ fontFamily: FONT_DISPLAY, fontSize: "18rem", color: OFF_WHITE, fontWeight: 700, lineHeight: 1 }}>TV</div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
          <Badge variant="gold">A Boutique</Badge>
          <h1 className="mt-4" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(2rem, 5vw, 4rem)", color: OFF_WHITE, fontWeight: 700, lineHeight: 1.1 }}>A História da<br />Timevision Ótica</h1>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: OFF_WHITE }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="mb-4 text-xs tracking-widest uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.3em" }}>O Conceito Recreio</p>
            <h2 className="mb-6" style={{ fontFamily: FONT_DISPLAY, fontSize: "2.1rem", color: GRAPHITE, fontWeight: 700, lineHeight: 1.2 }}>Onde a elegância encontra a ciência da visão</h2>
            <div className="space-y-5" style={{ fontFamily: FONT_BODY, color: GRAY, lineHeight: 1.85, fontSize: "0.97rem" }}>
              <p>A Timevision Ótica nasceu no Recreio dos Bandeirantes com uma missão precisa: democratizar o acesso ao luxo verdadeiro na óptica. Não o luxo de aparência, mas o luxo de substância — aquele que você sente na qualidade da lente, na durabilidade da armação e no cuidado com a sua saúde visual.</p>
              <p>Localizada em uma das regiões mais vibrantes do Rio de Janeiro, nossa boutique foi concebida para oferecer uma experiência que vai além da simples venda de óculos. Cada visita é um ritual de atenção personalizada, onde nossos especialistas dedicam o tempo necessário para compreender não apenas sua necessidade refrativa, mas seu estilo de vida e suas aspirações.</p>
              <p>Com parcerias exclusivas com os maiores laboratórios de lentes do mundo — Zeiss, Essilor e Hoya — e acesso às mais importantes grifes de eyewear internacional, a Timevision posiciona o Recreio no mapa mundial do luxo óptico.</p>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=700&fit=crop&auto=format&q=80" alt="Armações de luxo" className="w-full object-cover" style={{ height: "520px" }} />
            <div className="absolute -bottom-4 -left-4 w-full h-full border pointer-events-none" style={{ borderColor: GOLD, zIndex: -1 }} />
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: GRAPHITE }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionTitle label="Nossos Pilares" title="8 Atributos da Timevision" light center />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: `${GOLD}18` }}>
            {attrs.map((a, i) => (
              <div key={a.name} className="p-8" style={{ background: i % 2 === 0 ? GRAPHITE : "#252525" }}>
                <div className="mb-3" style={{ fontFamily: FONT_DISPLAY, color: GOLD, opacity: 0.38, fontWeight: 700, fontSize: "3.5rem", lineHeight: 1 }}>0{i + 1}</div>
                <h3 className="mb-3" style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "1.15rem", fontWeight: 700 }}>{a.name}</h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.55)" }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── COLEÇÕES PAGE ────────────────────────────────────────────────────────────

function ColecoesPage({ go }: { go: (p: Page) => void }) {
  const [catFilter, setCatFilter] = useState("Todos");
  const [brandFilter, setBrandFilter] = useState("Todos");
  const cats = ["Todos", "Feminino", "Masculino", "Solar", "Titânio"];
  const brands = ["Todos", "Ray-Ban", "Tom Ford", "Gucci", "Prada", "Oakley", "Timevision"];
  const all = [
    ...products,
    { id: 7, brand: "Prada", name: "PR 08YS Sunglass", category: "Solar", price: "R$ 4.100", img: "1508214751196-bcfd4ca60f91" },
    { id: 8, brand: "Ray-Ban", name: "Aviator RB3025", category: "Solar", price: "R$ 1.150", img: "1511499767150-a48a237f0083" },
    { id: 9, brand: "Oakley", name: "Flak 2.0 XL", category: "Solar", price: "R$ 1.350", img: "1574258495973-f010dfbb5371" },
  ];
  const filtered = all.filter(p => (catFilter === "Todos" || p.category === catFilter) && (brandFilter === "Todos" || p.brand === brandFilter));
  return (
    <section className="py-16 px-6 pt-32 min-h-screen" style={{ background: GRAPHITE }}>
      <div className="max-w-7xl mx-auto">
        <Badge variant="gold">Curadoria Timevision</Badge>
        <h1 className="mt-4 mb-10" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(2rem, 5vw, 4rem)", color: OFF_WHITE, fontWeight: 700 }}>Coleções & Grifes</h1>
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs mr-1" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase" }}>Categoria</span>
            {cats.map(f => (
              <button key={f} onClick={() => setCatFilter(f)} className="px-4 py-1.5 text-xs uppercase transition-all" style={{ fontFamily: FONT_LABEL, letterSpacing: "0.15em", background: catFilter === f ? GOLD : "transparent", color: catFilter === f ? OFF_WHITE : "rgba(249,247,248,0.45)", border: `1px solid ${catFilter === f ? GOLD : "rgba(249,247,248,0.2)"}` }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs mr-1" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase" }}>Grife</span>
            {brands.map(b => (
              <button key={b} onClick={() => setBrandFilter(b)} className="px-4 py-1.5 text-xs uppercase transition-all" style={{ fontFamily: FONT_LABEL, letterSpacing: "0.15em", background: brandFilter === b ? PETROL : "transparent", color: brandFilter === b ? OFF_WHITE : "rgba(249,247,248,0.45)", border: `1px solid ${brandFilter === b ? PETROL : "rgba(249,247,248,0.2)"}` }}>
                {b}
              </button>
            ))}
          </div>
        </div>
        <p className="mb-6 text-xs" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.4)", fontStyle: "italic" }}>
          {filtered.length} {filtered.length === 1 ? "modelo encontrado" : "modelos encontrados"}
        </p>
        {filtered.length === 0 ? (
          <div className="py-20 text-center" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.3)", fontStyle: "italic" }}>Nenhum modelo para os filtros selecionados.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} onContact={() => go("orcamento")} />)}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── LENTES PAGE ──────────────────────────────────────────────────────────────

function LentesPage({ go }: { go: (p: Page) => void }) {
  const [need, setNeed] = useState<string | null>(null);
  const [coating, setCoating] = useState<string | null>(null);
  const needs = ["Visão Simples", "Progressiva", "Bifocal", "Luz Azul", "Solar", "Ocupacional"];
  const coatings = ["Antirreflexo Premium", "Luz Azul", "Fotossensível", "Hidrófobo", "Polarizado"];
  const lenses = [
    { brand: "Zeiss", name: "DuraVision Platinum UV", highlight: "Resistência 4× superior", fit: ["Visão Simples", "Antirreflexo Premium"] },
    { brand: "Essilor", name: "Crizal Sapphire 360°", highlight: "Visão omnidirecional", fit: ["Progressiva", "Antirreflexo Premium", "Luz Azul"] },
    { brand: "Hoya", name: "iD LifeStyle V+", highlight: "Binocular HD", fit: ["Progressiva", "Ocupacional"] },
    { brand: "Kodak", name: "Unique HD", highlight: "Custo-benefício superior", fit: ["Visão Simples", "Bifocal"] },
    { brand: "Zeiss", name: "PhotoFusion X", highlight: "Escurecimento ultrarrápido", fit: ["Fotossensível", "Solar"] },
    { brand: "Essilor", name: "Transitions Signature 8", highlight: "Adaptação contínua", fit: ["Fotossensível", "Luz Azul"] },
  ];
  const filtered = lenses.filter(l => (!need && !coating) || (need && l.fit.includes(need)) || (coating && l.fit.includes(coating)));
  return (
    <>
      <section className="pt-32 pb-16 px-6 relative" style={{ background: PETROL }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: diamondPattern, backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <Badge variant="gold">Tecnologia & Saúde Visual</Badge>
          <h1 className="mt-4 mb-4" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(2rem, 5vw, 4rem)", color: OFF_WHITE, fontWeight: 700 }}>Lentes & Tecnologia</h1>
          <p className="max-w-2xl" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.7)", lineHeight: 1.8 }}>
            Selecione sua necessidade refrativa e o tipo de revestimento para encontrar a lente ideal para o seu estilo de vida.
          </p>
        </div>
      </section>
      <section className="py-16 px-6" style={{ background: OFF_WHITE }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="mb-4 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GRAPHITE, letterSpacing: "0.25em" }}>Necessidade Refrativa</p>
              <div className="flex flex-wrap gap-2">
                {needs.map(n => (
                  <button key={n} onClick={() => setNeed(need === n ? null : n)} className="px-4 py-2 text-xs transition-all" style={{ fontFamily: FONT_LABEL, background: need === n ? GRAPHITE : "transparent", color: need === n ? OFF_WHITE : GRAPHITE, border: `1px solid ${need === n ? GRAPHITE : "rgba(61,61,61,0.28)"}`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GRAPHITE, letterSpacing: "0.25em" }}>Tipo de Revestimento</p>
              <div className="flex flex-wrap gap-2">
                {coatings.map(c => (
                  <button key={c} onClick={() => setCoating(coating === c ? null : c)} className="px-4 py-2 text-xs transition-all" style={{ fontFamily: FONT_LABEL, background: coating === c ? PETROL : "transparent", color: coating === c ? OFF_WHITE : GRAPHITE, border: `1px solid ${coating === c ? PETROL : "rgba(61,61,61,0.28)"}`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {filtered.map(l => (
              <div key={`${l.brand}-${l.name}`} className="p-8 border" style={{ background: "#fff", borderColor: "rgba(61,61,61,0.1)" }}>
                <div className="flex items-start justify-between mb-5">
                  <Badge variant="petrol">{l.brand}</Badge>
                  <span className="text-xs" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase" }}>Certificado</span>
                </div>
                <h3 className="mb-2" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "1.1rem", fontWeight: 700 }}>{l.name}</h3>
                <p className="mb-4 text-sm italic" style={{ fontFamily: FONT_BODY, color: GOLD }}>{l.highlight}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {l.fit.map(tag => <span key={tag} className="text-xs px-2 py-0.5" style={{ background: `${PETROL}10`, color: PETROL, fontFamily: FONT_LABEL, letterSpacing: "0.08em", textTransform: "uppercase" }}>{tag}</span>)}
                </div>
                <Btn variant="gold" onClick={() => go("orcamento")} className="text-xs py-2 px-4">Solicitar</Btn>
              </div>
            ))}
          </div>
          <div className="p-10 text-center border-2" style={{ borderColor: GOLD, background: `${GOLD}07` }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <CheckCircle size={22} color={GOLD} />
              <h3 style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "1.25rem", fontWeight: 700 }}>Selo de Autenticidade Timevision</h3>
            </div>
            <p className="mx-auto" style={{ fontFamily: FONT_BODY, color: GRAY, lineHeight: 1.75, maxWidth: "600px" }}>
              Todas as nossas lentes possuem certificado de origem e são fornecidas diretamente pelos laboratórios parceiros autorizados. Jamais comprometemos a saúde visual de nossos clientes com produtos não certificados.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── ORÇAMENTO PAGE ───────────────────────────────────────────────────────────

function OrcamentoPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [rx, setRx] = useState<RxData>({});
  const [frame, setFrame] = useState<typeof products[0] | null>(null);

  function buildWA() {
    const od = rx?.od || {};
    const oe = rx?.oe || {};
    return encodeURIComponent(
      `*Orçamento VIP — Timevision Ótica*\n\n` +
      `👤 *Cliente:* ${form.name}\n📧 ${form.email}\n📱 ${form.phone}\n\n` +
      `👓 *Receita:*\nOD: Esf ${od.esferico || "—"} | Cil ${od.cilindrico || "—"} | Eixo ${od.eixo || "—"} | Add ${od.adicao || "—"}\n` +
      `OE: Esf ${oe.esferico || "—"} | Cil ${oe.cilindrico || "—"} | Eixo ${oe.eixo || "—"} | Add ${oe.adicao || "—"}\n\n` +
      `🕶️ *Armação:* ${frame ? `${frame.brand} — ${frame.name} (${frame.price})` : "A definir"}`
    );
  }

  const steps = ["Seus Dados", "Receita Visual", "Armação", "Confirmação"];

  return (
    <div className="pt-24 min-h-screen" style={{ background: OFF_WHITE }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <Badge variant="gold">Orçamento Exclusivo</Badge>
          <h1 className="mt-4" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "2.5rem", fontWeight: 700 }}>Orçamento VIP</h1>
          <p className="mt-2 text-sm" style={{ fontFamily: FONT_BODY, color: GRAY }}>Atendimento personalizado em até 2 horas úteis</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-5">
          {[1, 2, 3, 4].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center text-xs font-bold transition-all" style={{ fontFamily: FONT_LABEL, background: step >= s ? (step === s ? GRAPHITE : GOLD) : "transparent", color: step >= s ? OFF_WHITE : "rgba(61,61,61,0.3)", border: `1px solid ${step >= s ? (step === s ? GRAPHITE : GOLD) : "rgba(61,61,61,0.2)"}` }}>
                {step > s ? <Check size={11} /> : s}
              </div>
              {i < 3 && <div className="w-12 h-px" style={{ background: step > s ? GOLD : "rgba(61,61,61,0.15)" }} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-10 px-1">
          {steps.map((label, i) => (
            <span key={label} className="text-xs uppercase text-center" style={{ fontFamily: FONT_LABEL, color: step === i + 1 ? GRAPHITE : "rgba(61,61,61,0.35)", letterSpacing: "0.08em", flex: 1 }}>{label}</span>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="mb-8" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "1.5rem", fontWeight: 700 }}>Seus Dados</h2>
            <div className="flex flex-col gap-5">
              {[{ label: "Nome Completo", key: "name", type: "text", ph: "Seu nome completo" }, { label: "E-mail", key: "email", type: "email", ph: "seu@email.com" }, { label: "Telefone / WhatsApp", key: "phone", type: "tel", ph: "(21) 99999-9999" }].map(f => (
                <div key={f.key}>
                  <label className="block mb-2 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GRAPHITE, letterSpacing: "0.2em" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full p-4 outline-none transition-colors" style={{ fontFamily: FONT_BODY, border: "1px solid rgba(61,61,61,0.2)", background: "#fff", color: GRAPHITE }} />
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-end">
              <Btn variant="gold" onClick={() => setStep(2)}>Próximo <ChevronRight size={13} /></Btn>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-4" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "1.5rem", fontWeight: 700 }}>Receita Visual</h2>
            <p className="mb-6 text-sm" style={{ fontFamily: FONT_BODY, color: GRAY, lineHeight: 1.7 }}>Preencha os dados da sua receita. Se não tiver em mãos, pode deixar em branco.</p>
            <div className="p-6 border" style={{ borderColor: "rgba(61,61,61,0.12)", background: "#fff" }}>
              <PrescriptionGrid value={rx} onChange={setRx} />
            </div>
            <div className="mt-10 flex justify-between">
              <Btn variant="outline" onClick={() => setStep(1)}>Voltar</Btn>
              <Btn variant="gold" onClick={() => setStep(3)}>Próximo <ChevronRight size={13} /></Btn>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-4" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "1.5rem", fontWeight: 700 }}>Escolha sua Armação</h2>
            <p className="mb-6 text-sm" style={{ fontFamily: FONT_BODY, color: GRAY }}>Selecione uma armação de interesse ou deixe em branco para recomendações personalizadas.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map(p => (
                <div key={p.id} onClick={() => setFrame(frame?.id === p.id ? null : p)} className="flex gap-3 p-4 cursor-pointer transition-all" style={{ border: `2px solid ${frame?.id === p.id ? GOLD : "rgba(61,61,61,0.12)"}`, background: frame?.id === p.id ? `${GOLD}07` : "#fff" }}>
                  <div className="w-20 h-14 overflow-hidden flex-shrink-0 bg-zinc-100">
                    <img src={`https://images.unsplash.com/photo-${p.img}?w=120&h=80&fit=crop&auto=format&q=60`} alt={p.name} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs mb-0.5" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase" }}>{p.brand}</p>
                    <p className="text-sm font-medium truncate" style={{ fontFamily: FONT_BODY, color: GRAPHITE }}>{p.name}</p>
                    <p className="text-sm" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE }}>{p.price}</p>
                  </div>
                  {frame?.id === p.id && <Check size={16} color={GOLD} className="flex-shrink-0 self-center" />}
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
              <Btn variant="outline" onClick={() => setStep(2)}>Voltar</Btn>
              <Btn variant="gold" onClick={() => setStep(4)}>Próximo <ChevronRight size={13} /></Btn>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6" style={{ background: `${GOLD}15`, border: `2px solid ${GOLD}` }}>
              <CheckCircle size={30} color={GOLD} />
            </div>
            <h2 className="mb-4" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "1.8rem", fontWeight: 700 }}>Pronto, {form.name || "Cliente"}!</h2>
            <p className="mb-8 mx-auto" style={{ fontFamily: FONT_BODY, color: GRAY, lineHeight: 1.8, maxWidth: "420px" }}>Seu pedido de orçamento foi preparado. Clique abaixo para enviar ao WhatsApp VIP da Timevision Ótica.</p>
            <div className="text-left p-6 mb-8 border" style={{ borderColor: "rgba(61,61,61,0.12)", background: "#fff" }}>
              <p className="mb-3 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.2em" }}>Resumo do Pedido</p>
              <div className="flex flex-col gap-1 text-sm" style={{ fontFamily: FONT_BODY, color: GRAPHITE }}>
                <p><strong>Cliente:</strong> {form.name}</p>
                <p><strong>Telefone:</strong> {form.phone}</p>
                {frame && <p><strong>Armação:</strong> {frame.brand} — {frame.name}</p>}
              </div>
            </div>
            <a href={`https://wa.me/5521999999999?text=${buildWA()}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-widest transition-opacity hover:opacity-80" style={{ background: GOLD, color: OFF_WHITE, fontFamily: FONT_LABEL, letterSpacing: "0.2em" }}>
              <Send size={15} />Enviar para WhatsApp VIP
            </a>
            <p className="mt-4 text-xs" style={{ fontFamily: FONT_BODY, color: GRAY, fontStyle: "italic" }}>Tempo de resposta: até 2 horas úteis</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RASTREAMENTO PAGE ────────────────────────────────────────────────────────

const demoOS = {
  number: "OS-2025-0847", client: "Fernanda Albuquerque",
  frame: "Tom Ford FT5634-B", lens: "Essilor Crizal Sapphire 360°",
  steps: [
    { label: "Pedido Recebido", done: true, date: "28/06/2025 às 14:32" },
    { label: "No Laboratório", done: true, date: "29/06/2025 às 09:15" },
    { label: "Em Montagem", done: true, date: "30/06/2025 às 16:40" },
    { label: "Controle de Qualidade", done: false, date: null },
    { label: "Pronto para Entrega", done: false, date: null },
  ],
};

function RastreamentoPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<null | "found" | "not_found">(null);
  const [loading, setLoading] = useState(false);

  function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const hit = query.toLowerCase().includes("847") || query.toLowerCase().includes("fernanda");
      setResult(hit ? "found" : "not_found");
    }, 1100);
  }

  return (
    <div className="pt-24 min-h-screen" style={{ background: OFF_WHITE }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <Badge variant="petrol">Rastreamento</Badge>
          <h1 className="mt-4" style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "2.5rem", fontWeight: 700 }}>Acompanhe seu Pedido</h1>
          <p className="mt-2 text-sm" style={{ fontFamily: FONT_BODY, color: GRAY }}>Consulte o status de confecção dos seus óculos em tempo real</p>
        </div>
        <div className="flex gap-2 mb-3">
          <input type="text" placeholder="CPF ou número da O.S. (ex: OS-2025-0847)" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} className="flex-1 p-4 outline-none" style={{ fontFamily: FONT_BODY, border: "1px solid rgba(61,61,61,0.2)", background: "#fff", color: GRAPHITE }} />
          <button onClick={handleSearch} className="px-5 flex items-center justify-center transition-opacity hover:opacity-80" style={{ background: GRAPHITE, color: OFF_WHITE, minWidth: "52px" }}>
            {loading ? <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }} /> : <Search size={19} />}
          </button>
        </div>
        <p className="text-xs text-center mb-10" style={{ fontFamily: FONT_BODY, color: "rgba(61,61,61,0.35)", fontStyle: "italic" }}>Para demonstração, busque por "847" ou "Fernanda"</p>

        {result === "not_found" && (
          <div className="text-center p-8 border" style={{ borderColor: "rgba(61,61,61,0.12)", background: "#fff" }}>
            <AlertCircle size={30} color={WINE} className="mx-auto mb-3" />
            <p style={{ fontFamily: FONT_BODY, color: GRAPHITE }}>Nenhum pedido encontrado para <strong>"{query}"</strong>.</p>
            <p className="mt-2 text-sm" style={{ fontFamily: FONT_BODY, color: GRAY }}>Verifique o número da O.S. ou entre em contato via @oticastimevision.</p>
          </div>
        )}

        {result === "found" && (
          <div className="flex flex-col gap-4">
            <div className="p-6" style={{ background: "#fff", border: "1px solid rgba(61,61,61,0.1)" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs mb-1" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase" }}>{demoOS.number}</p>
                  <h2 style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontSize: "1.3rem", fontWeight: 700 }}>{demoOS.client}</h2>
                </div>
                <Badge variant="petrol">Em andamento</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm" style={{ borderColor: "rgba(61,61,61,0.1)" }}>
                {[{ label: "Armação", val: demoOS.frame }, { label: "Lentes", val: demoOS.lens }].map(({ label, val }) => (
                  <div key={label}>
                    <p className="text-xs mb-1 uppercase" style={{ fontFamily: FONT_LABEL, color: GRAY, letterSpacing: "0.15em" }}>{label}</p>
                    <p style={{ fontFamily: FONT_BODY, color: GRAPHITE }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6" style={{ background: "#fff", border: "1px solid rgba(61,61,61,0.1)" }}>
              <p className="mb-6 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.22em" }}>Status de Confecção</p>
              {demoOS.steps.map((s, i) => (
                <div key={s.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: s.done ? GOLD : "rgba(61,61,61,0.08)", border: `2px solid ${s.done ? GOLD : "rgba(61,61,61,0.18)"}` }}>
                      {s.done ? <Check size={13} color={OFF_WHITE} /> : <div className="w-2 h-2 rounded-full" style={{ background: "rgba(61,61,61,0.2)" }} />}
                    </div>
                    {i < demoOS.steps.length - 1 && <div className="w-px my-1" style={{ background: s.done ? `${GOLD}40` : "rgba(61,61,61,0.1)", minHeight: "28px", flex: 1 }} />}
                  </div>
                  <div className="pb-5">
                    <p style={{ fontFamily: FONT_BODY, color: s.done ? GRAPHITE : "rgba(61,61,61,0.35)", lineHeight: 2 }}>{s.label}</p>
                    {s.date && <p className="text-xs" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.1em" }}>{s.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────

const revenueData = [
  { mes: "Fev", valor: 28400, meta: 30000 },
  { mes: "Mar", valor: 31200, meta: 30000 },
  { mes: "Abr", valor: 26800, meta: 32000 },
  { mes: "Mai", valor: 34500, meta: 32000 },
  { mes: "Jun", valor: 29700, meta: 35000 },
  { mes: "Jul", valor: 38200, meta: 35000 },
];

const recentOrders = [
  { os: "OS-2025-0848", client: "Rodrigo Mendonça", frame: "Ray-Ban Aviator", lens: "Zeiss DuraVision", status: "Pronto", value: "R$ 2.890" },
  { os: "OS-2025-0847", client: "Fernanda Albuquerque", frame: "Tom Ford FT5634-B", lens: "Essilor Crizal", status: "Montagem", value: "R$ 5.200" },
  { os: "OS-2025-0846", client: "Carlos Eduardo Lima", frame: "Gucci GG0010S", lens: "Hoya iD LifeStyle", status: "Laboratório", value: "R$ 7.100" },
  { os: "OS-2025-0845", client: "Ana Paula Silveira", frame: "Timevision Signature", lens: "Zeiss PhotoFusion", status: "Entregue", value: "R$ 3.450" },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Pronto: { bg: `${GOLD}22`, color: GOLD },
  Montagem: { bg: `${WINE}22`, color: "#f87171" },
  Laboratório: { bg: "rgba(249,247,248,0.08)", color: "rgba(249,247,248,0.5)" },
  Entregue: { bg: `${PETROL}30`, color: "#60b4f5" },
};

function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [pdv, setPdv] = useState({ client: "", frame: "", lens: "", value: "" });
  const [os, setOs] = useState({ client: "", cpf: "", phone: "", frame: "", lens: "" });
  const [osRx, setOsRx] = useState<RxData>({});

  const tabs: { id: AdminTab; Icon: React.FC<{ size: number }>; label: string }[] = [
    { id: "dashboard", Icon: BarChart2, label: "Dashboard" },
    { id: "pdv", Icon: ShoppingBag, label: "PDV Rápido" },
    { id: "clientes", Icon: Users, label: "Clientes" },
    { id: "estoque", Icon: Package, label: "Estoque" },
    { id: "os", Icon: FileText, label: "Gerar O.S." },
    { id: "flyer", Icon: ImageIcon, label: "Flyer" },
  ];

  const inputStyle = { fontFamily: FONT_BODY, border: "1px solid rgba(249,247,248,0.1)", background: "#1A1A1A", color: OFF_WHITE, fontSize: "0.9rem" };
  const thStyle: React.CSSProperties = { fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.32)", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, fontWeight: 400, padding: "12px" };

  return (
    <div className="min-h-screen" style={{ background: "#111" }}>
      {/* Admin header */}
      <div className="px-5 py-4 flex items-center justify-between sticky top-0 z-40" style={{ background: "#161616", borderBottom: `1px solid ${GOLD}20` }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: GOLD }}>
            <span style={{ fontFamily: FONT_DISPLAY, color: GRAPHITE, fontWeight: 700, fontSize: "0.78rem" }}>TV</span>
          </div>
          <div>
            <p style={{ fontFamily: FONT_LABEL, color: OFF_WHITE, letterSpacing: "0.18em", fontSize: "0.68rem", textTransform: "uppercase" }}>Painel PDV & Gestão</p>
            <p style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.35)", fontSize: "0.72rem" }}>Timevision Ótica — Módulo Responsivo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs hidden sm:block" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.12em" }}>
            {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
        </div>
      </div>

      {/* Tab nav */}
      <div className="overflow-x-auto" style={{ background: "#1A1A1A", borderBottom: `1px solid ${GOLD}12` }}>
        <div className="flex px-4">
          {tabs.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setTab(id)} className="flex items-center gap-2 px-4 py-4 text-xs uppercase whitespace-nowrap transition-all border-b-2" style={{ fontFamily: FONT_LABEL, letterSpacing: "0.14em", color: tab === id ? GOLD : "rgba(249,247,248,0.38)", borderColor: tab === id ? GOLD : "transparent" }}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-8 max-w-7xl mx-auto">

        {tab === "dashboard" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Faturamento Jul", value: "R$ 38.200", sub: "+28,6% vs Jun", accent: GOLD },
                { label: "OS em Aberto", value: "12", sub: "3 prontas p/ entrega", accent: PETROL },
                { label: "Clientes Ativos", value: "247", sub: "Últimos 90 dias", accent: "#22c55e" },
                { label: "Ticket Médio", value: "R$ 3.183", sub: "Meta R$ 2.700 ✓", accent: WINE },
              ].map(k => (
                <div key={k.label} className="p-5" style={{ background: "#1A1A1A", border: `1px solid ${GOLD}12` }}>
                  <p className="text-xs mb-2 uppercase" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.35)", letterSpacing: "0.14em" }}>{k.label}</p>
                  <p style={{ fontFamily: FONT_DISPLAY, color: k.accent, fontSize: "1.6rem", fontWeight: 700 }}>{k.value}</p>
                  <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.3)" }}>{k.sub}</p>
                </div>
              ))}
            </div>
            <div className="p-6 mb-6" style={{ background: "#1A1A1A", border: `1px solid ${GOLD}12` }}>
              <p className="mb-5 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.22em" }}>Faturamento Mensal (R$)</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,247,248,0.04)" />
                  <XAxis dataKey="mes" tick={{ fontFamily: FONT_LABEL, fontSize: 11, fill: "rgba(249,247,248,0.38)", letterSpacing: "0.1em" } as any} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: FONT_LABEL, fontSize: 11, fill: "rgba(249,247,248,0.38)" } as any} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: "#222", border: `1px solid ${GOLD}30`, fontFamily: FONT_BODY, color: OFF_WHITE, fontSize: "0.85rem" }} formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]} labelStyle={{ color: GOLD, fontFamily: FONT_LABEL, letterSpacing: "0.1em" }} />
                  <Area type="monotone" dataKey="valor" stroke={GOLD} strokeWidth={2} fill="url(#gGrad)" name="Faturamento" />
                  <Area type="monotone" dataKey="meta" stroke={`${PETROL}90`} strokeWidth={1} strokeDasharray="4 4" fill="none" name="Meta" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto" style={{ background: "#1A1A1A", border: `1px solid ${GOLD}12` }}>
              <div className="p-4" style={{ borderBottom: `1px solid ${GOLD}10` }}>
                <p className="text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.22em" }}>Ordens de Serviço Recentes</p>
              </div>
              <table className="w-full text-sm">
                <thead><tr style={{ background: "#141414" }}>
                  {["O.S.", "Cliente", "Armação", "Lentes", "Status", "Valor"].map(h => <th key={h} className="text-left" style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.os} className="border-b hover:bg-white/[0.03] transition-colors" style={{ borderColor: `${GOLD}07` }}>
                      <td className="p-3" style={{ fontFamily: FONT_LABEL, color: GOLD, fontSize: "0.75rem", letterSpacing: "0.1em" }}>{o.os}</td>
                      <td className="p-3" style={{ fontFamily: FONT_BODY, color: OFF_WHITE }}>{o.client}</td>
                      <td className="p-3" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.55)", fontSize: "0.85rem" }}>{o.frame}</td>
                      <td className="p-3" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.55)", fontSize: "0.85rem" }}>{o.lens}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-xs" style={{ fontFamily: FONT_LABEL, letterSpacing: "0.1em", ...statusStyle[o.status] }}>{o.status}</span>
                      </td>
                      <td className="p-3" style={{ fontFamily: FONT_DISPLAY, color: GOLD }}>{o.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "pdv" && (
          <div className="max-w-lg">
            <h2 className="mb-8" style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "1.5rem", fontWeight: 700 }}>Venda Rápida (PDV)</h2>
            <div className="flex flex-col gap-5">
              {[{ label: "Nome do Cliente", key: "client", ph: "Nome completo" }, { label: "Armação", key: "frame", ph: "Ex: Ray-Ban Clubmaster" }, { label: "Lentes", key: "lens", ph: "Ex: Zeiss DuraVision" }, { label: "Valor Total (R$)", key: "value", ph: "Ex: 2.890,00" }].map(f => (
                <div key={f.key}>
                  <label className="block mb-2 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.45)", letterSpacing: "0.2em" }}>{f.label}</label>
                  <input type="text" placeholder={f.ph} value={(pdv as any)[f.key]} onChange={e => setPdv({ ...pdv, [f.key]: e.target.value })} className="w-full p-4 outline-none" style={inputStyle} />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <Btn variant="gold"><FileText size={13} />Gerar O.S.</Btn>
                <Btn variant="petrol">Salvar Cliente</Btn>
              </div>
            </div>
          </div>
        )}

        {tab === "clientes" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "1.5rem", fontWeight: 700 }}>Banco de Clientes</h2>
              <Btn variant="gold"><Plus size={13} />Novo Cliente</Btn>
            </div>
            <div className="flex gap-2 mb-5">
              <input type="text" placeholder="Buscar por nome, CPF ou telefone..." className="flex-1 p-3 outline-none" style={inputStyle} />
              <button className="px-4 transition-opacity hover:opacity-80" style={{ background: GOLD, color: OFF_WHITE }}><Search size={15} /></button>
            </div>
            <div style={{ background: "#1A1A1A", border: `1px solid ${GOLD}12` }}>
              <table className="w-full text-sm">
                <thead><tr style={{ background: "#141414" }}>
                  {["Cliente", "CPF", "Telefone", "Último Pedido", "Total Gasto"].map(h => <th key={h} className="text-left" style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {[
                    { name: "Fernanda Albuquerque", cpf: "***.***.***-82", phone: "(21) 99821-4567", last: "28/06/2025", total: "R$ 12.400" },
                    { name: "Rodrigo Mendonça", cpf: "***.***.***-31", phone: "(21) 97654-3210", last: "25/06/2025", total: "R$ 5.890" },
                    { name: "Ana Paula Silveira", cpf: "***.***.***-47", phone: "(21) 98765-0123", last: "20/06/2025", total: "R$ 8.200" },
                    { name: "Carlos Eduardo Lima", cpf: "***.***.***-68", phone: "(21) 91234-5678", last: "18/06/2025", total: "R$ 14.700" },
                    { name: "Beatriz Cavalcanti", cpf: "***.***.***-55", phone: "(21) 93456-7890", last: "10/06/2025", total: "R$ 3.200" },
                  ].map(c => (
                    <tr key={c.cpf} className="border-b hover:bg-white/[0.03] transition-colors" style={{ borderColor: `${GOLD}07` }}>
                      <td className="p-3" style={{ fontFamily: FONT_BODY, color: OFF_WHITE }}>{c.name}</td>
                      <td className="p-3" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.38)", fontSize: "0.78rem", letterSpacing: "0.1em" }}>{c.cpf}</td>
                      <td className="p-3" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.6)" }}>{c.phone}</td>
                      <td className="p-3" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.38)", fontSize: "0.78rem" }}>{c.last}</td>
                      <td className="p-3" style={{ fontFamily: FONT_DISPLAY, color: GOLD }}>{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "estoque" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "1.5rem", fontWeight: 700 }}>Gestão de Estoque</h2>
              <Btn variant="gold"><Plus size={13} />Novo Item</Btn>
            </div>
            <div style={{ background: "#1A1A1A", border: `1px solid ${GOLD}12` }}>
              <table className="w-full text-sm">
                <thead><tr style={{ background: "#141414" }}>
                  {["Produto", "Grife", "Categoria", "Estoque", "Preço", "Status"].map(h => <th key={h} className="text-left" style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {[
                    { product: "Clubmaster RB3016", brand: "Ray-Ban", cat: "Masculino", stock: 3, price: "R$ 1.290", status: "OK" },
                    { product: "FT5634-B Blue Block", brand: "Tom Ford", cat: "Feminino", stock: 1, price: "R$ 3.850", status: "Baixo" },
                    { product: "GG0010S Titanium", brand: "Gucci", cat: "Solar", stock: 2, price: "R$ 4.200", status: "OK" },
                    { product: "PR 56ZS Minimal", brand: "Prada", cat: "Feminino", stock: 0, price: "R$ 3.650", status: "Esgotado" },
                    { product: "Holbrook XL", brand: "Oakley", cat: "Solar", stock: 5, price: "R$ 890", status: "OK" },
                    { product: "Signature No. 3", brand: "Timevision", cat: "Titânio", stock: 2, price: "R$ 2.100", status: "OK" },
                  ].map(item => (
                    <tr key={item.product} className="border-b hover:bg-white/[0.03] transition-colors" style={{ borderColor: `${GOLD}07` }}>
                      <td className="p-3" style={{ fontFamily: FONT_BODY, color: OFF_WHITE }}>{item.product}</td>
                      <td className="p-3" style={{ fontFamily: FONT_LABEL, color: GOLD, fontSize: "0.78rem", letterSpacing: "0.12em" }}>{item.brand}</td>
                      <td className="p-3" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.6)" }}>{item.cat}</td>
                      <td className="p-3" style={{ fontFamily: FONT_DISPLAY, color: item.stock === 0 ? WINE : item.stock <= 1 ? "#fbbf24" : OFF_WHITE, fontWeight: 700 }}>{item.stock}</td>
                      <td className="p-3" style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.75)" }}>{item.price}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-xs" style={{ fontFamily: FONT_LABEL, letterSpacing: "0.1em", background: item.status === "OK" ? `${PETROL}28` : item.status === "Baixo" ? "#fbbf2420" : `${WINE}28`, color: item.status === "OK" ? "#60b4f5" : item.status === "Baixo" ? "#fbbf24" : "#f87171" }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "os" && (
          <div>
            <h2 className="mb-8" style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "1.5rem", fontWeight: 700 }}>Gerador de O.S. (A6 em 2 vias)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                {[{ label: "Nome do Cliente", key: "client", ph: "Nome completo" }, { label: "CPF", key: "cpf", ph: "000.000.000-00" }, { label: "Telefone", key: "phone", ph: "(21) 99999-9999" }, { label: "Armação", key: "frame", ph: "Ex: Tom Ford FT5634-B" }, { label: "Lentes", key: "lens", ph: "Ex: Essilor Crizal Sapphire" }].map(f => (
                  <div key={f.key}>
                    <label className="block mb-1.5 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.42)", letterSpacing: "0.2em" }}>{f.label}</label>
                    <input type="text" placeholder={f.ph} value={(os as any)[f.key]} onChange={e => setOs({ ...os, [f.key]: e.target.value })} className="w-full p-3 outline-none" style={inputStyle} />
                  </div>
                ))}
                <div className="p-4" style={{ background: "#1A1A1A", border: "1px solid rgba(249,247,248,0.08)" }}>
                  <p className="mb-3 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.2em" }}>Receita Visual</p>
                  <PrescriptionGrid value={osRx} onChange={setOsRx} />
                </div>
                <div className="flex gap-3 mt-2">
                  <Btn variant="gold"><Printer size={13} />Imprimir O.S.</Btn>
                  <Btn variant="outline-light"><Download size={13} />PDF</Btn>
                </div>
              </div>
              <div>
                <p className="mb-4 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.35)", letterSpacing: "0.2em" }}>Pré-visualização</p>
                <div className="p-6 max-w-xs" style={{ background: OFF_WHITE, border: `2px solid ${GOLD}50` }}>
                  <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: "1px solid rgba(61,61,61,0.12)" }}>
                    <Logo size="sm" />
                    <div className="text-right">
                      <p className="text-xs" style={{ fontFamily: FONT_LABEL, color: GRAPHITE, letterSpacing: "0.14em", textTransform: "uppercase" }}>O.S. #0849</p>
                      <p className="text-xs" style={{ fontFamily: FONT_BODY, color: GRAY }}>{new Date().toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <p className="text-xs mb-1 uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.16em" }}>Cliente</p>
                  <p className="text-sm font-medium mb-0.5" style={{ fontFamily: FONT_BODY, color: GRAPHITE }}>{os.client || "—"}</p>
                  <p className="text-xs mb-4" style={{ fontFamily: FONT_BODY, color: GRAY }}>{os.phone || "—"}</p>
                  <p className="text-xs mb-1 uppercase" style={{ fontFamily: FONT_LABEL, color: GOLD, letterSpacing: "0.16em" }}>Produto</p>
                  <p className="text-sm mb-0.5" style={{ fontFamily: FONT_BODY, color: GRAPHITE }}>Armação: {os.frame || "—"}</p>
                  <p className="text-sm mb-5" style={{ fontFamily: FONT_BODY, color: GRAPHITE }}>Lentes: {os.lens || "—"}</p>
                  <p className="text-center text-xs" style={{ fontFamily: FONT_LABEL, color: "rgba(61,61,61,0.3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>@oticastimevision</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "flyer" && (
          <div>
            <h2 className="mb-8" style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "1.5rem", fontWeight: 700 }}>Gerador de Flyer de Marketing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                {[
                  { label: "Título do Flyer", ph: "Ex: Semana das Grifes" },
                  { label: "Subtítulo", ph: "Ex: Até 20% em armações selecionadas" },
                  { label: "Período", ph: "Ex: 01 a 07 de Julho de 2025" },
                  { label: "Condição Especial", ph: "Ex: Parcelamento em até 12× sem juros" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block mb-1.5 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.42)", letterSpacing: "0.2em" }}>{f.label}</label>
                    <input type="text" placeholder={f.ph} className="w-full p-3 outline-none" style={inputStyle} />
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <Btn variant="gold"><Download size={13} />Exportar PNG</Btn>
                  <Btn variant="petrol"><Send size={13} />Enviar WhatsApp</Btn>
                </div>
              </div>
              <div>
                <p className="mb-4 text-xs uppercase" style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.35)", letterSpacing: "0.2em" }}>Pré-visualização</p>
                <div className="relative overflow-hidden p-8 text-center max-w-[280px]" style={{ background: GRAPHITE, border: `2px solid ${GOLD}`, aspectRatio: "4/5" }}>
                  <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: diamondPattern, backgroundSize: "30px 30px" }} />
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                    <Logo inverted size="sm" />
                    <div className="w-12 h-px" style={{ background: GOLD }} />
                    <h3 style={{ fontFamily: FONT_DISPLAY, color: OFF_WHITE, fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.2 }}>Semana das Grifes</h3>
                    <p style={{ fontFamily: FONT_BODY, color: "rgba(249,247,248,0.72)", fontSize: "0.82rem", lineHeight: 1.6 }}>Até 20% em armações selecionadas</p>
                    <div className="px-4 py-1.5" style={{ background: GOLD }}>
                      <p style={{ fontFamily: FONT_LABEL, color: GRAPHITE, fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>01 a 07 de Julho de 2025</p>
                    </div>
                    <p style={{ fontFamily: FONT_LABEL, color: "rgba(249,247,248,0.35)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>@oticastimevision</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");

  function go(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isAdmin = page === "admin";

  return (
    <div className="min-h-screen bg-background">
      {!isAdmin && <Header current={page} go={go} />}
      <main style={!isAdmin ? { paddingTop: "73px" } : undefined}>
        {page === "home" && <HomePage go={go} />}
        {page === "sobre" && <SobrePage />}
        {page === "colecoes" && <ColecoesPage go={go} />}
        {page === "lentes" && <LentesPage go={go} />}
        {page === "orcamento" && <OrcamentoPage />}
        {page === "rastreamento" && <RastreamentoPage />}
        {page === "admin" && <AdminPage />}
      </main>
      {!isAdmin && <Footer go={go} />}
    </div>
  );
}
