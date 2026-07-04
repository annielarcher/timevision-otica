'use client';

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Globe, Zap } from "lucide-react";

const GOLD = "#B5996A";
const GRAPHITE = "#3D3D3D";
const PETROL = "#004168";
const OFF_WHITE = "#F9F7F8";

const diamondPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z' fill='none' stroke='%23B5996A' stroke-width='0.5'/%3E%3C/svg%3E")`;

const lenses = [
  { brand: "Zeiss", name: "DuraVision Platinum UV", highlight: "Resistência 4× superior", fit: ["Visão Simples", "Antirreflexo Premium"] },
  { brand: "Essilor", name: "Crizal Sapphire 360°", highlight: "Visão omnidirecional", fit: ["Progressiva", "Antirreflexo Premium", "Luz Azul"] },
  { brand: "Hoya", name: "iD LifeStyle V+", highlight: "Binocular HD", fit: ["Progressiva", "Ocupacional"] },
  { brand: "Kodak", name: "Unique HD", highlight: "Custo-benefício superior", fit: ["Visão Simples", "Bifocal"] },
  { brand: "Zeiss", name: "PhotoFusion X", highlight: "Escurecimento ultrarrápido", fit: ["Fotossensível", "Solar"] },
  { brand: "Essilor", name: "Transitions Signature 8", highlight: "Adaptação contínua", fit: ["Fotossensível", "Luz Azul"] },
];

export default function LentesPage() {
  const [need, setNeed] = useState<string | null>(null);
  const [coating, setCoating] = useState<string | null>(null);
  const needs = ["Visão Simples", "Progressiva", "Bifocal", "Luz Azul", "Solar", "Ocupacional"];
  const coatings = ["Antirreflexo Premium", "Luz Azul", "Fotossensível", "Hidrófobo", "Polarizado"];

  const filtered = lenses.filter(l => 
    (!need && !coating) || 
    (need && l.fit.includes(need)) || 
    (coating && l.fit.includes(coating))
  );

  return (
    <>
      <section className="pt-32 pb-16 px-6 relative" style={{ background: PETROL }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: diamondPattern, backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 text-xs mb-4" style={{ background: GOLD, color: OFF_WHITE, fontFamily: "var(--font-identification-05c)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Tecnologia & Saúde Visual
          </span>
          <h1 className="mt-4 mb-4 text-brand-off-white font-display text-4xl md:text-5xl font-bold">Lentes & Tecnologia</h1>
          <p className="max-w-2xl text-brand-off-white/70 font-body leading-relaxed">
            Selecione sua necessidade refrativa e o tipo de revestimento para encontrar a lente ideal para o seu estilo de vida.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-brand-off-white">
        <div className="max-w-7xl mx-auto text-brand-graphite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="mb-4 text-xs font-tagline text-brand-graphite font-bold tracking-widest uppercase">Necessidade Refrativa</p>
              <div className="flex flex-wrap gap-2">
                {needs.map(n => (
                  <button 
                    key={n} 
                    onClick={() => setNeed(need === n ? null : n)} 
                    className="px-4 py-2 text-xs transition-all uppercase" 
                    style={{ 
                      fontFamily: "var(--font-identification-05c)", 
                      background: need === n ? GRAPHITE : "transparent", 
                      color: need === n ? OFF_WHITE : GRAPHITE, 
                      border: `1px solid ${need === n ? GRAPHITE : "rgba(61,61,61,0.28)"}`, 
                      letterSpacing: "0.1em"
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-tagline text-brand-graphite font-bold tracking-widest uppercase">Tipo de Revestimento</p>
              <div className="flex flex-wrap gap-2">
                {coatings.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCoating(coating === c ? null : c)} 
                    className="px-4 py-2 text-xs transition-all uppercase" 
                    style={{ 
                      fontFamily: "var(--font-identification-05c)", 
                      background: coating === c ? PETROL : "transparent", 
                      color: coating === c ? OFF_WHITE : GRAPHITE, 
                      border: `1px solid ${coating === c ? PETROL : "rgba(61,61,61,0.28)"}`, 
                      letterSpacing: "0.1em"
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {filtered.map(l => (
              <div key={`${l.brand}-${l.name}`} className="p-8 border bg-white flex flex-col justify-between" style={{ borderColor: "rgba(61,61,61,0.1)" }}>
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <span className="inline-block px-3 py-1 text-xs" style={{ background: PETROL, color: OFF_WHITE, fontFamily: "var(--font-identification-05c)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                      {l.brand}
                    </span>
                    <span className="text-xs text-brand-gold font-tagline tracking-widest uppercase font-bold">Certificado</span>
                  </div>
                  <h3 className="mb-2 text-brand-graphite font-display text-xl font-bold">{l.name}</h3>
                  <p className="mb-4 text-sm text-brand-gold font-body italic">{l.highlight}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {l.fit.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5" style={{ background: `${PETROL}10`, color: PETROL, fontFamily: "var(--font-identification-05c)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/orcamento?lens=${l.name}`} className="text-center text-xs py-3 px-4 transition-all uppercase text-brand-off-white bg-brand-gold hover:opacity-75 font-tagline tracking-widest">
                  Solicitar Lente
                </Link>
              </div>
            ))}
          </div>

          <div className="p-10 text-center border-2" style={{ borderColor: GOLD, background: `${GOLD}07` }}>
            <div className="flex items-center justify-center gap-3 mb-3 text-brand-gold">
              <CheckCircle size={22} />
              <h3 className="font-display text-brand-graphite text-lg font-bold">Selo de Autenticidade Timevision</h3>
            </div>
            <p className="mx-auto text-brand-gray-mid font-body leading-relaxed max-w-xl text-justify">
              Todas as nossas lentes possuem certificado de origem e são fornecidas diretamente pelos laboratórios parceiros autorizados. Jamais comprometemos a saúde visual de nossos clientes com produtos não certificados.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
