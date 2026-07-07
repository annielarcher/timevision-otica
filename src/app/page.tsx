'use client';

import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Instagram, Clock, Star, ArrowRight,
  Check, ChevronRight, Eye, Phone
} from "lucide-react";

const GOLD = "#B5996A";
const GRAPHITE = "#3D3D3D";
const WINE = "#900D13";
const PETROL = "#004168";
const OFF_WHITE = "#F9F7F8";
const GRAY = "#585858";

const diamondPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z' fill='none' stroke='%23B5996A' stroke-width='0.5'/%3E%3C/svg%3E")`;

const products = [
  { id: 1, brand: "Ray-Ban", name: "Clubmaster RB3016", category: "Masculino", price: "R$ 1.290", img: "1511499767150-a48a237f0083" },
  { id: 2, brand: "Tom Ford", name: "FT5634-B Blue Block", category: "Feminino", price: "R$ 3.850", img: "1574258495973-f010dfbb5371" },
  { id: 3, brand: "Gucci", name: "GG0010S Titanium", category: "Solar", price: "R$ 4.200", img: "1508214751196-bcfd4ca60f91" },
  { id: 4, brand: "Prada", name: "PR 56ZS Minimal", category: "Feminino", price: "R$ 3.650", img: "1548036161-4b6c6f931c27" },
  { id: 5, brand: "Oakley", name: "Holbrook XL", category: "Solar", price: "R$ 890", img: "1511499767150-a48a237f0083" },
  { id: 6, brand: "Timevision", name: "Signature No. 3", category: "Titânio", price: "R$ 2.100", img: "1574258495973-f010dfbb5371" },
];

const testimonials = [
  { name: "Fernanda Albuquerque", initials: "FA", rating: 5, text: "Atendimento impecável! Fui orientada com muito cuidado na escolha da armação ideal. As lentes Zeiss são de outra qualidade. Recomendo de olhos fechados." },
  { name: "Rodrigo Mendonça", initials: "RM", rating: 5, text: "Comprei meus óculos Tom Ford e adorei cada detalhe da experiência. Um ambiente sofisticado e profissionais extremamente qualificados no Recreio." },
  { name: "Ana Paula Silveira", initials: "AS", rating: 5, text: "Uso óculos há 20 anos e nunca fui tão bem atendida. A qualidade das lentes Essilor é incomparável. A Timevision é referência absoluta no Recreio." },
];

export default function HomePage() {
  const [filter, setFilter] = useState("Todos");
  const filters = ["Todos", "Feminino", "Masculino", "Solar", "Titânio", "Grifes"];
  const grifes = ["Ray-Ban", "Tom Ford", "Gucci", "Prada", "Oakley"];
  
  const filtered = filter === "Todos" 
    ? products 
    : products.filter(p => p.category === filter || (filter === "Grifes" && grifes.includes(p.brand)));

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ height: "88vh", background: GRAPHITE }}>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1600&h=1000&fit=crop&auto=format&q=80" 
            alt="Modelo com óculos de luxo" 
            className="w-full h-full object-cover grayscale" 
            style={{ opacity: 0.35 }} 
          />
        </div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: diamondPattern, backgroundSize: "40px 40px" }} />
        <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 text-xs mb-4 font-sans font-semibold" style={{ background: GOLD, color: OFF_WHITE, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Boutique Óptica Atemporal — Recreio dos Bandeirantes, RJ
            </span>
            <h1 className="mt-6 mb-4 text-brand-off-white font-display text-5xl md:text-7xl font-bold leading-tight tracking-wide">
              A Elegância
              <br />
              que sua Visão
              <br />
              Merece
            </h1>
            <p className="mb-10 text-brand-off-white/70 font-body text-base md:text-lg leading-relaxed max-w-md">
              Curadoria exclusiva de armações internacionais, lentes de altíssima precisão e atendimento personalizado.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/orcamento" 
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-tagline tracking-widest uppercase text-brand-off-white bg-brand-gold hover:opacity-75 transition-all"
              >
                Solicitar Orçamento VIP <ArrowRight size={13} />
              </Link>
              <Link 
                href="/colecoes" 
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-tagline tracking-widest uppercase text-brand-off-white border border-brand-off-white/40 bg-transparent hover:opacity-75 transition-all"
              >
                Conheça as Coleções
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-10 opacity-[0.07] pointer-events-none hidden md:block font-display text-[10rem] text-brand-off-white font-bold leading-none">TV</div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 px-6 bg-brand-off-white text-brand-graphite">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-4 text-xs font-tagline text-brand-gold tracking-widest uppercase font-bold">O Luxo de Enxergar Bem</p>
            <h2 className="mb-6 font-display text-4xl font-bold leading-tight">
              Mais do que óculos.
              <br />
              Uma experiência.
            </h2>
            <p className="mb-8 font-body text-brand-gray-mid leading-relaxed text-justify">
              No coração do Recreio dos Bandeirantes, a Timevision Ótica nasceu com um propósito preciso: oferecer uma experiência boutique única para quem entende que visão é investimento. Cada detalhe reflete nosso compromisso com excelência.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {["Compromisso", "Ética", "Seriedade", "Verdade", "Dedicação", "Respeito", "Responsabilidade", "Honestidade"].map(attr => (
                <div key={attr} className="flex items-center gap-2">
                  <div className="w-1 h-4 flex-shrink-0" style={{ background: GOLD }} />
                  <span className="font-tagline text-brand-graphite tracking-wide uppercase text-xs">{attr}</span>
                </div>
              ))}
            </div>
            <Link 
              href="/sobre" 
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-tagline tracking-widest uppercase text-brand-graphite border border-brand-graphite hover:opacity-75 transition-all"
            >
              Nossa História <ChevronRight size={13} />
            </Link>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden bg-zinc-200" style={{ aspectRatio: "4/5" }}>
              <img 
                src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=700&h=875&fit=crop&auto=format&q=80" 
                alt="Armações de luxo Timevision" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute bottom-6 left-6 p-4 bg-brand-off-white shadow-lg flex items-center space-x-2">
              <img src="/logos/icone/1.svg" className="h-6 w-6 opacity-90" alt="Logo Timevision" />
              <img src="/logos/logo-dark.svg" className="h-8 w-auto" alt="Timevision Ótica" />
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
            <div>
              <p className="mb-3 text-xs font-tagline text-brand-gold tracking-widest uppercase font-bold">Curadoria Exclusiva</p>
              <h2 className="mb-4 text-brand-off-white font-display text-4xl font-bold leading-tight">Coleções em Destaque</h2>
              <p className="text-brand-off-white/70 font-body text-sm leading-relaxed max-w-lg">
                Grifes internacionais selecionadas com rigor para compor nossa vitrine boutique.
              </p>
            </div>
            <Link 
              href="/colecoes" 
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-tagline tracking-widest uppercase text-brand-off-white border border-brand-off-white/40 hover:opacity-75 transition-all"
            >
              Ver Todas <ArrowRight size={13} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className="px-4 py-1.5 text-xs uppercase transition-all duration-200" 
                style={{ 
                  fontFamily: "var(--font-identification-05c)", 
                  letterSpacing: "0.18em", 
                  background: filter === f ? GOLD : "transparent", 
                  color: filter === f ? OFF_WHITE : "rgba(249,247,248,0.45)", 
                  border: `1px solid ${filter === f ? GOLD : "rgba(249,247,248,0.2)"}` 
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(product => (
              <div key={product.id} className="group relative overflow-hidden flex flex-col bg-[#1A1A1A]">
                <div className="relative overflow-hidden h-64 bg-zinc-900">
                  <img
                    src={`https://images.unsplash.com/photo-${product.img}?w=400&h=300&fit=crop&auto=format&q=75`}
                    alt={`${product.brand} ${product.name}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 text-xs" style={{ background: GOLD, color: OFF_WHITE, fontFamily: "var(--font-identification-05c)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <p className="text-xs mb-1 font-tagline text-brand-gold tracking-widest uppercase">{product.brand}</p>
                  <h3 className="mb-3 text-base font-body text-brand-off-white font-medium">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="font-display text-brand-gold text-lg font-bold">{product.price}</span>
                    <Link href={`/orcamento?frame=${product.id}`} className="text-xs py-2.5 px-4 font-tagline tracking-wider uppercase text-brand-graphite bg-brand-gold hover:opacity-75 transition-all">
                      Consultar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LENSES */}
      <section className="py-24 px-6 text-brand-off-white" style={{ background: PETROL }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs mb-4 bg-brand-gold text-brand-off-white font-tagline tracking-widest uppercase">
              Tecnologia & Procedência
            </span>
            <h2 className="mt-5 mb-4 font-display text-4xl font-bold">É de verdade!</h2>
            <p className="max-w-xl mx-auto font-body text-brand-off-white/70 leading-relaxed">
              Transparência absoluta na procedência de suas lentes. Trabalhamos exclusivamente com laboratórios certificados de excelência internacional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { brand: "Zeiss", name: "DuraVision Platinum UV", benefit: "Antirreflexo Premium", detail: "Tratamento de última geração com proteção UV 400 e 4× mais resistência a riscos." },
              { brand: "Essilor", name: "Crizal Sapphire 360°", benefit: "Visão Omnidirecional", detail: "Antirreflexo multidirecional com proteção contínua contra luz azul e UV." },
              { brand: "Hoya", name: "iD LifeStyle V+", benefit: "Progressiva HD Binocular", detail: "Tecnologia binocular que se adapta ao seu estilo de vida com precisão individual." },
            ].map(l => (
              <div key={l.brand} className="p-8 border bg-white/5" style={{ borderColor: `${GOLD}28` }}>
                <span className="inline-block px-3 py-1 text-xs mb-4 bg-brand-gold text-brand-off-white font-tagline tracking-widest uppercase">
                  {l.brand}
                </span>
                <h3 className="mt-4 mb-2 font-display text-2xl font-bold">{l.name}</h3>
                <p className="mb-3 text-xs font-tagline text-brand-gold tracking-widest uppercase font-bold">{l.benefit}</p>
                <p className="text-sm font-body text-brand-off-white/60 leading-relaxed text-justify">{l.detail}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/lentes" 
              className="inline-flex items-center gap-2 px-8 py-4 text-xs font-tagline tracking-widest uppercase text-brand-off-white bg-brand-gold hover:opacity-75 transition-all"
            >
              Comparar Tecnologias <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="py-16 px-6 bg-brand-off-white">
        <div className="max-w-7xl mx-auto">
          <div className="p-10 md:p-16 border-2 text-brand-off-white" style={{ background: WINE, borderColor: GOLD }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block px-3 py-1 text-xs mb-4 bg-brand-gold text-brand-off-white font-tagline tracking-widest uppercase">
                  Programa Corporativo & Institucional
                </span>
                <h2 className="mt-5 mb-4 font-display text-3xl font-bold leading-tight">
                  Atendimento Móvel para Empresas & Igrejas
                </h2>
                <p className="font-body text-brand-off-white/80 leading-relaxed mb-6 text-justify">
                  Levamos a experiência boutique até você. Nosso programa de saúde visual itinerante atende equipes corporativas e comunidades religiosas com agendamento exclusivo e condições especiais.
                </p>
                <div className="flex flex-col gap-2 mb-8">
                  {["Triagem visual in loco", "Condições especiais para grupos", "Emissão de O.S. e nota fiscal", "Entrega diretamente no local"].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <Check size={13} color={GOLD} />
                      <span className="text-sm font-body text-brand-off-white/90">{item}</span>
                    </div>
                  ))}
                </div>
                <a 
                  href="https://wa.me/5521999999999?text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+o+atendimento+itinerante+Timevision+para+empresas."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-tagline tracking-widest uppercase text-brand-graphite bg-brand-gold hover:opacity-75 transition-all"
                >
                  Falar com Consultor <ArrowRight size={13} />
                </a>
              </div>
              <div className="hidden md:flex items-center justify-center opacity-[0.08] pointer-events-none font-display text-[12rem] font-bold">
                TV
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 text-brand-off-white" style={{ background: GRAPHITE }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs mb-4 bg-brand-gold text-brand-off-white font-tagline tracking-widest uppercase">
              Depoimentos
            </span>
            <h2 className="mt-4 mb-4 font-display text-4xl font-bold">O que nossos clientes dizem</h2>
            <p className="max-w-xl mx-auto font-body text-brand-off-white/60 leading-relaxed text-center">
              Compromisso e carinho com a saúde visual que geram amizades de longo prazo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
            {testimonials.map((t, i) => (
              <div key={i} className="relative p-8 bg-brand-off-white text-brand-graphite overflow-hidden flex flex-col justify-between">
                <div className="absolute bottom-2 right-3 opacity-[0.04] pointer-events-none font-display text-8xl font-bold">TV</div>
                <div>
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={13} fill={GOLD} color={GOLD} />
                    ))}
                  </div>
                  <p className="mb-6 italic relative z-10 font-body leading-relaxed text-sm text-justify">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center text-sm font-bold bg-brand-graphite text-brand-gold font-tagline">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-body">{t.name}</p>
                    <p className="text-[10px] font-tagline text-brand-gold tracking-widest uppercase">Cliente Verificada</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-24 px-6 bg-brand-off-white text-brand-graphite">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="inline-block px-3 py-1 text-xs mb-4 bg-brand-gold text-brand-off-white font-tagline tracking-widest uppercase">
              Saúde Visual
            </span>
            <h2 className="mb-4 font-display text-4xl font-bold">Dicas & Conteúdo Educativo</h2>
            <p className="font-body text-brand-gray-mid max-w-md">Porque cuidar da visão começa com informação de qualidade.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { title: "3 sinais de que seus óculos venceram", desc: "Visão embaçada mesmo com graduação correta? Riscos que comprometem a visão? Saiba quando é hora de renovar suas lentes.", tag: "Lentes" },
              { title: "Armação ideal para seu tipo de rosto", desc: "Oval, redondo, quadrado ou coração? Descubra qual formato de armação valoriza suas feições com o guia Timevision.", tag: "Estilo" },
              { title: "Lentes de luz azul: quando usar?", desc: "Com a vida digital intensificada, proteger os olhos da luz artificial é essencial. Entenda como as lentes de filtragem funcionam.", tag: "Tecnologia" },
            ].map(post => (
              <div key={post.title} className="group cursor-pointer">
                <div className="mb-4 overflow-hidden flex items-center justify-center transition-transform duration-500 bg-brand-graphite/10 h-48">
                  <Eye size={48} className="opacity-20 text-brand-graphite" />
                </div>
                <span className="inline-block px-3 py-1 text-xs mb-3 bg-brand-gold text-brand-off-white font-tagline tracking-widest uppercase">
                  {post.tag}
                </span>
                <h3 className="mt-3 mb-2 font-display text-lg font-bold text-brand-graphite group-hover:text-brand-gold transition-colors">{post.title}</h3>
                <p className="text-sm font-body text-brand-gray-mid leading-relaxed text-justify">{post.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-24 px-6 text-brand-off-white" style={{ background: GRAPHITE }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="inline-block px-3 py-1 text-xs mb-4 bg-brand-gold text-brand-off-white font-tagline tracking-widest uppercase">
              Localização & Horários
            </span>
            <h2 className="mb-4 font-display text-4xl font-bold">Visite nossa Boutique</h2>
            <p className="font-body text-brand-off-white/70 max-w-sm mb-8 leading-relaxed">
              Estamos no Recreio dos Bandeirantes, Rio de Janeiro, prontos para receber você.
            </p>
            <div className="mt-8 flex flex-col gap-6">
              {[
                { Icon: MapPin, label: "Endereço", text: "Av. das Américas, Recreio dos Bandeirantes\nRio de Janeiro — RJ, CEP 22790-701" },
                { Icon: Clock, label: "Horários", text: "Segunda a Sexta: 10h às 19h\nSábado: 10h às 17h · Domingo: Fechado" },
                { Icon: Instagram, label: "Redes Sociais", text: "@oticastimevision" },
              ].map(({ Icon, label, text }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-brand-gold/10 border border-brand-gold/30">
                    <Icon size={17} color={GOLD} />
                  </div>
                  <div>
                    <p className="text-xs mb-1 font-tagline text-brand-gold tracking-widest uppercase">{label}</p>
                    <p className="font-body text-brand-off-white/70 leading-relaxed whitespace-pre-line text-sm">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link 
                href="/orcamento" 
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-tagline tracking-widest uppercase text-brand-off-white bg-brand-gold hover:opacity-75 transition-all"
              >
                Agendar Atendimento
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden w-full" style={{ height: "420px", border: `1px solid ${GOLD}28` }}>
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=420&fit=crop&auto=format&q=75" 
              alt="Localização Recreio dos Bandeirantes" 
              className="w-full h-full object-cover opacity-40" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 bg-brand-graphite/80 border border-brand-gold/30 shadow-lg">
                <MapPin size={30} color={GOLD} className="mx-auto mb-2" />
                <p className="font-tagline text-brand-off-white text-xs tracking-widest uppercase leading-loose">
                  Recreio dos Bandeirantes
                  <br />
                  Rio de Janeiro — RJ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
